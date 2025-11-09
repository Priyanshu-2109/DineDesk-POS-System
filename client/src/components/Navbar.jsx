import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import ContactFormModal from "./ContactFormModal";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const {
    openAuthModal,
    closeAuthModal,
    authModal,
    contactModal,
    openContactModal,
    closeContactModal,
  } = useApp();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    openAuthModal("login");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Hide navbar on dashboard pages
  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#3b1a0b]/10 backdrop-blur-xl shadow-lg border-b border-white/20"
            : "bg-transparent"
        } h-20 flex items-center justify-between px-6`}
      >
        {/* Logo */}
        <Link
          to="/"
          className={`text-2xl font-bold transition-colors ${
            scrolled
              ? "text-[#3b1a0b] hover:text-[#cc6600]"
              : "text-[#3b1a0b] hover:text-[#cc6600] drop-shadow-lg"
          }`}
        >
          DineDesk
        </Link>

        {/* Menu Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link
            to="/"
            onClick={() => setActive("home")}
            className={`hover:text-[#cc6600] transition-colors duration-200 py-2 ${
              active === "home"
                ? "text-[#cc6600] border-b-2 border-[#cc6600]"
                : scrolled
                ? "text-[#3b1a0b]"
                : "text-gray-500 drop-shadow-lg"
            }`}
          >
            Home
          </Link>
          <Link
            to="/pricing"
            onClick={() => setActive("pricing")}
            className={`hover:text-[#cc6600] transition-colors duration-200 py-2 ${
              active === "pricing"
                ? "text-[#cc6600] border-b-2 border-[#cc6600]"
                : scrolled
                ? "text-[#3b1a0b]"
                : "text-gray-500 drop-shadow-lg"
            }`}
          >
            Pricing
          </Link>
          <Link
            to="/about"
            onClick={() => setActive("about")}
            className={`hover:text-[#cc6600] transition-colors duration-200 py-2 ${
              active === "about"
                ? "text-[#cc6600] border-b-2 border-[#cc6600]"
                : scrolled
                ? "text-[#3b1a0b]"
                : "text-gray-500 drop-shadow-lg"
            }`}
          >
            About Us
          </Link>
          <Link
            to="/setup"
            onClick={() => setActive("setup")}
            className={`hover:text-[#cc6600] transition-colors duration-200 py-2 ${
              active === "setup"
                ? "text-[#cc6600] border-b-2 border-[#cc6600]"
                : scrolled
                ? "text-[#3b1a0b]"
                : "text-gray-500 drop-shadow-lg"
            }`}
          >
            Setup
          </Link>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span
                className={`text-sm ${
                  scrolled ? "text-[#3b1a0b]" : "text-[#3b1a0b] drop-shadow-lg"
                }`}
              >
                Welcome, {user?.name}
              </span>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-[#cc6600] text-white rounded-lg hover:bg-[#b35500] transition-colors font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 transition-colors font-medium ${
                  scrolled
                    ? "text-[#3b1a0b] hover:text-[#cc6600]"
                    : "text-[#3b1a0b] hover:text-[#cc6600] drop-shadow-lg"
                }`}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogin}
                className={`px-4 py-2 transition-colors font-medium ${
                  scrolled
                    ? "text-[#3b1a0b] hover:text-[#cc6600]"
                    : "text-[#3b1a0b]  hover:text-[#cc6600] drop-shadow-lg"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-6 py-2 bg-[#cc6600] text-white rounded-lg hover:bg-[#b35500] transition-colors font-medium shadow-lg"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      <LoginPopup
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={closeAuthModal}
      />

      <ContactFormModal isOpen={contactModal} onClose={closeContactModal} />
    </>
  );
};

export default Navbar;
