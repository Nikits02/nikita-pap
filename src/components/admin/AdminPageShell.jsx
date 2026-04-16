import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../../services/authApi";

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
  const hasHeaderActions = actions || showLogout || showBackToSite;

  function handleLogout() {
    clearAuthSession();
    navigate("/admin/login", {
      replace: true,
      state: {
        notice: "Sessao de administrador terminada com sucesso.",
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

          {hasHeaderActions ? (
            <div className="admin-page__header-actions">
              {showBackToSite ? (
                <Link className="admin-button admin-button--secondary" to="/">
                  Voltar ao site
                </Link>
              ) : null}
              {actions}
              {showLogout ? (
                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={handleLogout}
                >
                  Terminar Sessao
                </button>
              ) : null}
            </div>
          ) : null}
        </header>

        <section className="admin-page__panel">{children}</section>
      </div>
    </main>
  );
}

export default AdminPageShell;
