import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminPageShell from "../components/admin/AdminPageShell";
import { FormError, FormInputField } from "../components/form/FormField";
import useFormState from "../hooks/useFormState";
import { getAdminToken, loginAdmin, setAdminToken } from "../services/adminApi";

function AdminLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, updateField: updateFormField } = useFormState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getAdminToken()) {
      navigate("/admin/viaturas", { replace: true });
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

      const data = await loginAdmin({
        username: formData.username,
        password: formData.password,
      });

      setAdminToken(data.token);
      navigate("/admin/viaturas");
    } catch (submitError) {
      setError(submitError.message ?? "Nao foi possivel iniciar sessao.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminPageShell title="Login Admin" narrow>
      <form className="admin-form" onSubmit={handleSubmit}>
        {location.state?.notice ? (
          <div className="admin-page__notice" role="status" aria-live="polite">
            {location.state.notice}
          </div>
        ) : null}

        <FormInputField
          className="admin-form__field"
          label="Username"
          type="text"
          value={formData.username}
          onChange={(event) => updateField("username", event.target.value)}
          required
        />

        <FormInputField
          className="admin-form__field"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(event) => updateField("password", event.target.value)}
          required
        />

        <FormError className="admin-form__error" message={error} />

        <div className="admin-form__actions">
          <button
            className="admin-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "A entrar..." : "Entrar"}
          </button>
        </div>
      </form>
    </AdminPageShell>
  );
}

export default AdminLogin;
