import React, { useState } from "react";

const LoginPopup = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-md flex justify-center items-center">
      <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-[#461a00]">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-4">
          <form>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-[#461a00]"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-[#461a00]"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-[#461a00]"
            />
            <button
              type="submit"
              className="w-full bg-[#461a00] text-white py-2 rounded hover:bg-[#5c2405] transition"
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[#461a00] font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#461a00] font-semibold hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
