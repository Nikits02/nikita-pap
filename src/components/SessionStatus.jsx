import AdminPageShell from "./admin/AdminPageShell";
import PageHero from "./PageHero";
import SitePage from "./SitePage";

function SessionStatus({
  variant = "public",
  title = "A validar sessão...",
  message = "Estamos a confirmar o seu acesso.",
}) {
  if (variant === "admin") {
    return (
      <AdminPageShell title={title} narrow>
        <div className="admin-page__notice" role="status" aria-live="polite">
          <span className="admin-page__loading-indicator" aria-hidden="true" />
          {message}
        </div>
      </AdminPageShell>
    );
  }

  return (
    <SitePage mainClassName="page-shell auth-page">
      <PageHero
        className="auth-hero"
        title={title}
        description={message}
      />

      <section className="auth-page__content">
        <div className="auth-notice" role="status" aria-live="polite">
          <span className="auth-notice__eyebrow">Sessão</span>
          <span className="auth-notice__loading-indicator" aria-hidden="true" />
          <p>{message}</p>
        </div>
      </section>
    </SitePage>
  );
}

export default SessionStatus;
