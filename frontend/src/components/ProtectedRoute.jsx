import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    if (user.role === "manager") {
      return <Navigate to="/manager/dashboard" replace />;
    }
    return <Navigate to="/employee/dashboard" replace />;
  }

  // Render the protected component
  return <>{children}</>;
}



