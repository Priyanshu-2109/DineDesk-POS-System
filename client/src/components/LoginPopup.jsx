import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const LoginPopup = ({ isOpen, onClose, initialMode = "login" }) => {
  const { login, signup, authModal } = useApp();
  const navigate = useNavigate();
  const effectiveOpen =
    typeof isOpen === "boolean" ? isOpen : authModal?.isOpen;
  const modeFromCtx = authModal?.mode || initialMode;
  const [isLogin, setIsLogin] = useState(modeFromCtx === "login");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    setIsLogin(modeFromCtx === "login");
  }, [modeFromCtx]);

  if (!effectiveOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name =
      form.get("name") || form.get("email")?.split("@")[0] || "Guest";
    if (isLogin) {
      login && login(name);
    } else {
      signup && signup(name);
    }
    onClose && onClose();
    navigate("/dashboard");
  };

  return (
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
              >
                Sign Up
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
          </div>
          <div className="px-6 pb-6 pt-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-[#3b1a0b] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#3b1a0b] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent transition-all"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3b1a0b] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-[#cc6600] focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {isLogin && (
                <div className="flex justify-end text-xs">
                  <button
                    type="button"
                    className="text-[#cc6600] hover:text-[#b35500] font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-[#cc6600] text-white py-3 rounded-lg hover:bg-[#b35500] transition-colors font-medium shadow-lg"
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>
            <div className="my-3 flex items-center gap-2 text-xs text-gray-400">
              <div className="flex-1 h-px bg-gray-200" />
              <span>or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="flex justify-center">
              <button className="flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-6 text-gray-700 hover:bg-gray-50 transition-colors font-medium w-full">
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
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#cc6600] font-semibold hover:text-[#b35500] transition-colors"
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
  );
};

export default LoginPopup;
