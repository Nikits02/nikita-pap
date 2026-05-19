import { Link } from "react-router-dom";
import { ADMIN_SECTIONS } from "../data/adminNavigation";

function AdminSectionLinks({ current, extraActions = null }) {
  return (
    <nav className="admin-section-nav" aria-label="Secções do painel admin">
      {ADMIN_SECTIONS.map((section) => (
        <Link
          className={`admin-section-nav__link${section.key === current ? " is-active" : ""}`}
          key={section.key}
          to={section.path}
        >
          {section.label}
        </Link>
      ))}
      {extraActions ? (
        <div className="admin-section-nav__actions">{extraActions}</div>
      ) : null}
    </nav>
  );
}

export default AdminSectionLinks;
