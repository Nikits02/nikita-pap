import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminPageShell from "../components/AdminPageShell";
import { FormError, FormInputField } from "../../../shared/components/form/FormField";
import { ADMIN_HOME_PATH } from "../data/adminNavigation";
import { useAuth } from "../../../shared/hooks/useAuth";
import useFormState from "../../../shared/hooks/useFormState";
import useSubmitState from "../../../shared/hooks/useSubmitState";
import { loginAdmin } from "../services/adminApi";
import { saveAuthSession } from "../../auth/services/authApi";

function AdminLogin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, updateField: updateFormField } = useFormState({
    username: "",
    password: "",
  });
  const { error, isSubmitting, clearError, runSubmit } = useSubmitState(
    "Não foi possível iniciar sessão.",
  );
  const { hasAdminSession, isAuthReady, refreshSession } = useAuth();
  const redirectTo = location.state?.redirectTo ?? ADMIN_HOME_PATH;

  useEffect(() => {
    if (isAuthReady && hasAdminSession) {
      navigate(redirectTo, { replace: true });
    }
  }, [hasAdminSession, isAuthReady, navigate, redirectTo]);
  function updateField(field, value) {
    if (error) {
      clearError();
    }
    updateFormField(field, value);
  }
  async function handleSubmit(event) {
    event.preventDefault();
    await runSubmit(async () => {
      const data = await loginAdmin({
        username: formData.username,
        password: formData.password,
      });

      saveAuthSession(data);
      await refreshSession();
      navigate(redirectTo, { replace: true });
    });
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
