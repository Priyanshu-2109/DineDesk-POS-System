import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginPopup = ({ isOpen, onClose, initialMode = "login" }) => {
  const { authModal } = useApp();
  const { login, signup, loading } = useAuth();
  const navigate = useNavigate();
  const effectiveOpen =
    typeof isOpen === "boolean" ? isOpen : authModal?.isOpen;
  const modeFromCtx = authModal?.mode || initialMode;
  const [isLogin, setIsLogin] = useState(modeFromCtx === "login");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    setIsLogin(modeFromCtx === "login");
  }, [modeFromCtx]);

  useEffect(() => {
    if (!effectiveOpen) {
      setError("");
      setSuccessMessage("");
      setIsSubmitting(false);
    }
  }, [effectiveOpen]);

  if (!effectiveOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!isLogin && !name) {
      setError("Please enter your full name");
      setIsSubmitting(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(email, password);
        if (result.success) {
          toast.success("Welcome back! Redirecting to dashboard...");
          onClose && onClose();
          navigate("/dashboard");
        }
      } else {
        result = await signup(name, email, password);
        if (result.success) {
          // After successful signup, switch to login mode
          setIsLogin(true);
          setError("");
          // Clear form
          const form = e.currentTarget;
          form.reset();
          // Show success message
          toast.success("Account created successfully! Please log in.");
          setSuccessMessage(
            "Account created successfully! Please log in with your credentials."
          );
          setIsSubmitting(false);
          return;
        }
      }

      if (!result.success) {
        setError(result.message || "An error occurred. Please try again.");

        // Show validation errors if they exist
        if (result.errors && result.errors.length > 0) {
          const errorMessages = result.errors.map((err) => err.msg).join(", ");
          setError(errorMessages);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
        <div className="relative w-full max-w-md">
          <div className="rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-[#cc6600]/20">
            <div className="flex items-center justify-between px-6 pt-6">
              <div className="flex gap-6 text-[#3b1a0b] font-semibold">
                <button
                  className={`pb-2 border-b-2 transition-colors ${
                    isLogin
                      ? "border-[#cc6600] text-[#cc6600]"
                      : "border-transparent hover:border-[#cc6600]/50"
                  }`}
                  onClick={() => setIsLogin(true)}
                  disabled={isSubmitting}
                >
                  Login
                </button>
                <button
                  className={`pb-2 border-b-2 transition-colors ${
                    !isLogin
                      ? "border-[#cc6600] text-[#cc6600]"
                      : "border-transparent hover:border-[#cc6600]/50"
                  }`}
                  onClick={() => setIsLogin(false)}
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-600 text-xl font-bold"
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>
            <div className="px-6 pb-6 pt-3">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-3">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-[#3b1a0b] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required={!isLogin}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent transition-all disabled:bg-gray-100"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-[#3b1a0b] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent transition-all disabled:bg-gray-100"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3b1a0b] mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      name="password"
                      required
                      disabled={isSubmitting}
                      minLength={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent transition-all disabled:bg-gray-100"
                      placeholder={
                        isLogin
                          ? "Enter your password"
                          : "At least 6 characters with uppercase, lowercase & number"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
                      disabled={isSubmitting}
                    >
                      {showPwd ? "Hide" : "Show"}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-gray-500 mt-1">
                      Password must contain at least one uppercase letter, one
                      lowercase letter, and one number
                    </p>
                  )}
                </div>
                {isLogin && (
                  <div className="flex justify-end text-xs">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[#cc6600] hover:text-[#b35500] font-medium"
                      disabled={isSubmitting}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#cc6600] text-white py-3 rounded-lg hover:bg-[#b35500] transition-colors font-medium shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
              <div className="my-3 flex items-center gap-2 text-xs text-gray-400">
                <div className="flex-1 h-px bg-gray-200" />
                <span>or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="flex justify-center">
                <button
                  className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-6 text-gray-700 hover:bg-gray-50 transition-colors font-medium w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-[#cc6600] font-semibold hover:text-[#b35500] transition-colors"
                      disabled={isSubmitting}
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-[#cc6600] font-semibold hover:text-[#b35500] transition-colors"
                      disabled={isSubmitting}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default LoginPopup;
