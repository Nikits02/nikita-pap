import { useMemo, useState } from "react";
import {
  AdminDeleteButton,
  AdminLeadCard,
  AdminRecordsPage,
} from "../components/AdminList";
import { useAdminCollection } from "../hooks/useAdminCollection";
import { deleteAdminUser, fetchAdminUsers } from "../services/adminApi";
import {
  formatAdminDateTime,
  matchesAdminSearch,
} from "../utils/admin";

function getUserTitle(user) {
  return user.nome?.trim() || user.username || `Utilizador ${user.id}`;
}

function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    records: users,
    error,
    isLoading,
    deletingId,
    deleteRecord,
  } = useAdminCollection({
    loadRecords: fetchAdminUsers,
    loadErrorMessage: "Não foi possível carregar os utilizadores.",
  });

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        matchesAdminSearch([user.nome, user.username, user.email], searchTerm),
      ),
    [searchTerm, users],
  );

  function handleDeleteUser(user) {
    return deleteRecord(user, {
      request: deleteAdminUser,
      getLabel: (record) =>
        record.nome?.trim() || record.username || `utilizador #${record.id}`,
      errorMessage: "Não foi possível eliminar o utilizador.",
    });
  }

  return (
    <AdminRecordsPage
      title="Utilizadores Registados"
      currentSection="users"
      isLoading={isLoading}
      error={error}
      records={users}
      filteredRecords={filteredUsers}
      loadingText="A carregar utilizadores..."
      emptyText="Ainda não existem utilizadores registados."
      filteredEmptyText="Nenhum utilizador corresponde aos filtros selecionados."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      searchPlaceholder="Nome, username ou email"
      countText={`${filteredUsers.length} de ${users.length} utilizador${
        users.length === 1 ? "" : "es"
      } visíve${filteredUsers.length === 1 ? "l" : "is"}.`}
      renderRecord={(user) => (
        <AdminLeadCard
          key={user.id}
          eyebrow={`Conta #${user.id}`}
          title={getUserTitle(user)}
          timestamp={formatAdminDateTime(user.created_at)}
          metaItems={[
            ["Username", user.username ?? "-"],
            ["Email", user.email ?? "-"],
            ["Nome", user.nome ?? "-"],
            ["Registo", formatAdminDateTime(user.created_at)],
          ]}
          actions={
            <AdminDeleteButton
              disabled={deletingId === user.id}
              onClick={() => handleDeleteUser(user)}
            />
          }
        />
      )}
    />
  );
}

export default AdminUsers;
