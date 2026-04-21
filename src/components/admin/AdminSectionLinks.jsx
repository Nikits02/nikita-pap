import { Link } from "react-router-dom";
import { ADMIN_SECTIONS } from "../../data/adminNavigation";

function AdminSectionLinks({ current, extraActions = null }) {
  return (
    <>
      {ADMIN_SECTIONS.filter((section) => section.key !== current).map((section) => (
        <Link
          className="admin-button admin-button--secondary"
          key={section.key}
          to={section.path}
        >
          {section.label}
        </Link>
      ))}
      {extraActions}
    </>
  );
}

export default AdminSectionLinks;
