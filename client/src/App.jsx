import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Tables from "./pages/Tables.jsx";
import Setup from "./pages/Setup.jsx";
import Pricing from "./pages/Pricing.jsx";
import About from "./pages/About.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import Overview from "./pages/dashboard/Overview.jsx";
import DashboardTables from "./pages/dashboard/DashboardTables.jsx";
import DashboardOrders from "./pages/dashboard/DashboardOrders.jsx";
import DashboardMenu from "./pages/dashboard/DashboardMenu.jsx";
import Analytics from "./pages/dashboard/Analytics.jsx";
import DashboardSettings from "./pages/dashboard/DashboardSettings.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/pricing"
          element={
            <PageTransition>
              <Pricing />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/tables"
          element={
            <PageTransition>
              <Tables />
            </PageTransition>
          }
        />
        <Route
          path="/setup"
          element={
            <PageTransition>
              <Setup />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route
            index
            element={
              <PageTransition>
                <Overview />
              </PageTransition>
            }
          />
          <Route
            path="tables"
            element={
              <PageTransition>
                <DashboardTables />
              </PageTransition>
            }
          />
          <Route
            path="orders"
            element={
              <PageTransition>
                <DashboardOrders />
              </PageTransition>
            }
          />
          <Route
            path="menu"
            element={
              <PageTransition>
                <DashboardMenu />
              </PageTransition>
            }
          />
          <Route
            path="analytics"
            element={
              <PageTransition>
                <Analytics />
              </PageTransition>
            }
          />
          <Route
            path="settings"
            element={
              <PageTransition>
                <DashboardSettings />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
