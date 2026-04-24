import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandWordmark from "./BrandWordmark";
import { getVisibleNavigationLinks } from "../data/navigation";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteForUser } from "../services/authApi";

function Navbar() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const navbarSlotRef = useRef(null);
  const [isNavbarPinned, setIsNavbarPinned] = useState(false);
  const navigationLinks = getVisibleNavigationLinks(Boolean(currentUser));
  const accountPath = currentUser ? getDefaultRouteForUser(currentUser) : "";
  const isHomePage = location.pathname === "/";
  const isHome = location.pathname === "/" && location.hash === "";

  useEffect(() => {
    function updateNavbarPosition() {
      const navbarSlot = navbarSlotRef.current;

      if (!navbarSlot) {
        return;
      }

      const slotTop = navbarSlot.getBoundingClientRect().top + window.scrollY;
      setIsNavbarPinned(window.scrollY >= slotTop - 14);
    }

    updateNavbarPosition();
    window.addEventListener("scroll", updateNavbarPosition, { passive: true });
    window.addEventListener("resize", updateNavbarPosition);

    return () => {
      window.removeEventListener("scroll", updateNavbarPosition);
      window.removeEventListener("resize", updateNavbarPosition);
    };
  }, [location.pathname]);

  function isLinkActive(path) {
    return path === "/"
      ? isHome
      : location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  return (
    <header
      className={`site-header ${isHomePage ? "site-header--home" : "site-header--inner"}${isNavbarPinned ? " has-pinned-navbar" : ""}`}
      id="topo"
    >
      <div className="header-shell">
        <div className="topbar">
          <Link
            className={`brand-mark${isHomePage ? " brand-mark--hero" : ""}`}
            to="/"
            aria-label="NikitaMotors"
          >
            <BrandWordmark
              className="brand-mark__text"
              firstClassName="brand-mark__nikita"
              secondClassName="brand-mark__motors"
            />
          </Link>
        </div>

        <div
          className={`navbar-slot${isNavbarPinned ? " is-navbar-pinned" : ""}`}
          ref={navbarSlotRef}
        >
          <div className={`navbar${currentUser ? " navbar--authenticated" : ""}`}>
            <nav className="navbar__menu" aria-label="Navegacao principal">
              {navigationLinks.map((link) => {
                const targetPath = link.href ?? link.to;
                const isCurrent = isLinkActive(targetPath);

                return link.href ? (
                  <a
                    key={link.label}
                    className={`navbar__link${isCurrent ? " is-active" : ""}`}
                    href={link.href}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    className={`navbar__link${isCurrent ? " is-active" : ""}`}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {currentUser ? (
                <div className="navbar__session">
                  <Link
                    className={`navbar__link${isLinkActive(accountPath) ? " is-active" : ""}`}
                    to={accountPath}
                  >
                    Minha Conta
                  </Link>
                </div>
              ) : (
                <Link
                  className={`navbar__link${isLinkActive("/login") ? " is-active" : ""}`}
                  to="/login"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
