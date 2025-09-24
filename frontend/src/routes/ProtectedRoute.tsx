import React, { type JSX } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
