import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const col = "text-sm text-gray-200";
  return (
    <footer className="mt-20 bg-[#461a00] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="font-bold text-lg">DineDesk</div>
          <p className="text-sm text-orange-100 mt-2">
            Modern POS for Indian restaurants.
          </p>
        </div>
        <div>
          <div className="font-semibold">Product</div>
          <ul className={col}>
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:underline">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/setup" className="hover:underline">
                Setup
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Company</div>
          <ul className={col}>
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <a className="hover:underline" href="#">
                Careers
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#">
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <ul className={col}>
            <li>Email: hello@dinedesk.example</li>
            <li>Phone: +91-98765-43210</li>
            <li>Address: Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-orange-900/50 py-4 text-center text-xs text-orange-200">
        © {new Date().getFullYear()} DineDesk. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
