import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormError, FormInputField } from "../../components/form/FormField";
import { PageHero, SitePage } from "../../components/common";
import { useAuth } from "../../hooks/useAuth";
import useFormState from "../../hooks/useFormState";
import useSubmitState from "../../hooks/useSubmitState";
import {
  getPostAuthRoute,
  login,
} from "../../services/authApi";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, updateField: updateFormField } = useFormState({
    identifier: "",
    password: "",
  });
  const { error, isSubmitting, clearError, runSubmit } = useSubmitState(
    "Não foi possível iniciar sessão.",
  );
  const { currentUser, isAuthReady, refreshSession } = useAuth();
  const [storedNotice] = useState(() => {
    const notice = sessionStorage.getItem("auth_notice");

    if (notice) {
      sessionStorage.removeItem("auth_notice");
    }

    return notice;
  });
  const visibleNotice = storedNotice ?? location.state?.notice;

  useEffect(() => {
    if (isAuthReady && currentUser && !location.state?.skipAuthRedirect) {
      navigate(location.state?.redirectTo ?? getPostAuthRoute(), { replace: true });
    }
  }, [
    currentUser,
    isAuthReady,
    location.state?.redirectTo,
    location.state?.skipAuthRedirect,
    navigate,
  ]);

  function updateField(field, value) {
    if (error) {
      clearError();
    }

    updateFormField(field, value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await runSubmit(async () => {
      const data = await login({
        identifier: formData.identifier,
        password: formData.password,
      });

      await refreshSession();
      navigate(location.state?.redirectTo ?? getPostAuthRoute(data.user), {
        replace: true,
      });
    });
  }

  return (
    <SitePage mainClassName="page-shell auth-page">
      <PageHero
        className="auth-hero"
        title="Login"
        description="Entre com o seu username ou email. Se a conta for de administrador, o acesso fica na área de conta e o painel privado continua disponível separadamente."
      />

      <section className="auth-page__content">
        <form className="auth-form" onSubmit={handleSubmit}>
          {visibleNotice ? (
            <div className="auth-notice" role="status" aria-live="polite">
              <span className="auth-notice__eyebrow">Sessão</span>
              <p>{visibleNotice}</p>
            </div>
          ) : null}

          <FormInputField
            className="contact-field"
            label="Username ou Email *"
            type="text"
            value={formData.identifier}
            onChange={(event) => updateField("identifier", event.target.value)}
            required
          />

          <FormInputField
            className="contact-field"
            label="Password *"
            type="password"
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
          />

          <FormError className="contact-field__error" message={error} />

          <div className="auth-form__actions">
            <button
              className="auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "A entrar..." : "Entrar"}</span>
            </button>
          </div>

          <p className="auth-form__helper">
            Ainda não tem conta?{" "}
            <Link to="/registo" state={location.state}>
              Criar conta
            </Link>
          </p>
        </form>
      </section>
    </SitePage>
  );
}

export default Login;
