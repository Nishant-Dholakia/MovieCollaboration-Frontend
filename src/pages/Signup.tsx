import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Film, LogIn } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface SigninFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const SigninPage: React.FC = () => {
  const [formData, setFormData] = useState<SigninFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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

    setIsLoading(true);
    setErrors({});

    try {
      // Replace with your actual API call
      const response = await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status !== 200) {
        setErrors({ general: response.data.message });
      }

      console.log("Signin successful:", formData);
      // Redirect to dashboard or home page
      navigate("/Login");
    } catch (error: any) {
      console.error("Signin error:", error);
      setErrors({
        general:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white">MovieHub</h1>
          </div>
          <p className="text-gray-300">
            Welcome back! Sign up to continue your cinematic journey
          </p>
        </div>

        {/* Signin Form */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Sign Up
          </h2>

          {errors.general && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.username
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-600 focus:ring-red-500/50 focus:border-red-500"
                }`}
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="text-red-400 text-sm mt-2">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-600 focus:ring-red-500/50 focus:border-red-500"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-600 focus:ring-red-500/50 focus:border-red-500"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500/50"
                    : "border-gray-600 focus:ring-red-500/50 focus:border-red-500"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="space-y-6 mt-6">
            

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => (navigate('/Login'))}
                className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
