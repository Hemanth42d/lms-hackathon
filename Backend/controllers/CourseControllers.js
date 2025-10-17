import courseModel from "../models/course-model.js";
import lectureModel from "../models/lecture-model.js";
import enrollmentModel from "../models/enrollment-model.js";
import userModel from "../models/user-model.js";

export const createcourse = async (req, res) => {
  try {
    const { title, description, category, thumbnailUrl, duration } = req.body;

    if (!title || !description || !category || !duration) {
      return res.json({
        error: true,
        message: "Some fields are missing",
      });
    }

    const newCourse = await courseModel.create({
      title,
      description,
      category,
      thumbnail: thumbnailUrl || "",
      duration,
    });

    return res.json({
      success: true,
      message: "Successfully created course",
      course: newCourse,
    });
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await courseModel
      .find({})
      .populate({ path: "instructor", select: "userName email" });
    return res.json({
      success: true,
      message: "Courses fetched successfully",
      courses: courses || [],
    });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: true, message: "userId is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const enrollments = await enrollmentModel
      .find({ user: userId })
      .populate({
        path: "course",
        select: "title description category thumbnailUrl duration lectures assignments discussions",
      })
      .lean();

    const results = (enrollments || []).map((e) => {
      const totalLessons = Array.isArray(e.course?.lectures) ? e.course.lectures.length : 0;
      const lessonsCompleted = Array.isArray(e.completedLectures) ? e.completedLectures.length : 0;
      const lastAccessed = e.lastAccessed || e.enrolledAt;
      return {
        id: e._id,
        courseId: e.course?._id,
        title: e.course?.title,
        duration: e.course?.duration || "0 hours",
        instructor: e.course?.instructor || undefined,
        category: e.course?.category,
        image: e.course?.thumbnailUrl || "",
        progress: e.progress ?? (totalLessons ? Math.round((lessonsCompleted / totalLessons) * 100) : 0),
        lastAccessed,
        status: e.progress === 100 ? "Completed" : "In Progress",
        lessonsCompleted,
        totalLessons,
      };
    });

    return res.json({ success: true, message: "My courses fetched", courses: results });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      return res.status(400).json({ error: true, message: "userId and courseId are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: true, message: "Course not found" });
    }

    const existing = await enrollmentModel.findOne({ user: userId, course: courseId });
    if (existing) {
      return res.json({ success: true, message: "Already enrolled", enrollment: existing });
    }

    const enrollment = await enrollmentModel.create({ user: userId, course: courseId, progress: 0 });
    return res.status(201).json({ success: true, message: "Enrolled successfully", enrollment });
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const addLectures = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, duration, videoUrl, pdfUrl, pptUrl } = req.body;

    if (!title || !description || !videoUrl) {
      return res.json({
        error: true,
        message: "Title, description, and video URL are required",
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        error: true,
        message: "Course not found",
      });
    }

    const newLecture = await lectureModel.create({
      title,
      description,
      duration,
      videoUrl,
      pdfUrl: pdfUrl || "",
      pptUrl: pptUrl || "",
      courseId: courseId,
    });

    course.lectures = course.lectures || [];
    course.lectures.push(newLecture._id);
    await course.save();

    res.json({
      success: true,
      message: "Lecture created and linked to course successfully",
      lecture: newLecture,
    });
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};

export const getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await courseModel.findById(courseId).populate("lectures");
    if (!course) {
      return res.json({
        error: true,
        message: "Course not found",
      });
    }

    // Alternative: Get lectures by courseId directly
    // const lectures = await lectureModel.find({ courseId: courseId });

    return res.json({
      success: true,
      message: "Lectures fetched successfully",
      lectures: course.lectures || [],
    });
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};

export const updateLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { title, description, duration, videoUrl, pdfUrl, pptUrl } = req.body;

    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.json({
        error: true,
        message: "Lecture not found",
      });
    }

    // Update lecture fields
    const updatedLecture = await lectureModel.findByIdAndUpdate(
      lectureId,
      {
        title: title || lecture.title,
        description: description || lecture.description,
        duration: duration || lecture.duration,
        videoUrl: videoUrl || lecture.videoUrl,
        pdfUrl: pdfUrl !== undefined ? pdfUrl : lecture.pdfUrl,
        pptUrl: pptUrl !== undefined ? pptUrl : lecture.pptUrl,
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Lecture updated successfully",
      lecture: updatedLecture,
    });
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};

export const deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.json({
        error: true,
        message: "Lecture not found",
      });
    }

    // Remove lecture from course's lectures array
    await courseModel.findByIdAndUpdate(courseId, {
      $pull: { lectures: lectureId },
    });

    // Delete the lecture
    await lectureModel.findByIdAndDelete(lectureId);

    return res.json({
      success: true,
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};
