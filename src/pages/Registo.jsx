import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormError, FormInputField } from "../components/form/FormField";
import PageHero from "../components/PageHero";
import SitePage from "../components/SitePage";
import useFormState from "../hooks/useFormState";
import {
  getCurrentUser,
  getPostAuthRoute,
  register,
} from "../services/authApi";

function Registo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, updateField: updateFormField } = useFormState({
    nome: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (currentUser) {
      navigate(getPostAuthRoute(), { replace: true });
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

    if (formData.password !== formData.confirmPassword) {
      setError("As passwords nao coincidem.");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = await register({
        nome: formData.nome,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      navigate(getPostAuthRoute(data.user), { replace: true });
    } catch (submitError) {
      setError(submitError.message ?? "Nao foi possivel criar a conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SitePage mainClassName="page-shell auth-page">
      <PageHero
        className="auth-hero"
        title="Registo"
        description="Crie uma conta para aceder a uma area privada. Se a conta for admin, o painel continua disponivel a partir da area de conta."
      />

      <section className="auth-page__content">
        <form className="auth-form auth-form--wide" onSubmit={handleSubmit}>
          <FormInputField
            className="contact-field"
            label="Nome *"
            type="text"
            value={formData.nome}
            onChange={(event) => updateField("nome", event.target.value)}
            required
          />

          <FormInputField
            className="contact-field"
            label="Username *"
            type="text"
            value={formData.username}
            onChange={(event) => updateField("username", event.target.value)}
            required
          />

          <FormInputField
            className="contact-field"
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
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

          <FormInputField
            className="contact-field"
            label="Confirmar Password *"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) =>
              updateField("confirmPassword", event.target.value)
            }
            required
          />

          <FormError className="contact-field__error" message={error} />

          <div className="auth-form__actions">
            <button
              className="contact-submit auth-submit"
              type="submit"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "A criar conta..." : "Criar Conta"}</span>
            </button>
          </div>

          <p className="auth-form__helper">
            Ja tem conta?{" "}
            <Link to="/login" state={location.state}>
              Iniciar sessao
            </Link>
          </p>
        </form>
      </section>
    </SitePage>
  );
}

export default Registo;
