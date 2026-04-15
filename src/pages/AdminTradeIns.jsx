import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPageShell from "../components/admin/AdminPageShell";
import {
  deleteAdminTradeIn,
  fetchAdminTradeIns,
  updateAdminTradeInStatus,
} from "../services/adminApi";
import { clearAuthSession } from "../services/authApi";

const ADMIN_LOGIN_PATH = "/admin/login";
const ADMIN_VEHICLES_PATH = "/admin/viaturas";
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

        if (loadError.message === "Sessao expirada.") {
          clearAuthSession();
          navigate(ADMIN_LOGIN_PATH, { replace: true });
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
      if (updateError.message === "Sessao expirada.") {
        clearAuthSession();
        navigate(ADMIN_LOGIN_PATH, { replace: true });
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
      if (deleteError.message === "Sessao expirada.") {
        clearAuthSession();
        navigate(ADMIN_LOGIN_PATH, { replace: true });
        return;
      }

      setError(
        deleteError.message ?? "Nao foi possivel eliminar o pedido de retoma.",
      );
    } finally {
      setDeletingTradeInId(null);
    }
  }

  return (
    <AdminPageShell
      title="Pedidos de Retoma"
      showLogout
      showBackToSite
      actions={
        <>
          <Link className="admin-button admin-button--secondary" to={ADMIN_VEHICLES_PATH}>
            Ver Viaturas
          </Link>
          <Link className="admin-button admin-button--secondary" to={ADMIN_USERS_PATH}>
            Ver Utilizadores
          </Link>
        </>
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
          <p className="admin-page__text admin-page__text--muted">
            {tradeIns.length} pedido{tradeIns.length === 1 ? "" : "s"} de retoma
            {" "}
            recebido{tradeIns.length === 1 ? "" : "s"}.
          </p>

          <div className="admin-leads__list">
            {tradeIns.map((tradeIn) => (
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
                      {formatCreatedAt(tradeIn.created_at)}
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
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminTradeIns;
