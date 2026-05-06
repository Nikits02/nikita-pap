import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import {
  FormInputField,
  FormSelectField,
  FormTextareaField,
} from "../../components/form/FormField";
import {
  ADMIN_LEAD_STATUS_FILTER_OPTIONS,
  ADMIN_LEAD_STATUS_OPTIONS,
  getAdminLeadStatusLabel,
} from "../../data/adminLeadStatus";
import {
  deleteAdminContactMessage,
  fetchAdminContactMessages,
  updateAdminContactMessage,
} from "../../services/adminApi";
import { formatAdminDateTime, handleAdminSessionError } from "../../utils/admin";

function getLeadStatus(value) {
  return value || "new";
}

function AdminContactMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [updatingMessageId, setUpdatingMessageId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [draftNotes, setDraftNotes] = useState({});

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
        status: nextValues.status ?? getLeadStatus(message.status),
        internalNotes:
          nextValues.internalNotes ??
          draftNotes[message.id] ??
          message.internal_notes ??
          "",
      });

      setMessages((currentMessages) =>
        currentMessages.map((currentMessage) =>
          currentMessage.id === message.id ? updatedMessage : currentMessage,
        ),
      );
      setDraftNotes((currentNotes) => ({
        ...currentNotes,
        [message.id]: updatedMessage.internal_notes ?? "",
      }));
    } catch (updateError) {
      if (handleAdminSessionError(updateError, navigate)) {
        return;
      }

      setError(
        updateError.message ?? "NÃ£o foi possÃ­vel atualizar a mensagem.",
      );
    } finally {
      setUpdatingMessageId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredMessages = messages.filter((message) => {
    if (statusFilter !== "all" && getLeadStatus(message.status) !== statusFilter) {
      return false;
    }

    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = [
      message.nome,
      message.email,
      message.telefone,
      message.assunto,
      message.mensagem,
      getAdminLeadStatusLabel(getLeadStatus(message.status)),
      message.internal_notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
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
              {ADMIN_LEAD_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>

          <p className="admin-page__text admin-page__text--muted">
            {filteredMessages.length} de {messages.length} mensagem
            {messages.length === 1 ? "" : "ens"} de contacto visive
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
                const messageStatus = getLeadStatus(message.status);
                const noteDraft =
                  draftNotes[message.id] ?? message.internal_notes ?? "";
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
                          {getAdminLeadStatusLabel(messageStatus)}
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
                        label="Estado"
                        value={messageStatus}
                        disabled={updatingMessageId === message.id}
                        onChange={(event) =>
                          handleUpdateMessage(message, {
                            status: event.target.value,
                          })
                        }
                      >
                        {ADMIN_LEAD_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </FormSelectField>

                      <FormTextareaField
                        className="admin-form__field admin-form__field--full"
                        label="Notas internas"
                        rows="3"
                        value={noteDraft}
                        placeholder="Notas apenas visiveis no painel admin"
                        onChange={(event) =>
                          setDraftNotes((currentNotes) => ({
                            ...currentNotes,
                            [message.id]: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="admin-lead-card__actions">
                      <button
                        className="admin-button admin-button--secondary"
                        type="button"
                        disabled={updatingMessageId === message.id}
                        onClick={() => handleUpdateMessage(message)}
                      >
                        {updatingMessageId === message.id
                          ? "A guardar..."
                          : "Guardar notas"}
                      </button>
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
