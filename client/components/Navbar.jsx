import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginPopup from "./LoginPopup";

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#461a00]/40 backdrop-blur-2xl shadow-md"
            : "bg-transparent"
        } text-[#3b1a0b] h-16 flex items-center justify-between px-6`}
      >
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[#3b1a0b]">
          DineDesk
        </Link>

        {/* Menu Links */}
        <div className="hidden md:flex gap-6 text-sm">
          <Link
            to="/"
            onClick={() => setActive("home")}
            className={`hover:text-[#3b1a0b] ${
              active === "home"
                ? "text-[#3b1a0b] border-b-2 border-[#3b1a0b]"
                : "text-gray-200"
            }`}
          >
            Home
          </Link>
          <Link
            to="/tables"
            onClick={() => setActive("tables")}
            className={`hover:text-[#3b1a0b] ${
              active === "tables"
                ? "text-[#3b1a0b] border-b-2 border-[#3b1a0b]"
                : "text-gray-400"
            }`}
          >
            Tables
          </Link>
          <Link
            to="/orders"
            onClick={() => setActive("orders")}
            className={`hover:text-[#3b1a0b] ${
              active === "orders"
                ? "text-[#3b1a0b] border-b-2 border-[#3b1a0b]"
                : "text-gray-400"
            }`}
          >
            Orders
          </Link>
          <Link
            to="/menu"
            onClick={() => setActive("menu")}
            className={`hover:text-[#3b1a0b] ${
              active === "menu"
                ? "text-[#3b1a0b] border-b-2 border-[#3b1a0b]"
                : "text-gray-400"
            }`}
          >
            Menu
          </Link>
        </div>

        {/* Right-side Login button */}
        <div>
          <button
            className="bg-transparent border border-[#3b1a0b] px-4 py-1 rounded hover:bg-[#3b1a0b] hover:text-white text-sm transition-all duration-200 text-[#3b1a0b]"
            onClick={() => setIsLoginPopupOpen(true)}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Login Popup */}
      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
      />
    </>
  );
};

export default Navbar;
