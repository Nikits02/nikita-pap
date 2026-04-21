import { Navigate, useLocation } from "react-router-dom";
import SessionStatus from "./SessionStatus";
import { useAuth } from "../hooks/useAuth";

function ProtectedAuthRoute({ children }) {
  const { currentUser, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <SessionStatus
        title="A validar sessao..."
        message="Estamos a confirmar o seu acesso aos conteudos privados."
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
            "Precisa de iniciar sessao para ver o catalogo, o financiamento e a retoma.",
          redirectTo: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  return children;
}

export default ProtectedAuthRoute;
