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
  deleteAdminFinanceRequest,
  fetchAdminFinanceRequests,
  updateAdminFinanceRequest,
} from "../../services/adminApi";
import {
  formatAdminDateTime,
  getAdminLeadStatus,
  handleAdminSessionError,
  matchesAdminSearch,
} from "../../utils/admin";
import { formatEuro } from "../../utils/format";

function hasDecisionStatus(status) {
  return ADMIN_DECISION_STATUS_ACTION_OPTIONS.some(
    (option) => option.value === status,
  );
}

function AdminFinanceRequests() {
  const navigate = useNavigate();
  const [financeRequests, setFinanceRequests] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingFinanceRequestId, setDeletingFinanceRequestId] = useState(null);
  const [updatingFinanceRequestId, setUpdatingFinanceRequestId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadFinanceRequests() {
      try {
        setIsLoading(true);
        const loadedFinanceRequests = await fetchAdminFinanceRequests();

        if (isMounted) {
          setFinanceRequests(loadedFinanceRequests);
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
            "Nao foi possivel carregar os pedidos de financiamento.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFinanceRequests();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleUpdateFinanceRequest(financeRequest, nextValues = {}) {
    try {
      setUpdatingFinanceRequestId(financeRequest.id);
      setError("");
      setNotice("");

      const updatedFinanceRequest = await updateAdminFinanceRequest(
        financeRequest.id,
        {
          status: nextValues.status ?? getAdminLeadStatus(financeRequest.status),
        },
      );

      setFinanceRequests((currentRequests) =>
        currentRequests.map((currentRequest) =>
          currentRequest.id === financeRequest.id
            ? updatedFinanceRequest
            : currentRequest,
        ),
      );
      if (["accepted", "rejected"].includes(updatedFinanceRequest.status)) {
        if (updatedFinanceRequest.notification_email_sent) {
          setNotice("Estado atualizado e email enviado ao cliente.");
        } else if (
          updatedFinanceRequest.notification_email_skipped_reason ===
          "email-not-configured"
        ) {
          setNotice(
            "Estado atualizado. O email nao foi enviado porque o SMTP ainda nao esta configurado.",
          );
        } else if (updatedFinanceRequest.notification_email_error) {
          setNotice("Estado atualizado, mas houve erro ao enviar o email.");
        }
      }
    } catch (updateError) {
      if (handleAdminSessionError(updateError, navigate)) {
        return;
      }

      setError(
        updateError.message ??
          "Nao foi possivel atualizar o pedido de financiamento.",
      );
    } finally {
      setUpdatingFinanceRequestId(null);
    }
  }

  async function handleDeleteFinanceRequest(financeRequest) {
    const requestLabel =
      financeRequest.viatura?.trim() ||
      financeRequest.nome?.trim() ||
      `pedido #${financeRequest.id}`;
    const shouldDelete = window.confirm(
      `Tem a certeza que pretende eliminar ${requestLabel}?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingFinanceRequestId(financeRequest.id);
      setError("");
      await deleteAdminFinanceRequest(financeRequest.id);
      setFinanceRequests((currentRequests) =>
        currentRequests.filter(({ id }) => id !== financeRequest.id),
      );
    } catch (deleteError) {
      if (handleAdminSessionError(deleteError, navigate)) {
        return;
      }

      setError(
        deleteError.message ??
          "Nao foi possivel eliminar o pedido de financiamento.",
      );
    } finally {
      setDeletingFinanceRequestId(null);
    }
  }

  const filteredFinanceRequests = financeRequests.filter((financeRequest) => {
    const financeStatus = getAdminLeadStatus(financeRequest.status);

    if (statusFilter !== "all" && financeStatus !== statusFilter) {
      return false;
    }

    return matchesAdminSearch(
      [
        financeRequest.nome,
        financeRequest.email,
        financeRequest.telefone,
        financeRequest.viatura,
        getAdminDecisionStatusLabel(financeStatus),
      ],
      searchTerm,
    );
  });

  return (
    <AdminPageShell
      title="Pedidos de Financiamento"
      showLogout
      showBackToSite
      actions={<AdminSectionLinks current="finance" />}
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar pedidos de financiamento...</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : financeRequests.length === 0 ? (
        <div className="admin-page__empty-state">
          <p className="admin-page__text">
            Ainda nao existem pedidos de financiamento registados.
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
              placeholder="Nome, email, telefone ou viatura"
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
            {filteredFinanceRequests.length} de {financeRequests.length} pedido
            {financeRequests.length === 1 ? "" : "s"} de financiamento visive
            {filteredFinanceRequests.length === 1 ? "l" : "is"}.
          </p>

          {filteredFinanceRequests.length === 0 ? (
            <div className="admin-page__empty-state">
              <p className="admin-page__text">
                Nenhum pedido corresponde aos filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="admin-leads__list">
              {filteredFinanceRequests.map((financeRequest) => {
                const financeStatus = getAdminLeadStatus(financeRequest.status);
                const metaItems = [
                  ["Nome", financeRequest.nome ?? "-"],
                  ["Email", financeRequest.email ?? "-"],
                  ["Telefone", financeRequest.telefone ?? "-"],
                  ["Viatura", financeRequest.viatura || "-"],
                  ["Preco", `${formatEuro(financeRequest.preco)} EUR`],
                  ["Entrada", `${formatEuro(financeRequest.entrada)} EUR`],
                  ["Prazo", `${financeRequest.meses ?? "-"} meses`],
                  ["TAN", `${financeRequest.taxa ?? "-"}%`],
                  [
                    "Prestacao",
                    `${formatEuro(financeRequest.prestacao_mensal)} EUR`,
                  ],
                  [
                    "Montante Total",
                    `${formatEuro(financeRequest.montante_total)} EUR`,
                  ],
                  ["TAEG", `${financeRequest.taeg ?? "-"}%`],
                  [
                    "Recebido em",
                    formatAdminDateTime(financeRequest.created_at),
                  ],
                ];

                return (
                  <article className="admin-lead-card" key={financeRequest.id}>
                    <div className="admin-lead-card__header">
                      <div>
                        <p className="admin-lead-card__eyebrow">
                          Pedido #{financeRequest.id}
                        </p>
                        <h2 className="admin-lead-card__title">
                          {financeRequest.viatura?.trim() ||
                            financeRequest.nome?.trim() ||
                            `Financiamento ${financeRequest.id}`}
                        </h2>
                      </div>

                      <div className="admin-lead-card__header-side">
                        <span
                          className={`admin-lead-card__status admin-lead-card__status--${financeStatus}`}
                        >
                          {getAdminDecisionStatusLabel(financeStatus)}
                        </span>
                        <p className="admin-lead-card__timestamp">
                          {formatAdminDateTime(financeRequest.created_at)}
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

                    <div className="admin-lead-card__manage">
                      <FormSelectField
                        className="admin-form__field"
                        label="Decisao"
                        value={hasDecisionStatus(financeStatus) ? financeStatus : ""}
                        disabled={updatingFinanceRequestId === financeRequest.id}
                        onChange={(event) =>
                          handleUpdateFinanceRequest(financeRequest, {
                            status: event.target.value,
                          })
                        }
                      >
                        <option value="" disabled>
                          Escolher decisao
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
                        disabled={deletingFinanceRequestId === financeRequest.id}
                        onClick={() => handleDeleteFinanceRequest(financeRequest)}
                      >
                        {deletingFinanceRequestId === financeRequest.id
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

export default AdminFinanceRequests;
