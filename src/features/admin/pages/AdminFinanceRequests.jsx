import { useMemo, useState } from "react";
import { formatEuro } from "../../../utils/format";
import {
  AdminDeleteButton,
  AdminLeadCard,
  AdminRecordsPage,
  AdminStatusSelect,
} from "../components/AdminList";
import {
  ADMIN_DECISION_STATUS_ACTION_OPTIONS,
  ADMIN_DECISION_STATUS_FILTER_OPTIONS,
  getAdminDecisionStatusLabel,
} from "../data/adminLeadStatus";
import { useAdminCollection } from "../hooks/useAdminCollection";
import {
  deleteAdminFinanceRequest,
  fetchAdminFinanceRequests,
  updateAdminFinanceRequest,
} from "../services/adminApi";
import {
  formatAdminDateTime,
  getAdminLeadStatus,
  getAdminNotificationNotice,
  matchesAdminSearch,
} from "../utils/admin";

function getFinanceRequestTitle(financeRequest) {
  return (
    financeRequest.viatura?.trim() ||
    financeRequest.nome?.trim() ||
    `Financiamento ${financeRequest.id}`
  );
}

function getFinanceRequestMetaItems(financeRequest) {
  return [
    ["Nome", financeRequest.nome ?? "-"],
    ["Email", financeRequest.email ?? "-"],
    ["Telefone", financeRequest.telefone ?? "-"],
    ["Viatura", financeRequest.viatura || "-"],
    ["Preço", `${formatEuro(financeRequest.preco)} EUR`],
    ["Entrada", `${formatEuro(financeRequest.entrada)} EUR`],
    ["Prazo", `${financeRequest.meses ?? "-"} meses`],
    ["TAN", `${financeRequest.taxa ?? "-"}%`],
    ["Prestação", `${formatEuro(financeRequest.prestacao_mensal)} EUR`],
    ["Total das prestações", `${formatEuro(financeRequest.montante_total)} EUR`],
    ["TAEG", `${financeRequest.taeg ?? "-"}%`],
    ["Recebido em", formatAdminDateTime(financeRequest.created_at)],
  ];
}

function AdminFinanceRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    records: financeRequests,
    error,
    notice,
    isLoading,
    deletingId,
    updatingId,
    updateRecord,
    deleteRecord,
  } = useAdminCollection({
    loadRecords: fetchAdminFinanceRequests,
    loadErrorMessage: "Não foi possível carregar os pedidos de financiamento.",
  });

  const filteredFinanceRequests = useMemo(
    () =>
      financeRequests.filter((financeRequest) => {
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
      }),
    [financeRequests, searchTerm, statusFilter],
  );

  function handleUpdateFinanceRequest(financeRequest, status) {
    return updateRecord(financeRequest, {
      request: updateAdminFinanceRequest,
      payload: { status },
      errorMessage: "Não foi possível atualizar o pedido de financiamento.",
      onSuccess: (updatedRequest, setNotice) =>
        setNotice(
          getAdminNotificationNotice(updatedRequest, ["accepted", "rejected"]),
        ),
    });
  }

  function handleDeleteFinanceRequest(financeRequest) {
    return deleteRecord(financeRequest, {
      request: deleteAdminFinanceRequest,
      getLabel: (record) =>
        record.viatura?.trim() || record.nome?.trim() || `pedido #${record.id}`,
      errorMessage: "Não foi possível eliminar o pedido de financiamento.",
    });
  }

  return (
    <AdminRecordsPage
      title="Pedidos de Financiamento"
      currentSection="finance"
      isLoading={isLoading}
      error={error}
      records={financeRequests}
      filteredRecords={filteredFinanceRequests}
      notice={notice}
      loadingText="A carregar pedidos de financiamento..."
      emptyText="Ainda não existem pedidos de financiamento registados."
      filteredEmptyText="Nenhum pedido corresponde aos filtros selecionados."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      searchPlaceholder="Nome, email, telefone ou viatura"
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      statusOptions={ADMIN_DECISION_STATUS_FILTER_OPTIONS}
      countText={`${filteredFinanceRequests.length} de ${
        financeRequests.length
      } pedido${financeRequests.length === 1 ? "" : "s"} de financiamento visíve${
        filteredFinanceRequests.length === 1 ? "l" : "is"
      }.`}
      renderRecord={(financeRequest) => {
        const financeStatus = getAdminLeadStatus(financeRequest.status);

        return (
          <AdminLeadCard
            key={financeRequest.id}
            eyebrow={`Pedido #${financeRequest.id}`}
            title={getFinanceRequestTitle(financeRequest)}
            timestamp={formatAdminDateTime(financeRequest.created_at)}
            status={{
              value: financeStatus,
              label: getAdminDecisionStatusLabel(financeStatus),
            }}
            metaItems={getFinanceRequestMetaItems(financeRequest)}
            manage={
              <AdminStatusSelect
                value={financeStatus}
                options={ADMIN_DECISION_STATUS_ACTION_OPTIONS}
                disabled={updatingId === financeRequest.id}
                onChange={(nextStatus) =>
                  handleUpdateFinanceRequest(financeRequest, nextStatus)
                }
              />
            }
            actions={
              <AdminDeleteButton
                disabled={deletingId === financeRequest.id}
                onClick={() => handleDeleteFinanceRequest(financeRequest)}
              />
            }
          />
        );
      }}
    />
  );
}

export default AdminFinanceRequests;
