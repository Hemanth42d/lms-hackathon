import userModel from "../models/user-model.js";
import courseModel from "../models/course-model.js";
import assignmentModel from "../models/assignment-model.js";

// Get teacher dashboard statistics
export const getTeacherStats = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Get teacher's courses
    const teacherCourses = await courseModel.find({ instructor: teacherId });
    const courseIds = teacherCourses.map((course) => course._id);

    let totalStudents = 0;
    let activeAssignments = 0;
    let pendingSubmissions = 0;
    let recentActivity = [];

    // Only query if teacher has courses
    if (courseIds.length > 0) {
      // Get total students enrolled in teacher's courses
      totalStudents = await userModel.countDocuments({
        enrolledCourses: { $in: courseIds },
        role: "Student",
      });

      // Get active assignments for teacher's courses
      activeAssignments = await assignmentModel.countDocuments({
        courseId: { $in: courseIds },
        dueDate: { $gte: new Date() },
      });

      // Get pending submissions (assignments past due date)
      pendingSubmissions = await assignmentModel.countDocuments({
        courseId: { $in: courseIds },
        dueDate: { $lt: new Date() },
      });

      // Get recent activity (last 10 enrollments in teacher's courses)
      const recentEnrollments = await userModel
        .find({
          enrolledCourses: { $in: courseIds },
          role: "Student",
        })
        .select("userName email createdAt enrolledCourses")
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("enrolledCourses", "title");

      recentActivity = recentEnrollments.map((student) => ({
        id: student._id,
        type: "enrollment",
        student: student.userName,
        course:
          student.enrolledCourses.find((course) =>
            courseIds.some((id) => id.toString() === course._id.toString())
          )?.title || "Unknown Course",
        timestamp: getTimeAgo(student.createdAt),
        status: "new",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          student.userName
        )}&background=random&color=fff`,
      }));
    }

    return res.json({
      success: true,
      stats: {
        totalCourses: teacherCourses.length,
        totalStudents,
        activeAssignments,
        pendingSubmissions,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Teacher stats error:", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Update courses without instructor to assign them to the requesting teacher
export const updateCoursesInstructor = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Find courses without instructor
    const coursesWithoutInstructor = await courseModel.find({
      $or: [{ instructor: null }, { instructor: { $exists: false } }],
    });

    if (coursesWithoutInstructor.length === 0) {
      return res.json({
        success: true,
        message: "All courses already have instructors assigned",
        updated: 0,
      });
    }

    // Update courses to assign the current teacher as instructor
    const updateResult = await courseModel.updateMany(
      { $or: [{ instructor: null }, { instructor: { $exists: false } }] },
      { instructor: teacherId }
    );

    return res.json({
      success: true,
      message: `Updated ${updateResult.modifiedCount} courses with instructor information`,
      updated: updateResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating courses instructor:", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Helper function to get time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};
