import { useMemo, useState } from "react";
import {
  AdminDeleteButton,
  AdminLeadCard,
  AdminRecordsPage,
  AdminStatusSelect,
} from "../components/AdminList";
import {
  ADMIN_CONTACT_STATUS_ACTION_OPTIONS,
  ADMIN_CONTACT_STATUS_FILTER_OPTIONS,
  getAdminContactStatusLabel,
} from "../data/adminLeadStatus";
import { useAdminCollection } from "../hooks/useAdminCollection";
import {
  deleteAdminContactMessage,
  fetchAdminContactMessages,
  updateAdminContactMessage,
} from "../services/adminApi";
import {
  formatAdminDateTime,
  getAdminLeadStatus,
  matchesAdminSearch,
} from "../utils/admin";

function getMessageTitle(message) {
  return message.assunto?.trim() || `Mensagem ${message.id}`;
}

function AdminContactMessages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    records: messages,
    error,
    isLoading,
    deletingId,
    updatingId,
    updateRecord,
    deleteRecord,
  } = useAdminCollection({
    loadRecords: fetchAdminContactMessages,
    loadErrorMessage: "Não foi possível carregar as mensagens de contacto.",
  });

  const filteredMessages = useMemo(
    () =>
      messages.filter((message) => {
        const messageStatus = getAdminLeadStatus(message.status);

        if (statusFilter !== "all" && messageStatus !== statusFilter) {
          return false;
        }

        return matchesAdminSearch(
          [
            message.nome,
            message.email,
            message.telefone,
            message.assunto,
            message.mensagem,
            getAdminContactStatusLabel(messageStatus),
          ],
          searchTerm,
        );
      }),
    [messages, searchTerm, statusFilter],
  );

  function handleUpdateMessage(message, status) {
    return updateRecord(message, {
      request: updateAdminContactMessage,
      payload: { status },
      errorMessage: "Não foi possível atualizar a mensagem.",
    });
  }

  function handleDeleteMessage(message) {
    return deleteRecord(message, {
      request: deleteAdminContactMessage,
      getLabel: (record) => record.assunto?.trim() || `mensagem #${record.id}`,
      errorMessage: "Não foi possível eliminar a mensagem de contacto.",
    });
  }

  return (
    <AdminRecordsPage
      title="Mensagens de Contacto"
      currentSection="contacts"
      isLoading={isLoading}
      error={error}
      records={messages}
      filteredRecords={filteredMessages}
      loadingText="A carregar mensagens de contacto..."
      emptyText="Ainda não existem mensagens de contacto registadas."
      filteredEmptyText="Nenhuma mensagem corresponde aos filtros selecionados."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      searchPlaceholder="Nome, email, telefone, assunto ou mensagem"
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      statusOptions={ADMIN_CONTACT_STATUS_FILTER_OPTIONS}
      countText={`${filteredMessages.length} de ${messages.length} mensagem${
        messages.length === 1 ? "" : "ens"
      } de contacto visíve${filteredMessages.length === 1 ? "l" : "is"}.`}
      renderRecord={(message) => {
        const messageStatus = getAdminLeadStatus(message.status);

        return (
          <AdminLeadCard
            key={message.id}
            eyebrow={`Mensagem #${message.id}`}
            title={getMessageTitle(message)}
            timestamp={formatAdminDateTime(message.created_at)}
            status={{
              value: messageStatus,
              label: getAdminContactStatusLabel(messageStatus),
            }}
            metaItems={[
              ["Nome", message.nome ?? "-"],
              ["Email", message.email ?? "-"],
              ["Telefone", message.telefone || "-"],
              ["Assunto", message.assunto ?? "-"],
            ]}
            notes={{
              title: "Mensagem",
              text: message.mensagem?.trim()
                ? message.mensagem
                : "Sem mensagem adicional.",
            }}
            manage={
              <AdminStatusSelect
                value={messageStatus}
                options={ADMIN_CONTACT_STATUS_ACTION_OPTIONS}
                disabled={updatingId === message.id}
                onChange={(nextStatus) => handleUpdateMessage(message, nextStatus)}
              />
            }
            actions={
              <AdminDeleteButton
                disabled={deletingId === message.id}
                onClick={() => handleDeleteMessage(message)}
              />
            }
          />
        );
      }}
    />
  );
}

export default AdminContactMessages;
