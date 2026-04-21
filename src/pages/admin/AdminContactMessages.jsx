import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import { FormInputField } from "../../components/form/FormField";
import {
  deleteAdminContactMessage,
  fetchAdminContactMessages,
} from "../../services/adminApi";
import { formatAdminDateTime, handleAdminSessionError } from "../../utils/admin";

function AdminContactMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
            "Nao foi possivel carregar as mensagens de contacto.",
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
          "Nao foi possivel eliminar a mensagem de contacto.",
      );
    } finally {
      setDeletingMessageId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredMessages = messages.filter((message) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = [
      message.nome,
      message.email,
      message.telefone,
      message.assunto,
      message.mensagem,
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
            Ainda nao existem mensagens de contacto registadas.
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
              placeholder="Nome, email, telefone, assunto ou mensagem"
            />
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

                      <p className="admin-lead-card__timestamp">
                        {formatAdminDateTime(message.created_at)}
                      </p>
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
