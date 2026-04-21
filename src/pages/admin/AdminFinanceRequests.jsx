import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import { FormInputField } from "../../components/form/FormField";
import {
  deleteAdminFinanceRequest,
  fetchAdminFinanceRequests,
} from "../../services/adminApi";
import { formatAdminDateTime, handleAdminSessionError } from "../../utils/admin";
import { formatEuro } from "../../utils/format";

function AdminFinanceRequests() {
  const navigate = useNavigate();
  const [financeRequests, setFinanceRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingFinanceRequestId, setDeletingFinanceRequestId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredFinanceRequests = financeRequests.filter((financeRequest) => {
    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = [
      financeRequest.nome,
      financeRequest.email,
      financeRequest.telefone,
      financeRequest.viatura,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });

  return (
    <AdminPageShell
      title="Pedidos de Financiamento"
      showLogout
      showBackToSite
      actions={
        <AdminSectionLinks current="finance" />
      }
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
          <div className="admin-filters admin-filters--single">
            <FormInputField
              className="admin-form__field"
              label="Pesquisar"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nome, email, telefone ou viatura"
            />
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

                      <p className="admin-lead-card__timestamp">
                        {formatAdminDateTime(financeRequest.created_at)}
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
