import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../utils/api";

const TeacherProfile = () => {
  const { user, token, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    bio: "",
    education: [],
    experience: [],
    expertise: [],
    profileImage: "",
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  // Generate random education, experience, and expertise
  const generateRandomData = () => {
    const educationOptions = [
      "Ph.D. in Computer Science - MIT",
      "Ph.D. in Engineering - Stanford University",
      "Ph.D. in Mathematics - Harvard University",
      "M.S. in Computer Science - UC Berkeley",
      "M.S. in Data Science - Carnegie Mellon",
      "B.S. in Computer Engineering - Caltech",
      "B.S. in Mathematics - Princeton University",
    ];

    const experienceOptions = [
      "Professor - Current University (2018-Present)",
      "Associate Professor - Tech Institute (2015-2018)",
      "Assistant Professor - Research University (2012-2015)",
      "Senior Research Scientist - Google (2010-2012)",
      "Software Engineer - Microsoft (2008-2010)",
      "Research Intern - IBM Research (2007-2008)",
    ];

    const defaultExpertise = [
      "Research",
      "Teaching",
      "Academic Writing",
      "Curriculum Development",
      "Student Mentoring",
      "Grant Writing",
    ];

    return {
      education: educationOptions.slice(0, 3),
      experience: experienceOptions.slice(0, 3),
      expertise: defaultExpertise,
    };
  };

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await userAPI.getProfile(token);

        if (response.success) {
          const userData = response.user;
          const randomData = generateRandomData();

          const location =
            [userData.city, userData.state, userData.country]
              .filter(Boolean)
              .join(", ") || "Not specified";

          setFormData({
            name: userData.userName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            location: location,
            title: "Professor",
            bio:
              userData.bio ||
              `${userData.userName} is a dedicated educator with expertise in various fields. Passionate about teaching and research, committed to student success and academic excellence.`,
            education: randomData.education,
            experience: randomData.experience,
            expertise: randomData.expertise,
            profileImage:
              userData.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                userData.userName || "Teacher"
              )}&size=200&background=3b82f6&color=fff`,
          });
          setOriginalData(formData);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [token, user]); // Added user dependency to refresh when user data changes

  const handleEdit = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!token) return;

    try {
      setSaving(true);

      // Update the profile data that can be changed
      const updateData = {
        userName: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        // Parse location back to city, state, country if needed
        city: formData.location.split(",")[0]?.trim() || "",
        state: formData.location.split(",")[1]?.trim() || "",
        country: formData.location.split(",")[2]?.trim() || "",
      };

      const response = await userAPI.updateProfile(updateData, token);

      if (response.success) {
        setUser(response.user);
        setIsEditing(false);
        setError("");

        // Update the form data with the response
        const userData = response.user;
        const location =
          [userData.city, userData.state, userData.country]
            .filter(Boolean)
            .join(", ") || "Not specified";

        setFormData((prev) => ({
          ...prev,
          name: userData.userName,
          phone: userData.phone,
          bio: userData.bio,
          location: location,
        }));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center space-x-2">
          <FaSpinner className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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
                disabled={saving}
                className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaSave className="w-4 h-4" />
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
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
                src={formData.profileImage}
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
                <span className="text-gray-600">{formData.email}</span>
                {isEditing && (
                  <span className="text-xs text-gray-500">
                    (Cannot be changed)
                  </span>
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
