import { Navigate, useLocation } from "react-router-dom";
import SessionStatus from "./SessionStatus";
import { useAuth } from "../hooks/useAuth";

function ProtectedAdminRoute({ children }) {
  const { hasAdminSession, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <SessionStatus
        variant="admin"
        title="A validar sessão..."
        message="Estamos a confirmar o acesso ao painel de administração."
      />
    );
  }

  if (hasAdminSession) {
    return children;
  }

  return (
    <Navigate
      to="/admin/login"
      replace
      state={{
        notice: "Precisa de iniciar sessão como administrador para aceder ao painel.",
        redirectTo: `${location.pathname}${location.search}${location.hash}`,
      }}
    />
  );
}

export default ProtectedAdminRoute;
