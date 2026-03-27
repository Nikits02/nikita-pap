import { Link, useLocation } from "react-router-dom";
import BrandWordmark from "./BrandWordmark";
import { primaryNavigationLinks } from "../data/navigation";
import { getCurrentUser, getDefaultRouteForUser } from "../services/authApi";

function Navbar() {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const accountPath = currentUser ? getDefaultRouteForUser(currentUser) : "";
  const isHomePage = location.pathname === "/";
  const isHome = location.pathname === "/" && location.hash === "";

  function isLinkActive(path) {
    return path === "/"
      ? isHome
      : location.pathname === path || location.pathname.startsWith(`${path}/`);
  }

  return (
    <header className={`site-header ${isHomePage ? "site-header--home" : "site-header--inner"}`} id="topo">
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

        <div className={`navbar${currentUser ? " navbar--authenticated" : ""}`}>
          <nav className="navbar__menu" aria-label="Navegacao principal">
            {primaryNavigationLinks.map((link) => {
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
    </header>
  );
}

export default Navbar;
