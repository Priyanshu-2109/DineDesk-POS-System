import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const RequireAuth = ({ children }) => {
  const { user, openAuthModal } = useApp();
  const location = useLocation();

  useEffect(() => {
    if (!user) openAuthModal("login");
  }, [user, openAuthModal]);

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;
