import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPageShell from "../components/AdminPageShell";
import AdminSectionLinks from "../components/AdminSectionLinks";
import { fetchAdminDashboardSummary } from "../services/adminApi";
import { handleAdminSessionError } from "../utils/admin";

const DASHBOARD_CARDS = [
  {
    key: "vehicles",
    label: "Viaturas totais",
    description: "Viaturas registadas no catálogo.",
    path: "/admin/viaturas",
  },
  {
    key: "tradeIns",
    label: "Retomas por ver",
    description: "Pedidos de retoma ainda sem decisão.",
    path: "/admin/retomas",
  },
  {
    key: "finance",
    label: "Financiamentos por ver",
    description: "Pedidos de financiamento ainda sem decisão.",
    path: "/admin/financiamentos",
  },
  {
    key: "testDrives",
    label: "Test drives por ver",
    description: "Pedidos de test drive ainda por agendar ou cancelar.",
    path: "/admin/test-drives",
  },
  {
    key: "contacts",
    label: "Contactos por ver",
    description: "Mensagens de contacto ainda sem resposta.",
    path: "/admin/contactos",
  },
];

const EMPTY_SUMMARY = {
  vehicles: 0,
  tradeIns: 0,
  finance: 0,
  testDrives: 0,
  contacts: 0,
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        const loadedSummary = await fetchAdminDashboardSummary();

        if (isMounted) {
          setSummary({
            ...EMPTY_SUMMARY,
            ...loadedSummary,
          });
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (handleAdminSessionError(loadError, navigate)) {
          return;
        }

        setError(loadError.message ?? "Não foi possível carregar o resumo.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <AdminPageShell
      title="Resumo do Painel"
      showLogout
      showBackToSite
      actions={<AdminSectionLinks current="dashboard" />}
    >
      {isLoading ? (
        <p className="admin-page__text">A carregar resumo...</p>
      ) : error ? (
        <p className="admin-form__error">{error}</p>
      ) : (
        <div className="admin-dashboard">
          <p className="admin-page__text admin-page__text--muted">
            Visão geral dos dados principais e dos pedidos que precisam de
            atenção.
          </p>

          <div className="admin-dashboard__grid">
            {DASHBOARD_CARDS.map((card) => (
              <Link
                className="admin-dashboard-card"
                key={card.key}
                to={card.path}
              >
                <span className="admin-dashboard-card__label">
                  {card.label}
                </span>
                <strong className="admin-dashboard-card__value">
                  {summary[card.key]}
                </strong>
                <span className="admin-dashboard-card__description">
                  {card.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminDashboard;
