import { useNavigate } from "react-router-dom";
import PageHero from "../../components/PageHero";
import SitePage from "../../components/SitePage";
import { useAuth } from "../../hooks/useAuth";

function Conta() {
  const navigate = useNavigate();
  const { currentUser: user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", {
      replace: true,
      state: {
        notice: "Sessao terminada com sucesso.",
      },
    });
  }

  if (!user) {
    return null;
  }

  return (
    <SitePage mainClassName="page-shell auth-page account-page">
      <PageHero
        className="auth-hero"
        title="Minha Conta"
        description="Sessao iniciada com sucesso. Aqui podes ver os teus dados e, se fores admin, entrar no painel privado quando quiseres."
      />

      <section className="auth-page__content account-page__content">
        <div className="account-details">
          <h2>Dados da Sessao</h2>

          <div className="account-details__grid">
            <article className="account-details__item">
              <span>Nome</span>
              <strong>{user.nome}</strong>
            </article>

            <article className="account-details__item">
              <span>Username</span>
              <strong>{user.username}</strong>
            </article>

            <article className="account-details__item">
              <span>Email</span>
              <strong>{user.email || "-"}</strong>
            </article>

            <article className="account-details__item">
              <span>Papel</span>
              <strong>{user.role}</strong>
            </article>
          </div>

          <div
            className={`auth-form__actions account-page__actions${user.role === "admin" ? " account-page__actions--admin" : ""}`}
          >
            {user.role === "admin" ? (
              <button
                className="contact-submit account-page__secondary-action"
                type="button"
                onClick={() => navigate("/admin/viaturas")}
              >
                Abrir Painel Admin
              </button>
            ) : null}

            <button
              className="contact-submit auth-submit"
              type="button"
              onClick={handleLogout}
            >
              Terminar Sessao
            </button>
          </div>
        </div>
      </section>
    </SitePage>
  );
}

export default Conta;
