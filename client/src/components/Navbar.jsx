import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import { useApp } from "../context/AppContext";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const { user, openAuthModal, closeAuthModal, authModal, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update active state based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActive("home");
    else if (path === "/pricing") setActive("pricing");
    else if (path === "/about") setActive("about");
    else if (path === "/setup") setActive("setup");
    else if (path === "/tables") setActive("tables");
  }, [location.pathname]);

  const handleLogin = () => {
    openAuthModal("login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Enhanced navigation handler with smooth scrolling
  const handleNavigation = (path, activeState) => {
    setActive(activeState);
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      navigate(path);
    }, 50);
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
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/", "home");
            }}
            className={`hover:text-[#cc6600] transition-all duration-300 py-2 transform hover:scale-105 ${
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
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/pricing", "pricing");
            }}
            className={`hover:text-[#cc6600] transition-all duration-300 py-2 transform hover:scale-105 ${
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
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/about", "about");
            }}
            className={`hover:text-[#cc6600] transition-all duration-300 py-2 transform hover:scale-105 ${
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
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("/setup", "setup");
            }}
            className={`hover:text-[#cc6600] transition-all duration-300 py-2 transform hover:scale-105 ${
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
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/dashboard", "dashboard");
                }}
                className="px-4 py-2 bg-[#cc6600] text-white rounded-lg hover:bg-[#b35500] transition-all duration-300 font-medium transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className={`px-4 py-2 transition-all duration-300 font-medium transform hover:scale-105 ${
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
                className={`px-4 py-2 transition-all duration-300 font-medium transform hover:scale-105 ${
                  scrolled
                    ? "text-[#3b1a0b] hover:text-[#cc6600]"
                    : "text-[#3b1a0b]  hover:text-[#cc6600] drop-shadow-lg"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-6 py-2 bg-[#cc6600] text-white rounded-lg hover:bg-[#b35500] transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
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
    </>
  );
};

export default Navbar;
