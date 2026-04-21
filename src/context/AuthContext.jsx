import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContextObject";
import {
  clearAuthSession,
  getAuthSession,
  hasAdminSession as hasStoredAdminSession,
  isAuthenticated as hasStoredSession,
  requestLogout,
  validateAuthSession,
} from "../services/authApi";

function getInitialAuthState() {
  const session = getAuthSession();

  return {
    currentUser: session?.user ?? null,
    isAuthenticated: hasStoredSession(),
    hasAdminSession: hasStoredAdminSession(),
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => getInitialAuthState());
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthRefreshing, setIsAuthRefreshing] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function refreshAuthState() {
      setIsAuthRefreshing(true);
      const user = await validateAuthSession();

      if (!isActive) {
        return;
      }

      setAuthState({
        currentUser: user,
        isAuthenticated: Boolean(user),
        hasAdminSession: user?.role === "admin",
      });
      setIsAuthReady(true);
      setIsAuthRefreshing(false);
    }

    refreshAuthState();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key && event.key !== "auth_session") {
        return;
      }

      const nextState = getInitialAuthState();

      setAuthState(nextState);
      setIsAuthReady(true);
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  async function refreshSession() {
    setIsAuthRefreshing(true);
    const user = await validateAuthSession();

    setAuthState({
      currentUser: user,
      isAuthenticated: Boolean(user),
      hasAdminSession: user?.role === "admin",
    });
    setIsAuthReady(true);
    setIsAuthRefreshing(false);

    return user;
  }

  async function logout() {
    await requestLogout();
    clearAuthSession();
    setAuthState({
      currentUser: null,
      isAuthenticated: false,
      hasAdminSession: false,
    });
    setIsAuthReady(true);
    setIsAuthRefreshing(false);
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isAuthReady,
        isAuthRefreshing,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
