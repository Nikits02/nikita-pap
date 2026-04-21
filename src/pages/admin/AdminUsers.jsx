import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import { FormInputField } from "../../components/form/FormField";
import { deleteAdminUser, fetchAdminUsers } from "../../services/adminApi";
import { formatAdminDateTime, handleAdminSessionError } from "../../utils/admin";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

        if (handleAdminSessionError(loadError, navigate)) {
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
      if (handleAdminSessionError(deleteError, navigate)) {
        return;
      }

      setError(
        deleteError.message ?? "Nao foi possivel eliminar o utilizador.",
      );
    } finally {
      setDeletingUserId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = [user.nome, user.username, user.email]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });

  return (
    <AdminPageShell
      title="Utilizadores Registados"
      showLogout
      showBackToSite
      actions={
        <AdminSectionLinks current="users" />
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
          <div className="admin-filters admin-filters--single">
            <FormInputField
              className="admin-form__field"
              label="Pesquisar"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nome, username ou email"
            />
          </div>

          <p className="admin-page__text admin-page__text--muted">
            {filteredUsers.length} de {users.length} utilizador
            {users.length === 1 ? "" : "es"} visive
            {filteredUsers.length === 1 ? "l" : "is"}.
          </p>

          {filteredUsers.length === 0 ? (
            <div className="admin-page__empty-state">
              <p className="admin-page__text">
                Nenhum utilizador corresponde aos filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="admin-leads__list">
              {filteredUsers.map((user) => (
                <article className="admin-lead-card" key={user.id}>
                  <div className="admin-lead-card__header">
                    <div>
                      <p className="admin-lead-card__eyebrow">Conta #{user.id}</p>
                      <h2 className="admin-lead-card__title">
                        {user.nome?.trim() || user.username || `Utilizador ${user.id}`}
                      </h2>
                    </div>

                    <p className="admin-lead-card__timestamp">
                      {formatAdminDateTime(user.created_at)}
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
                      <dd>{formatAdminDateTime(user.created_at)}</dd>
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
          )}
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminUsers;
