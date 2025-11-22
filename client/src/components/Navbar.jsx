import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import ContactFormModal from "./ContactFormModal";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        } h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8`}
      >
        {/* Logo */}
        <Link
          to="/"
          className={`text-xl sm:text-2xl font-bold transition-colors ${
            scrolled
              ? "text-[#3b1a0b] hover:text-[#cc6600]"
              : "text-[#3b1a0b] hover:text-[#cc6600] drop-shadow-lg"
          }`}
        >
          DineDesk
        </Link>

        {/* Desktop Menu Links */}
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

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#3b1a0b] hover:text-[#cc6600] transition-colors"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 right-0 bottom-0 w-64 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {/* Mobile Menu Links */}
              <Link
                to="/"
                onClick={() => {
                  setActive("home");
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  active === "home"
                    ? "bg-[#cc6600] text-white"
                    : "text-[#3b1a0b] hover:bg-gray-100"
                }`}
              >
                Home
              </Link>
              <Link
                to="/pricing"
                onClick={() => {
                  setActive("pricing");
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  active === "pricing"
                    ? "bg-[#cc6600] text-white"
                    : "text-[#3b1a0b] hover:bg-gray-100"
                }`}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                onClick={() => {
                  setActive("about");
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  active === "about"
                    ? "bg-[#cc6600] text-white"
                    : "text-[#3b1a0b] hover:bg-gray-100"
                }`}
              >
                About Us
              </Link>
              <Link
                to="/setup"
                onClick={() => {
                  setActive("setup");
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  active === "setup"
                    ? "bg-[#cc6600] text-white"
                    : "text-[#3b1a0b] hover:bg-gray-100"
                }`}
              >
                Setup
              </Link>

              <div className="border-t border-gray-200 my-4" />

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Welcome, {user?.name}
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-[#cc6600] text-white rounded-lg hover:bg-[#b35500] transition-colors font-medium text-center"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-[#3b1a0b] hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-[#3b1a0b] hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal("signup");
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 bg-[#cc6600] text-white rounded-lg hover:bg-[#b35500] transition-colors font-medium"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
