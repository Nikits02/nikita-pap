import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import {
  FormInputField,
  FormSelectField,
} from "../../components/form/FormField";
import {
  ADMIN_DECISION_STATUS_ACTION_OPTIONS,
  ADMIN_DECISION_STATUS_FILTER_OPTIONS,
  getAdminDecisionStatusLabel,
} from "../../data/adminLeadStatus";
import {
  deleteAdminTradeIn,
  fetchAdminTradeIns,
  updateAdminTradeInStatus,
} from "../../services/adminApi";
import {
  formatAdminDateTime,
  getAdminLeadStatus,
  handleAdminSessionError,
  matchesAdminSearch,
} from "../../utils/admin";

function getTradeInTitle(tradeIn) {
  return [tradeIn.marca, tradeIn.modelo].filter(Boolean).join(" ").trim();
}

function hasDecisionStatus(status) {
  return ADMIN_DECISION_STATUS_ACTION_OPTIONS.some(
    (option) => option.value === status,
  );
}

function AdminTradeIns() {
  const navigate = useNavigate();
  const [tradeIns, setTradeIns] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTradeInId, setUpdatingTradeInId] = useState(null);
  const [deletingTradeInId, setDeletingTradeInId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadTradeIns() {
      try {
        setIsLoading(true);
        const loadedTradeIns = await fetchAdminTradeIns();

        if (isMounted) {
          setTradeIns(loadedTradeIns);
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (handleAdminSessionError(loadError, navigate)) {
          return;
        }

        setError(
          loadError.message ?? "Não foi possível carregar os pedidos de retoma.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTradeIns();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleUpdateTradeIn(tradeIn, nextValues = {}) {
    try {
      setUpdatingTradeInId(tradeIn.id);
      setError("");
      setNotice("");

      const updatedTradeIn = await updateAdminTradeInStatus(tradeIn.id, {
        status: nextValues.status ?? getAdminLeadStatus(tradeIn.status),
      });

      setTradeIns((currentTradeIns) =>
        currentTradeIns.map((currentTradeIn) =>
          currentTradeIn.id === tradeIn.id ? updatedTradeIn : currentTradeIn,
        ),
      );
      if (["accepted", "rejected"].includes(updatedTradeIn.status)) {
        if (updatedTradeIn.notification_email_sent) {
          setNotice("Estado atualizado e email enviado ao cliente.");
        } else if (
          updatedTradeIn.notification_email_skipped_reason ===
          "email-not-configured"
        ) {
          setNotice(
            "Estado atualizado. O email não foi enviado porque o SMTP ainda não está configurado.",
          );
        } else if (updatedTradeIn.notification_email_error) {
          setNotice("Estado atualizado, mas houve erro ao enviar o email.");
        }
      }
    } catch (updateError) {
      if (handleAdminSessionError(updateError, navigate)) {
        return;
      }

      setError(
        updateError.message ?? "Não foi possível atualizar o pedido de retoma.",
      );
    } finally {
      setUpdatingTradeInId(null);
    }
  }

  async function handleDeleteTradeIn(tradeIn) {
    const tradeInLabel = getTradeInTitle(tradeIn) || `pedido #${tradeIn.id}`;
    const shouldDelete = window.confirm(
      `Tem a certeza que pretende eliminar ${tradeInLabel}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingTradeInId(tradeIn.id);
      setError("");
      await deleteAdminTradeIn(tradeIn.id);
      setTradeIns((currentTradeIns) =>
        currentTradeIns.filter(({ id }) => id !== tradeIn.id),
      );
    } catch (deleteError) {
      if (handleAdminSessionError(deleteError, navigate)) {
        return;
      }

      setError(
        deleteError.message ?? "Não foi possível eliminar o pedido de retoma.",
      );
    } finally {
      setDeletingTradeInId(null);
    }
  }

  const filteredTradeIns = tradeIns.filter((tradeIn) => {
    const tradeInStatus = getAdminLeadStatus(tradeIn.status);

    if (statusFilter !== "all" && tradeInStatus !== statusFilter) {
      return false;
    }

    return matchesAdminSearch(
      [
        tradeIn.nome,
        tradeIn.email,
        tradeIn.telefone,
        tradeIn.marca,
        tradeIn.modelo,
        tradeIn.estado_geral,
        getAdminDecisionStatusLabel(tradeInStatus),
      ],
      searchTerm,
    );
  });

  return (
    <AdminPageShell
      title="Pedidos de Retoma"
      showLogout
      showBackToSite
      actions={<AdminSectionLinks current="tradeIns" />}
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar pedidos de retoma...</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : tradeIns.length === 0 ? (
        <div className="admin-page__empty-state">
          <p className="admin-page__text">
            Ainda não existem pedidos de retoma registados.
          </p>
        </div>
      ) : (
        <div className="admin-leads">
          {notice ? <p className="admin-page__notice">{notice}</p> : null}

          <div className="admin-filters">
            <FormInputField
              className="admin-form__field"
              label="Pesquisar"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nome, email, telefone, marca ou modelo"
            />

            <FormSelectField
              className="admin-form__field"
              label="Estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {ADMIN_DECISION_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>

          <p className="admin-page__text admin-page__text--muted">
            {filteredTradeIns.length} de {tradeIns.length} pedido
            {tradeIns.length === 1 ? "" : "s"} de retoma visíve
            {filteredTradeIns.length === 1 ? "l" : "is"}.
          </p>

          {filteredTradeIns.length === 0 ? (
            <div className="admin-page__empty-state">
              <p className="admin-page__text">
                Nenhum pedido corresponde aos filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="admin-leads__list">
              {filteredTradeIns.map((tradeIn) => {
                const tradeInStatus = getAdminLeadStatus(tradeIn.status);

                return (
                  <article className="admin-lead-card" key={tradeIn.id}>
                    <div className="admin-lead-card__header">
                      <div>
                        <p className="admin-lead-card__eyebrow">
                          Pedido #{tradeIn.id}
                        </p>
                        <h2 className="admin-lead-card__title">
                          {getTradeInTitle(tradeIn) || `Retoma ${tradeIn.id}`}
                        </h2>
                      </div>

                      <div className="admin-lead-card__header-side">
                        <span
                          className={`admin-lead-card__status admin-lead-card__status--${tradeInStatus}`}
                        >
                          {getAdminDecisionStatusLabel(tradeInStatus)}
                        </span>
                        <p className="admin-lead-card__timestamp">
                          {formatAdminDateTime(tradeIn.created_at)}
                        </p>
                      </div>
                    </div>

                    <dl className="admin-lead-card__meta">
                      <div>
                        <dt>Ano</dt>
                        <dd>{tradeIn.ano ?? "-"}</dd>
                      </div>
                      <div>
                        <dt>Quilometros</dt>
                        <dd>{tradeIn.quilometragem ?? "-"}</dd>
                      </div>
                      <div>
                        <dt>Estado Geral</dt>
                        <dd>{tradeIn.estado_geral ?? "-"}</dd>
                      </div>
                      <div>
                        <dt>Nome</dt>
                        <dd>{tradeIn.nome ?? "-"}</dd>
                      </div>
                      <div>
                        <dt>Telefone</dt>
                        <dd>{tradeIn.telefone ?? "-"}</dd>
                      </div>
                      <div>
                        <dt>Email</dt>
                        <dd>{tradeIn.email ?? "-"}</dd>
                      </div>
                    </dl>

                    <div className="admin-lead-card__notes">
                      <h3>Observações</h3>
                      <p>
                        {tradeIn.observacoes?.trim()
                          ? tradeIn.observacoes
                          : "Sem observações adicionais."}
                      </p>
                    </div>

                    <div className="admin-lead-card__manage">
                      <FormSelectField
                        className="admin-form__field"
                        label="Decisão"
                        value={hasDecisionStatus(tradeInStatus) ? tradeInStatus : ""}
                        disabled={updatingTradeInId === tradeIn.id}
                        onChange={(event) =>
                          handleUpdateTradeIn(tradeIn, {
                            status: event.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Escolher decisão
                        </option>
                        {ADMIN_DECISION_STATUS_ACTION_OPTIONS.map((option) => (
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
                        disabled={deletingTradeInId === tradeIn.id}
                        onClick={() => handleDeleteTradeIn(tradeIn)}
                      >
                        {deletingTradeInId === tradeIn.id
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

export default AdminTradeIns;
