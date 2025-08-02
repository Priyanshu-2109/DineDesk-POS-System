import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#ffe8db] to-[#fff4ef] text-center pt-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#3b1a0b] mb-6">
          Seamless Table Management & Billing with <span className="text-orange-600">DineDesk</span>
        </h1>

        <p className="text-gray-700 text-lg md:text-xl mb-10">
          Experience next-gen POS for your restaurant — fast, simple, and efficient.
        </p>

        <Link
          to="/tables"
          className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition transform hover:scale-105"
        >
          Start&nbsp;<span className="text-xl ml-1">→</span>
        </Link>
      </div>

      {/* Scrollable content */}
      <div className="mt-24">
        <div className="h-[300vh] flex flex-col items-center justify-center text-gray-500">
          <p className="mb-20 text-lg">Scroll down to explore more features...</p>
          <p className="text-2xl font-medium">More Content Coming Soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
