import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPageShell from "../components/admin/AdminPageShell";
import { deleteAdminUser, fetchAdminUsers } from "../services/adminApi";
import { clearAuthSession } from "../services/authApi";

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_VEHICLES_PATH = "/admin/viaturas";
const ADMIN_TRADE_INS_PATH = "/admin/retomas";

const createdAtFormatter = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatCreatedAt(value) {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return createdAtFormatter.format(parsedDate);
}

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setIsLoading(true);
        const loadedUsers = await fetchAdminUsers();

        if (isMounted) {
          setUsers(loadedUsers);
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (loadError.message === "Sessao expirada.") {
          clearAuthSession();
          navigate(ADMIN_LOGIN_PATH, { replace: true });
          return;
        }

        setError(loadError.message ?? "Nao foi possivel carregar os utilizadores.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleDeleteUser(user) {
    const userLabel = user.nome?.trim() || user.username || `utilizador #${user.id}`;
    const shouldDelete = window.confirm(
      `Tem a certeza que pretende eliminar ${userLabel}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingUserId(user.id);
      setError("");
      await deleteAdminUser(user.id);
      setUsers((currentUsers) =>
        currentUsers.filter(({ id }) => id !== user.id),
      );
    } catch (deleteError) {
      if (deleteError.message === "Sessao expirada.") {
        clearAuthSession();
        navigate(ADMIN_LOGIN_PATH, { replace: true });
        return;
      }

      setError(
        deleteError.message ?? "Nao foi possivel eliminar o utilizador.",
      );
    } finally {
      setDeletingUserId(null);
    }
  }

  return (
    <AdminPageShell
      title="Utilizadores Registados"
      showLogout
      showBackToSite
      actions={
        <>
          <Link className="admin-button admin-button--secondary" to={ADMIN_VEHICLES_PATH}>
            Ver Viaturas
          </Link>
          <Link className="admin-button admin-button--secondary" to={ADMIN_TRADE_INS_PATH}>
            Ver Retomas
          </Link>
        </>
      }
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar utilizadores...</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : users.length === 0 ? (
        <div className="admin-page__empty-state">
          <p className="admin-page__text">
            Ainda nao existem utilizadores registados.
          </p>
        </div>
      ) : (
        <div className="admin-leads">
          <p className="admin-page__text admin-page__text--muted">
            {users.length} utilizador{users.length === 1 ? "" : "es"} registado
            {users.length === 1 ? "" : "s"}.
          </p>

          <div className="admin-leads__list">
            {users.map((user) => (
              <article className="admin-lead-card" key={user.id}>
                <div className="admin-lead-card__header">
                  <div>
                    <p className="admin-lead-card__eyebrow">Conta #{user.id}</p>
                    <h2 className="admin-lead-card__title">
                      {user.nome?.trim() || user.username || `Utilizador ${user.id}`}
                    </h2>
                  </div>

                  <p className="admin-lead-card__timestamp">
                    {formatCreatedAt(user.created_at)}
                  </p>
                </div>

                <dl className="admin-lead-card__meta">
                  <div>
                    <dt>Username</dt>
                    <dd>{user.username ?? "-"}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{user.email ?? "-"}</dd>
                  </div>
                  <div>
                    <dt>Nome</dt>
                    <dd>{user.nome ?? "-"}</dd>
                  </div>
                  <div>
                    <dt>Registo</dt>
                    <dd>{formatCreatedAt(user.created_at)}</dd>
                  </div>
                </dl>

                <div className="admin-lead-card__actions">
                  <button
                    className="admin-button admin-button--danger"
                    type="button"
                    disabled={deletingUserId === user.id}
                    onClick={() => handleDeleteUser(user)}
                  >
                    {deletingUserId === user.id ? "A eliminar..." : "Eliminar"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminUsers;
