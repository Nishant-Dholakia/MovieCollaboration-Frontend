import React, { useContext, type JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const auth = useContext(AuthContext);
  if (auth?.loading) return <div>Loading...</div>;
  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
