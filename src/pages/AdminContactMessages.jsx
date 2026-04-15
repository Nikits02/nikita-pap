import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPageShell from "../components/admin/AdminPageShell";
import { FormInputField } from "../components/form/FormField";
import {
  deleteAdminContactMessage,
  fetchAdminContactMessages,
} from "../services/adminApi";
import { clearAuthSession } from "../services/authApi";

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_VEHICLES_PATH = "/admin/viaturas";
const ADMIN_TRADE_INS_PATH = "/admin/retomas";
const ADMIN_USERS_PATH = "/admin/utilizadores";

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

        if (loadError.message === "Sessao expirada.") {
          clearAuthSession();
          navigate(ADMIN_LOGIN_PATH, { replace: true });
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
      if (deleteError.message === "Sessao expirada.") {
        clearAuthSession();
        navigate(ADMIN_LOGIN_PATH, { replace: true });
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
        <>
          <Link
            className="admin-button admin-button--secondary"
            to={ADMIN_VEHICLES_PATH}
          >
            Ver Viaturas
          </Link>
          <Link
            className="admin-button admin-button--secondary"
            to={ADMIN_TRADE_INS_PATH}
          >
            Ver Retomas
          </Link>
          <Link
            className="admin-button admin-button--secondary"
            to={ADMIN_USERS_PATH}
          >
            Ver Utilizadores
          </Link>
        </>
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
              {filteredMessages.map((message) => (
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
                      {formatCreatedAt(message.created_at)}
                    </p>
                  </div>

                  <dl className="admin-lead-card__meta">
                    <div>
                      <dt>Nome</dt>
                      <dd>{message.nome ?? "-"}</dd>
                    </div>
                    <div>
                      <dt>Email</dt>
                      <dd>{message.email ?? "-"}</dd>
                    </div>
                    <div>
                      <dt>Telefone</dt>
                      <dd>{message.telefone || "-"}</dd>
                    </div>
                    <div>
                      <dt>Assunto</dt>
                      <dd>{message.assunto ?? "-"}</dd>
                    </div>
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
              ))}
            </div>
          )}
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminContactMessages;
