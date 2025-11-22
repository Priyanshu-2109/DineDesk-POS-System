import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ children, requireSubscription = true }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#cc6600]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if subscription is required and user doesn't have one
  if (
    requireSubscription &&
    (!user?.subscription || user.subscription === null)
  ) {
    return (
      <Navigate
        to="/pricing"
        state={{ from: location, requirePayment: true }}
        replace
      />
    );
  }

  return children;
};

export default RequireAuth;
