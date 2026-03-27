import { Navigate } from "react-router-dom";
import { getAdminToken, setAdminToken } from "../services/adminApi";
import { getAuthSession } from "../services/authApi";

function ProtectedAdminRoute({ children }) {
  const token = getAdminToken();

  if (token) {
    return children;
  }

  const authSession = getAuthSession();

  if (authSession?.user?.role === "admin" && authSession.token) {
    setAdminToken(authSession.token);
    return children;
  }

  return <Navigate to="/admin/login" replace />;
}

export default ProtectedAdminRoute;
