import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../components/admin/AdminPageShell";
import AdminSectionLinks from "../components/admin/AdminSectionLinks";
import { FormInputField, FormSelectField } from "../components/form/FormField";
import {
  deleteAdminTradeIn,
  fetchAdminTradeIns,
  updateAdminTradeInStatus,
} from "../services/adminApi";
import { handleAdminSessionError, formatAdminDateTime } from "../utils/admin";
const TRADE_IN_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "unread", label: "Por ver" },
  { value: "viewed", label: "Vistos" },
];

function getTradeInTitle(tradeIn) {
  return [tradeIn.marca, tradeIn.modelo].filter(Boolean).join(" ").trim();
}

function AdminTradeIns() {
  const navigate = useNavigate();
  const [tradeIns, setTradeIns] = useState([]);
  const [error, setError] = useState("");
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
          loadError.message ?? "Nao foi possivel carregar os pedidos de retoma.",
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

  async function handleToggleViewed(tradeIn) {
    try {
      setUpdatingTradeInId(tradeIn.id);
      setError("");

      const updatedTradeIn = await updateAdminTradeInStatus(tradeIn.id, {
        isViewed: !Boolean(tradeIn.is_viewed),
      });

      setTradeIns((currentTradeIns) =>
        currentTradeIns.map((currentTradeIn) =>
          currentTradeIn.id === tradeIn.id ? updatedTradeIn : currentTradeIn,
        ),
      );
    } catch (updateError) {
      if (handleAdminSessionError(updateError, navigate)) {
        return;
      }

      setError(
        updateError.message ?? "Nao foi possivel atualizar o pedido de retoma.",
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
        deleteError.message ?? "Nao foi possivel eliminar o pedido de retoma.",
      );
    } finally {
      setDeletingTradeInId(null);
    }
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredTradeIns = tradeIns.filter((tradeIn) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "viewed"
          ? Boolean(tradeIn.is_viewed)
          : !tradeIn.is_viewed;

    if (!matchesStatus) {
      return false;
    }

    if (!normalizedSearchTerm) {
      return true;
    }

    const searchableText = [
      tradeIn.nome,
      tradeIn.email,
      tradeIn.telefone,
      tradeIn.marca,
      tradeIn.modelo,
      tradeIn.estado_geral,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedSearchTerm);
  });

  return (
    <AdminPageShell
      title="Pedidos de Retoma"
      showLogout
      showBackToSite
      actions={
        <AdminSectionLinks current="tradeIns" />
      }
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar pedidos de retoma...</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : tradeIns.length === 0 ? (
        <div className="admin-page__empty-state">
          <p className="admin-page__text">
            Ainda nao existem pedidos de retoma registados.
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
              placeholder="Nome, email, telefone, marca ou modelo"
            />

            <FormSelectField
              className="admin-form__field"
              label="Estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              {TRADE_IN_STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormSelectField>
          </div>

          <p className="admin-page__text admin-page__text--muted">
            {filteredTradeIns.length} de {tradeIns.length} pedido
            {tradeIns.length === 1 ? "" : "s"} de retoma visive
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
              {filteredTradeIns.map((tradeIn) => (
                <article className="admin-lead-card" key={tradeIn.id}>
                  <div className="admin-lead-card__header">
                    <div>
                      <p className="admin-lead-card__eyebrow">Pedido #{tradeIn.id}</p>
                      <h2 className="admin-lead-card__title">
                        {getTradeInTitle(tradeIn) || `Retoma ${tradeIn.id}`}
                      </h2>
                    </div>

                    <div className="admin-lead-card__header-side">
                      <span
                        className={`admin-lead-card__status${tradeIn.is_viewed ? " is-viewed" : ""}`}
                      >
                        {tradeIn.is_viewed ? "Visto" : "Por ver"}
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
                    <h3>Observacoes</h3>
                    <p>
                      {tradeIn.observacoes?.trim()
                        ? tradeIn.observacoes
                        : "Sem observacoes adicionais."}
                    </p>
                  </div>

                  <div className="admin-lead-card__actions">
                    <button
                      className="admin-button admin-button--secondary"
                      type="button"
                      disabled={
                        updatingTradeInId === tradeIn.id ||
                        deletingTradeInId === tradeIn.id
                      }
                      onClick={() => handleToggleViewed(tradeIn)}
                    >
                      {updatingTradeInId === tradeIn.id
                        ? "A atualizar..."
                        : tradeIn.is_viewed
                          ? "Marcar Como Por Ver"
                          : "Marcar Como Visto"}
                    </button>
                    <button
                      className="admin-button admin-button--danger"
                      type="button"
                      disabled={
                        deletingTradeInId === tradeIn.id ||
                        updatingTradeInId === tradeIn.id
                      }
                      onClick={() => handleDeleteTradeIn(tradeIn)}
                    >
                      {deletingTradeInId === tradeIn.id
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

export default AdminTradeIns;
