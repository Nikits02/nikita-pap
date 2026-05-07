import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminPageShell from "../../components/admin/AdminPageShell";
import AdminSectionLinks from "../../components/admin/AdminSectionLinks";
import {
  fetchAdminContactMessages,
  fetchAdminFinanceRequests,
  fetchAdminTestDrives,
  fetchAdminTradeIns,
  fetchAdminVehicles,
} from "../../services/adminApi";
import {
  getAdminLeadStatus,
  handleAdminSessionError,
} from "../../utils/admin";

const DASHBOARD_CARDS = [
  {
    key: "vehicles",
    label: "Viaturas totais",
    description: "Viaturas registadas no catalogo.",
    path: "/admin/viaturas",
  },
  {
    key: "tradeIns",
    label: "Retomas por ver",
    description: "Pedidos de retoma ainda sem decisao.",
    path: "/admin/retomas",
  },
  {
    key: "finance",
    label: "Financiamentos por ver",
    description: "Pedidos de financiamento ainda sem decisao.",
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

function countNewRecords(records) {
  return records.filter((record) => getAdminLeadStatus(record.status) === "new")
    .length;
}

function countNewTradeIns(tradeIns) {
  return tradeIns.filter(
    (tradeIn) =>
      getAdminLeadStatus(tradeIn.status) === "new" && !tradeIn.is_viewed,
  ).length;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    vehicles: 0,
    tradeIns: 0,
    finance: 0,
    testDrives: 0,
    contacts: 0,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        const [
          vehicles,
          tradeIns,
          financeRequests,
          testDrives,
          contactMessages,
        ] = await Promise.all([
          fetchAdminVehicles(),
          fetchAdminTradeIns(),
          fetchAdminFinanceRequests(),
          fetchAdminTestDrives(),
          fetchAdminContactMessages(),
        ]);

        if (isMounted) {
          setSummary({
            vehicles: vehicles.length,
            tradeIns: countNewTradeIns(tradeIns),
            finance: countNewRecords(financeRequests),
            testDrives: countNewRecords(testDrives),
            contacts: countNewRecords(contactMessages),
          });
        }
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        if (handleAdminSessionError(loadError, navigate)) {
          return;
        }

        setError(loadError.message ?? "Nao foi possivel carregar o resumo.");
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
            Visao geral dos dados principais e dos pedidos que precisam de
            atencao.
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
