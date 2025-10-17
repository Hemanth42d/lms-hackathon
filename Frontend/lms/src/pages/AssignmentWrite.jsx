import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const AssignmentWrite = ({ assignment, onSubmit }) => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(
    assignment?.questions?.map(() => null) || []
  );
  const [submitting, setSubmitting] = useState(false);

  const handleOptionChange = (qIdx, optIdx) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[qIdx] = optIdx;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Submit answers to backend for auto-grading
      const { data } = await axiosInstance.post(
        `/course/${courseId}/assignments/${assignmentId}/submit`,
        { answers }
      );
      toast.success(
        `Assignment submitted! Score: ${data.score} / ${data.maxScore}`
      );
      if (onSubmit) onSubmit(data);
      navigate(-1); // Go back
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!assignment) return <div>Loading assignment...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{assignment.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {assignment.questions.map((q, qIdx) => (
          <div key={qIdx} className="mb-4">
            <p className="font-medium mb-2">
              Q{qIdx + 1}: {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => (
                <label
                  key={optIdx}
                  className={`block p-2 rounded border cursor-pointer ${
                    answers[qIdx] === optIdx
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${qIdx}`}
                    value={optIdx}
                    checked={answers[qIdx] === optIdx}
                    onChange={() => handleOptionChange(qIdx, optIdx)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {submitting ? "Submitting..." : "Submit Assignment"}
        </button>
      </form>
    </div>
  );
};

export default AssignmentWrite;
