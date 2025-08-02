import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Navbar from "../components/Navbar.jsx";
import Tables from "../pages/Tables.jsx";
import LoginPopup from "../components/LoginPopup.jsx";

const App = () => {
  return (
    <>
      {/* Navbar route */}
      <Navbar />
      {/* Routes for other pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginPopup />} />
        <Route path="/tables" element={<Tables />} />
      </Routes>
    </>
  );
};

export default App;
