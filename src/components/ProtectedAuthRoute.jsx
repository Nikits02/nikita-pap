import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authApi";

function ProtectedAuthRoute({ children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedAuthRoute;
