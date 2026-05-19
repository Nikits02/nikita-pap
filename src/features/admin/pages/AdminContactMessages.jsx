import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../components/AdminPageShell";
import AdminSectionLinks from "../components/AdminSectionLinks";
import {
  FormInputField,
  FormSelectField,
} from "../../../shared/components/form/FormField";
import {
  ADMIN_CONTACT_STATUS_ACTION_OPTIONS,
  ADMIN_CONTACT_STATUS_FILTER_OPTIONS,
  getAdminContactStatusLabel,
} from "../data/adminLeadStatus";
import {
  deleteAdminContactMessage,
  fetchAdminContactMessages,
  updateAdminContactMessage,
} from "../services/adminApi";
import {
  formatAdminDateTime,
  getAdminLeadStatus,
  handleAdminSessionError,
  matchesAdminSearch,
} from "../utils/admin";

function AdminContactMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [updatingMessageId, setUpdatingMessageId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      try {
        setIsLoading(true);
        const loadedMessages = await fetchAdminContactMessages();

        if (isMounted) {
          setMessages(loadedMessages);
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (handleAdminSessionError(loadError, navigate)) {
          return;
        }

        setError(
          loadError.message ??
            "Não foi possível carregar as mensagens de contacto.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleDeleteMessage(message) {
    const messageLabel = message.assunto?.trim() || `mensagem #${message.id}`;
    const shouldDelete = window.confirm(
      `Tem a certeza que pretende eliminar ${messageLabel}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingMessageId(message.id);
      setError("");
      await deleteAdminContactMessage(message.id);
      setMessages((currentMessages) =>
        currentMessages.filter(({ id }) => id !== message.id),
      );
    } catch (deleteError) {
      if (handleAdminSessionError(deleteError, navigate)) {
        return;
      }

      setError(
        deleteError.message ??
          "Não foi possível eliminar a mensagem de contacto.",
      );
    } finally {
      setDeletingMessageId(null);
    }
  }

  async function handleUpdateMessage(message, nextValues = {}) {
    try {
      setUpdatingMessageId(message.id);
      setError("");

      const updatedMessage = await updateAdminContactMessage(message.id, {
        status: nextValues.status ?? getAdminLeadStatus(message.status),
      });

      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === message.id ? updatedMessage : currentMessage,
        ),
      );
    } catch (updateError) {
      if (handleAdminSessionError(updateError, navigate)) {
        return;
      }

      setError(
        updateError.message ?? "Não foi possível atualizar a mensagem.",
      );
    } finally {
      setUpdatingMessageId(null);
    }
  }

  const filteredMessages = messages.filter((message) => {
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
  });

  return (
    <AdminPageShell
      title="Mensagens de Contacto"
      showLogout
      showBackToSite
      actions={
        <AdminSectionLinks current="contacts" />
      }
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar mensagens de contacto...</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : messages.length === 0 ? (
        <div className="admin-page__empty-state">
          <p className="admin-page__text">
            Ainda não existem mensagens de contacto registadas.
          </p>
        </div>
      ) : (
        <div className="admin-leads">
          <div className="admin-filters">
            <FormInputField
              className="admin-form__field"
              label="Pesquisar"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nome, email, telefone, assunto ou mensagem"
            />

            <FormSelectField
              className="admin-form__field"
              label="Estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {ADMIN_CONTACT_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>

          <p className="admin-page__text admin-page__text--muted">
            {filteredMessages.length} de {messages.length} mensagem
            {messages.length === 1 ? "" : "ens"} de contacto visíve
            {filteredMessages.length === 1 ? "l" : "is"}.
          </p>

          {filteredMessages.length === 0 ? (
            <div className="admin-page__empty-state">
              <p className="admin-page__text">
                Nenhuma mensagem corresponde aos filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="admin-leads__list">
              {filteredMessages.map((message) => {
                const messageStatus = getAdminLeadStatus(message.status);
                const metaItems = [
                  ["Nome", message.nome ?? "-"],
                  ["Email", message.email ?? "-"],
                  ["Telefone", message.telefone || "-"],
                  ["Assunto", message.assunto ?? "-"],
                ];

                return (
                  <article className="admin-lead-card" key={message.id}>
                    <div className="admin-lead-card__header">
                      <div>
                        <p className="admin-lead-card__eyebrow">
                          Mensagem #{message.id}
                        </p>
                        <h2 className="admin-lead-card__title">
                          {message.assunto?.trim() || `Mensagem ${message.id}`}
                        </h2>
                      </div>

                      <div className="admin-lead-card__header-side">
                        <span
                          className={`admin-lead-card__status admin-lead-card__status--${messageStatus}`}
                        >
                          {getAdminContactStatusLabel(messageStatus)}
                        </span>
                        <p className="admin-lead-card__timestamp">
                          {formatAdminDateTime(message.created_at)}
                        </p>
                      </div>
                    </div>

                    <dl className="admin-lead-card__meta">
                      {metaItems.map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="admin-lead-card__notes">
                      <h3>Mensagem</h3>
                      <p>
                        {message.mensagem?.trim()
                          ? message.mensagem
                          : "Sem mensagem adicional."}
                      </p>
                    </div>

                    <div className="admin-lead-card__manage">
                      <FormSelectField
                        className="admin-form__field"
                        label="Decisão"
                        value={
                          ADMIN_CONTACT_STATUS_ACTION_OPTIONS.some(
                            (option) => option.value === messageStatus,
                          )
                            ? messageStatus
                            : ""
                        }
                        disabled={updatingMessageId === message.id}
                        onChange={(event) =>
                          handleUpdateMessage(message, {
                            status: event.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Escolher decisão
                        </option>
                        {ADMIN_CONTACT_STATUS_ACTION_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FormSelectField>
                    </div>

                    <div className="admin-lead-card__actions">
                      <button
                        className="admin-button admin-button--danger"
                        type="button"
                        disabled={deletingMessageId === message.id}
                        onClick={() => handleDeleteMessage(message)}
                      >
                        {deletingMessageId === message.id
                          ? "A eliminar..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminContactMessages;
