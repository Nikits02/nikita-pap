import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AppRouteEffects() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      return;
    }

    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!location.hash) {
      return undefined;
    }

    const targetId = location.hash.slice(1);
    let attempts = 0;
    let timeoutId;

    const scrollToHash = () => {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({ block: "start" });
        return;
      }

      if (attempts >= 20) {
        return;
      }

      attempts += 1;
      timeoutId = window.setTimeout(scrollToHash, 80);
    };

    timeoutId = window.setTimeout(scrollToHash, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [location.hash, location.pathname]);

  return null;
}

export default AppRouteEffects;
