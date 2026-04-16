import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/authApi";

function ProtectedAuthRoute({ children }) {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
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
