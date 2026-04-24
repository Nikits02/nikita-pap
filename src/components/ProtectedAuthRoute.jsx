import { Navigate, useLocation } from "react-router-dom";
import SessionStatus from "./SessionStatus";
import { useAuth } from "../hooks/useAuth";

function ProtectedAuthRoute({ children }) {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <SessionStatus
        title="A validar sessão..."
        message="Estamos a confirmar o seu acesso aos conteúdos privados."
      />
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          notice:
            "Precisa de iniciar sessão para ver o financiamento, a retoma e o test drive.",
          redirectTo: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  return children;
}

export default ProtectedAuthRoute;
