import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/hooks/useAuth";

function AdminPageShell({
  title,
  eyebrow = "Painel Admin",
  actions = null,
  children,
  narrow = false,
  showLogout = false,
  showBackToSite = false,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const hasSessionActions = showLogout || showBackToSite;

  async function handleLogout() {
    await logout();
    navigate("/admin/login", {
      replace: true,
      state: {
        notice: "Sessão de administrador terminada com sucesso.",
      },
    });
  }

  return (
    <main className="admin-page">
      <div
        className={`admin-page__container${narrow ? " admin-page__container--narrow" : ""}`}
      >
        <header className="admin-page__header">
          <div>
            <p className="admin-page__eyebrow">{eyebrow}</p>
            <h1 className="admin-page__title">{title}</h1>
          </div>

          {hasSessionActions ? (
            <div className="admin-page__session-actions">
              {showBackToSite ? (
                <Link className="admin-button admin-button--secondary" to="/">
                  Voltar ao site
                </Link>
              ) : null}
              {showLogout ? (
                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={handleLogout}
                >
                  Terminar Sessão
                </button>
              ) : null}
            </div>
          ) : null}
        </header>

        {actions ? <div className="admin-page__toolbar">{actions}</div> : null}

        <section className="admin-page__panel">{children}</section>
      </div>
    </main>
  );
}

export default AdminPageShell;
