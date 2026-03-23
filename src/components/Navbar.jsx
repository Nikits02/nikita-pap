import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sobre Nos", to: "/sobre" },
  { label: "Catalogo", to: "/catalogo" },
  { label: "Financiamento", to: "/financiamento" },
  { label: "Retoma", to: "/retoma" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isHome = location.pathname === "/" && location.hash === "";

  return (
    <header className={`site-header ${isHomePage ? "site-header--home" : "site-header--inner"}`} id="topo">
      <div className="header-shell">
        <div className="topbar">
          <Link
            className={`brand-mark${isHomePage ? " brand-mark--hero" : ""}`}
            to="/"
            aria-label="NikitaMotors"
          >
            <span className="brand-mark__text">
              <span className="brand-mark__nikita">Nikita</span>
              <span className="brand-mark__motors">Motors</span>
            </span>
          </Link>
        </div>

        <div className="navbar">
          <nav className="navbar__menu" aria-label="Navegacao principal">
            {navLinks.map((link) => {
              const isCurrent =
                link.href === "/"
                  ? isHome
                  : location.pathname === link.to ||
                    location.pathname.startsWith(`${link.to}/`);

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
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
