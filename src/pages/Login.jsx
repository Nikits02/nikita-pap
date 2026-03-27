import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormError, FormInputField } from "../components/form/FormField";
import PageHero from "../components/PageHero";
import SitePage from "../components/SitePage";
import useFormState from "../hooks/useFormState";
import {
  getCurrentUser,
  getDefaultRouteForUser,
  login,
} from "../services/authApi";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, updateField: updateFormField } = useFormState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      navigate(getDefaultRouteForUser(currentUser), { replace: true });
    }
  }, [navigate]);

  function updateField(field, value) {
    if (error) {
      setError("");
    }

    updateFormField(field, value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);

      const data = await login({
        identifier: formData.identifier,
        password: formData.password,
      });

      navigate(getDefaultRouteForUser(data.user), { replace: true });
    } catch (submitError) {
      setError(submitError.message ?? "Nao foi possivel iniciar sessao.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SitePage mainClassName="page-shell auth-page">
      <PageHero
        className="auth-hero"
        title="Login"
        description="Entre com o seu username ou email. Se a conta for de administrador, o acesso fica na area de conta e o painel privado continua disponivel separadamente."
      />

      <section className="auth-page__content">
        <form className="auth-form" onSubmit={handleSubmit}>
          {location.state?.notice ? (
            <div className="auth-notice" role="status" aria-live="polite">
              <span className="auth-notice__eyebrow">Sessao</span>
              <p>{location.state.notice}</p>
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
              className="contact-submit auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "A entrar..." : "Entrar"}</span>
            </button>
          </div>

          <p className="auth-form__helper">
            Ainda nao tem conta? <Link to="/registo">Criar conta</Link>
          </p>
        </form>
      </section>
    </SitePage>
  );
}

export default Login;
