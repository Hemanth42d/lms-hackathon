import express from "express";
import rateLimit from "express-rate-limit";

const router = express.Router();

const summarizerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // max 30 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/ai/summarize
router.post("/ai/summarize", summarizerLimiter, async (req, res) => {
  try {
    const { title = "", description = "" } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY not configured on server" });
    }

    const trimmedTitle = String(title).slice(0, 300);
    const trimmedDesc = String(description).slice(0, 4000);
    if (!trimmedTitle && !trimmedDesc) {
      return res.status(400).json({ message: "Missing title or description" });
    }

    const prompt = `Summarize the following lesson into concise bullet points. Avoid fluff, focus on key concepts, definitions, and steps.\n\nTitle: ${trimmedTitle}\n\nDescription: ${trimmedDesc}`;

    const doFetch = typeof fetch === "function" ? fetch : (await import("node-fetch")).default;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const resp = await doFetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          signal: controller.signal,
        }
      );

      if (!resp.ok) {
        const text = await resp.text();
        return res.status(502).json({ message: "Gemini API error", detail: text });
      }

      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
      return res.status(200).json({ summary: text });
    } finally {
      clearTimeout(timeout);
    }
  } catch (err) {
    const status = err?.name === "AbortError" ? 504 : 500;
    return res.status(status).json({ message: err.message || "Failed to summarize" });
  }
});

export default router;
// Summarize from video URL (YouTube transcript based)
router.post("/ai/summarize-from-url", summarizerLimiter, async (req, res) => {
  try {
    const { videoUrl = "", transcriptUrl = "" } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY not configured on server" });
    }
    let urlString = String(videoUrl || "").trim();
    if (!urlString) {
      return res.status(400).json({ message: "Missing videoUrl" });
    }
    let url;
    try {
      url = new URL(urlString);
    } catch (_) {
      return res.status(400).json({ message: "Invalid videoUrl" });
    }

    const isYouTube = /youtube\.com|youtu\.be/.test(url.hostname);
    const isDrive = /drive\.google\.com/.test(url.hostname);

    const doFetch = typeof fetch === "function" ? fetch : (await import("node-fetch")).default;

    const decodeHtmlEntities = (str) =>
      String(str)
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#10;/g, "\n")
        .replace(/&#13;/g, "\r");

    const getYouTubeId = (u) => {
      try {
        if (u.hostname.includes("youtu.be")) {
          return u.pathname.replace("/", "");
        }
        const v = u.searchParams.get("v");
        if (v) return v;
      } catch (_) {}
      return "";
    };

    const fetchYouTubeTranscript = async (videoId) => {
      const candidates = [
        `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`,
        `https://www.youtube.com/api/timedtext?lang=en-US&v=${videoId}`,
        `https://www.youtube.com/api/timedtext?lang=en&kind=asr&v=${videoId}`,
        `https://www.youtube.com/api/timedtext?lang=en-US&kind=asr&v=${videoId}`,
      ];
      for (const endpoint of candidates) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
          const r = await doFetch(endpoint, { signal: controller.signal });
          if (!r.ok) continue;
          const xml = await r.text();
          // Extract <text>...</text>
          const matches = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)];
          if (matches.length === 0) continue;
          const joined = matches
            .map((m) => decodeHtmlEntities(m[1]).replace(/\s+/g, " ").trim())
            .filter(Boolean)
            .join(" ");
          if (joined.length > 0) return joined;
        } catch (_) {
          // try next
        } finally {
          clearTimeout(timeout);
        }
      }
      return "";
    };

    let transcript = "";

    // 1) Prefer transcriptUrl if provided and public
    if (transcriptUrl) {
      try {
        const tUrl = new URL(String(transcriptUrl));
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
          const tResp = await doFetch(tUrl.toString(), { signal: controller.signal });
          if (tResp.ok) {
            const tText = await tResp.text();
            transcript = tText.slice(0, 20000);
          }
        } finally {
          clearTimeout(timeout);
        }
      } catch (_) {
        // ignore and fallback
      }
    }

    if (transcript.length === 0) {
      // 2) Fallback to YouTube transcript if it is a YouTube URL
      if (isYouTube) {
        const id = getYouTubeId(url);
        if (!id) {
          return res.status(400).json({ message: "Unable to parse YouTube video ID" });
        }
        transcript = await fetchYouTubeTranscript(id);
        if (!transcript) {
          return res.status(422).json({ message: "Transcript not available for this YouTube video. Ensure captions are public/enabled or provide a transcript URL." });
        }
      } else if (isDrive) {
        return res.status(422).json({ message: "Summarization needs a transcript URL for Drive videos. Save a public text link in the lecture and try again." });
      } else {
        return res.status(400).json({ message: "Only YouTube or Google Drive links are supported" });
      }
    }
    if (isYouTube) {
      const id = getYouTubeId(url);
      if (!id) {
        return res.status(400).json({ message: "Unable to parse YouTube video ID" });
      }
      transcript = await fetchYouTubeTranscript(id);
      if (!transcript) {
        return res.status(422).json({ message: "Transcript not available for this YouTube video. Ensure captions are public/enabled." });
      }
    } else if (isDrive) {
      // Drive does not expose transcripts; user must provide a YouTube URL with captions
      return res.status(422).json({ message: "Summarization from Google Drive links is not supported because transcripts are unavailable. Please provide a YouTube URL with public captions." });
    } else {
      return res.status(400).json({ message: "Only YouTube or Google Drive links are supported" });
    }

    const limitedTranscript = transcript.slice(0, 12000);
    const prompt = `Summarize the following lecture transcript into clear, concise bullet points. Focus on key concepts, definitions, formulas, steps, and examples. Avoid fluff.\n\nTranscript:\n${limitedTranscript}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const resp = await doFetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          signal: controller.signal,
        }
      );
      if (!resp.ok) {
        const text = await resp.text();
        return res.status(502).json({ message: "Gemini API error", detail: text });
      }
      const data = await resp.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
      return res.status(200).json({ summary: text });
    } finally {
      clearTimeout(timeout);
    }
  } catch (err) {
    const status = err?.name === "AbortError" ? 504 : 500;
    return res.status(status).json({ message: err.message || "Failed to summarize from URL" });
  }
});


