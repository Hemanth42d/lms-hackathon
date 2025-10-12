import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
} from "react-icons/fa";
import toast from "react-hot-toast";

const TeacherProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    department: "Computer Science",
    title: "Associate Professor",
    bio: "Dr. Sarah Johnson is an Associate Professor in the Computer Science Department with over 10 years of experience in teaching and research. She specializes in data structures, algorithms, and machine learning.",
    education: [
      "Ph.D. in Computer Science - MIT (2010)",
      "M.S. in Computer Science - Stanford University (2006)",
      "B.S. in Computer Science - UC Berkeley (2004)",
    ],
    experience: [
      "Associate Professor - Current University (2015-Present)",
      "Assistant Professor - Tech Institute (2010-2015)",
      "Research Scientist - Google (2008-2010)",
    ],
    expertise: [
      "Data Structures",
      "Algorithms",
      "Machine Learning",
      "Python",
      "JavaScript",
      "React",
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/drsarahjohnson",
      github: "https://github.com/sarahjohnson",
    },
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // Here you would typically send the data to your API
      // await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <FaTimes className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
              >
                <FaSave className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2"
            >
              <FaEdit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src="https://ui-avatars.com/api/?name=Dr+Sarah+Johnson&size=200&background=3b82f6&color=fff"
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto border-4 border-gray-200"
              />
              {isEditing && (
                <button className="absolute bottom-2 right-2 bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors">
                  <FaCamera className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full text-center text-xl font-bold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full text-center text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {formData.name}
                </h2>
                <p className="text-gray-600 mb-4">{formData.title}</p>
              </div>
            )}

            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="text-gray-600">{formData.email}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <FaPhone className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="text-gray-600">{formData.phone}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="text-gray-600">{formData.location}</span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <FaGraduationCap className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <span className="text-gray-600">{formData.department}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Section */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bio</h3>
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-600">{formData.bio}</p>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Education
            </h3>
            <div className="space-y-2">
              {formData.education.map((edu, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={edu}
                        onChange={(e) =>
                          handleArrayChange("education", index, e.target.value)
                        }
                        className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => removeArrayItem("education", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-600">• {edu}</span>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => addArrayItem("education")}
                  className="text-indigo-500 hover:text-indigo-700 text-sm"
                >
                  + Add Education
                </button>
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Experience
            </h3>
            <div className="space-y-2">
              {formData.experience.map((exp, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) =>
                          handleArrayChange("experience", index, e.target.value)
                        }
                        className="flex-1 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => removeArrayItem("experience", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-600">• {exp}</span>
                  )}
                </div>
              ))}
              {isEditing && (
                <button
                  onClick={() => addArrayItem("experience")}
                  className="text-indigo-500 hover:text-indigo-700 text-sm"
                >
                  + Add Experience
                </button>
              )}
            </div>
          </div>

          {/* Expertise Section */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Areas of Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {formData.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => removeArrayItem("expertise", index)}
                      className="ml-2 text-indigo-500 hover:text-indigo-700"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button
                  onClick={() => addArrayItem("expertise")}
                  className="px-3 py-1 border-2 border-dashed border-indigo-300 text-indigo-500 rounded-full text-sm hover:border-indigo-500"
                >
                  + Add Skill
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
