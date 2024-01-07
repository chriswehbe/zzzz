import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { jwtDecode } from "jwt-decode";
export const AdminProtectedRoute = () => {
  const { token } = useAuth();
  const decoded = jwtDecode(token);
  // Check if the user is authenticated
  if (!decoded.isAdmin) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/userView" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};
