import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Navbar from "../components/Navbar.jsx";
import Tables from "../pages/Tables.jsx";
import Setup from "../pages/Setup.jsx";
import Pricing from "../pages/Pricing.jsx";
import About from "../pages/About.jsx";
import DashboardLayout from "../pages/DashboardLayout.jsx";
import Overview from "../pages/dashboard/Overview.jsx";
import DashboardTables from "../pages/dashboard/DashboardTables.jsx";
import DashboardOrders from "../pages/dashboard/DashboardOrders.jsx";
import DashboardMenu from "../pages/dashboard/DashboardMenu.jsx";
import Analytics from "../pages/dashboard/Analytics.jsx";
import DashboardSettings from "../pages/dashboard/DashboardSettings.jsx";
import RequireAuth from "../components/RequireAuth.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/setup" element={<Setup />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Overview />} />
          <Route path="tables" element={<DashboardTables />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="menu" element={<DashboardMenu />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
