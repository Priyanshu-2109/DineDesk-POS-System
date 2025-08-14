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
            <div className="grid grid-cols-2 gap-3 text-sm">
              <button className="border border-gray-300 rounded-lg py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                Google
              </button>
              <button className="border border-gray-300 rounded-lg py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                Apple
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
