import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const summarizeVideo = async (req, res) => {
  try {
    const { videoUrl, title } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: "Video URL is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error:
          "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.",
      });
    }

    // Get a generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create a prompt for video summarization
    const prompt = `
    Please provide a comprehensive summary of the video lecture titled "${title}" from the following video URL: ${videoUrl}

    Since I cannot directly access the video content from the URL, please provide a general academic lecture summary template that would be helpful for students, including:

    1. Key Learning Objectives
    2. Main Topics Covered
    3. Important Concepts and Definitions
    4. Practical Applications
    5. Summary Points for Review

    Please format this as a structured summary that would be useful for student notes and review purposes.

    Note: This is a placeholder summary since the actual video content cannot be accessed directly. In a production environment, you would need to:
    - Extract audio from the video
    - Convert speech to text
    - Then summarize the transcript
    `;

    // Generate the summary
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.status(200).json({
      success: true,
      summary: summary,
      videoUrl: videoUrl,
      title: title,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating video summary:", error);

    // Handle specific Google AI errors
    if (error.message.includes("API_KEY_INVALID")) {
      return res.status(401).json({
        error:
          "Invalid Gemini API key. Please check your API key configuration.",
      });
    }

    if (error.message.includes("QUOTA_EXCEEDED")) {
      return res.status(429).json({
        error: "API quota exceeded. Please try again later.",
      });
    }

    res.status(500).json({
      error: "Failed to generate video summary. Please try again later.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
