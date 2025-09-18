import React, { useState, useContext } from "react";
import { Users, ArrowLeft } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
interface CreateGroupData {
  name: string;
  description: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  general?: string;
}

const CreateGroupPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateGroupData>({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Group name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Group name must be at least 3 characters";
    } else if (formData.name.length > 50) {
      newErrors.name = "Group name must be less than 50 characters";
    }

    if (formData.description.length > 250) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Replace with actual API call
      await api.post("/group/add", {
        name: formData.name.trim(),
        description: formData.description.trim(),
      });

      console.log("Group created successfully:", formData);
      // Navigate back to groups list
      navigate("/groups");
    } catch (error: any) {
      console.error("Error creating group:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          "Failed to create group. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/groups");
    console.log("Go back to groups list");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
		  	type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Groups
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Create New Group</h1>
          </div>
          <p className="text-gray-300">
            Start a new community for movie enthusiasts
          </p>
        </div>

        {/* Create Group Form */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {errors.general && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Group Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Group Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full p-4 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-600 focus:ring-red-500/50 focus:border-red-500"
                }`}
                placeholder="Enter group name (e.g., Horror Movie Lovers)"
                maxLength={50}
              />
              <div className="flex justify-between mt-2">
                <div>
                  {errors.name && (
                    <p className="text-red-400 text-sm">{errors.name}</p>
                  )}
                </div>
                <p className="text-gray-500 text-xs">
                  {formData.name.length}/50
                </p>
              </div>
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full p-4 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-600 focus:ring-red-500/50 focus:border-red-500"
                }`}
                placeholder="What's this group about? Share your passion for specific genres, directors, or film eras..."
                rows={4}
                maxLength={200}
              />
              <div className="flex justify-between mt-2">
                <div>
                  {errors.description && (
                    <p className="text-red-400 text-sm">{errors.description}</p>
                  )}
                </div>
                <p className="text-gray-500 text-xs">
                  {formData.description.length}/200
                </p>
              </div>
            </div>

            {/* Group Preview */}
            {formData.name && (
              <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Group Preview:</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold capitalize">
                      {formData.name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      1 member • Created by {user?.username || "you"}
                    </p>
                  </div>
                </div>
                {formData.description && (
                  <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                    {formData.description}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.name.trim() || loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Group...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Create Group
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gray-900/60 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">
            💡 Tips for creating a great group:
          </h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>
              • Choose a descriptive name that reflects your group's focus
            </li>
            <li>
              • Add a compelling description to attract like-minded members
            </li>
            <li>
              • Be specific about the type of movies or topics you'll discuss
            </li>
            <li>• Keep the group name unique and memorable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
