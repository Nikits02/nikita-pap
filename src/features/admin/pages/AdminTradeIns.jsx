import { useMemo, useState } from "react";
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
  deleteAdminTradeIn,
  fetchAdminTradeIns,
  updateAdminTradeInStatus,
} from "../services/adminApi";
import {
  formatAdminDateTime,
  getAdminLeadStatus,
  getAdminNotificationNotice,
  matchesAdminSearch,
} from "../utils/admin";

function getTradeInTitle(tradeIn) {
  return [tradeIn.marca, tradeIn.modelo].filter(Boolean).join(" ").trim();
}

function getTradeInMetaItems(tradeIn) {
  return [
    ["Ano", tradeIn.ano ?? "-"],
    ["Quilometros", tradeIn.quilometragem ?? "-"],
    ["Estado Geral", tradeIn.estado_geral ?? "-"],
    ["Nome", tradeIn.nome ?? "-"],
    ["Telefone", tradeIn.telefone ?? "-"],
    ["Email", tradeIn.email ?? "-"],
  ];
}

function AdminTradeIns() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    records: tradeIns,
    error,
    notice,
    isLoading,
    deletingId,
    updatingId,
    updateRecord,
    deleteRecord,
  } = useAdminCollection({
    loadRecords: fetchAdminTradeIns,
    loadErrorMessage: "Não foi possível carregar os pedidos de retoma.",
  });

  const filteredTradeIns = useMemo(
    () =>
      tradeIns.filter((tradeIn) => {
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
      }),
    [searchTerm, statusFilter, tradeIns],
  );

  function handleUpdateTradeIn(tradeIn, status) {
    return updateRecord(tradeIn, {
      request: updateAdminTradeInStatus,
      payload: { status },
      errorMessage: "Não foi possível atualizar o pedido de retoma.",
      onSuccess: (updatedTradeIn, setNotice) =>
        setNotice(
          getAdminNotificationNotice(updatedTradeIn, ["accepted", "rejected"]),
        ),
    });
  }

  function handleDeleteTradeIn(tradeIn) {
    return deleteRecord(tradeIn, {
      request: deleteAdminTradeIn,
      getLabel: (record) => getTradeInTitle(record) || `pedido #${record.id}`,
      errorMessage: "Não foi possível eliminar o pedido de retoma.",
    });
  }

  return (
    <AdminRecordsPage
      title="Pedidos de Retoma"
      currentSection="tradeIns"
      isLoading={isLoading}
      error={error}
      records={tradeIns}
      filteredRecords={filteredTradeIns}
      notice={notice}
      loadingText="A carregar pedidos de retoma..."
      emptyText="Ainda não existem pedidos de retoma registados."
      filteredEmptyText="Nenhum pedido corresponde aos filtros selecionados."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      searchPlaceholder="Nome, email, telefone, marca ou modelo"
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      statusOptions={ADMIN_DECISION_STATUS_FILTER_OPTIONS}
      countText={`${filteredTradeIns.length} de ${tradeIns.length} pedido${
        tradeIns.length === 1 ? "" : "s"
      } de retoma visíve${filteredTradeIns.length === 1 ? "l" : "is"}.`}
      renderRecord={(tradeIn) => {
        const tradeInStatus = getAdminLeadStatus(tradeIn.status);

        return (
          <AdminLeadCard
            key={tradeIn.id}
            eyebrow={`Pedido #${tradeIn.id}`}
            title={getTradeInTitle(tradeIn) || `Retoma ${tradeIn.id}`}
            timestamp={formatAdminDateTime(tradeIn.created_at)}
            status={{
              value: tradeInStatus,
              label: getAdminDecisionStatusLabel(tradeInStatus),
            }}
            metaItems={getTradeInMetaItems(tradeIn)}
            notes={{
              title: "Observações",
              text: tradeIn.observacoes?.trim()
                ? tradeIn.observacoes
                : "Sem observações adicionais.",
            }}
            manage={
              <AdminStatusSelect
                value={tradeInStatus}
                options={ADMIN_DECISION_STATUS_ACTION_OPTIONS}
                disabled={updatingId === tradeIn.id}
                onChange={(nextStatus) => handleUpdateTradeIn(tradeIn, nextStatus)}
              />
            }
            actions={
              <AdminDeleteButton
                disabled={deletingId === tradeIn.id}
                onClick={() => handleDeleteTradeIn(tradeIn)}
              />
            }
          />
        );
      }}
    />
  );
}

export default AdminTradeIns;
