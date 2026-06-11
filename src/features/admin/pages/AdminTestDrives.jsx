import { useMemo, useState } from "react";
import {
  AdminDeleteButton,
  AdminLeadCard,
  AdminRecordsPage,
  AdminStatusSelect,
} from "../components/AdminList";
import {
  ADMIN_LEAD_STATUS_ACTION_OPTIONS,
  ADMIN_LEAD_STATUS_FILTER_OPTIONS,
  getAdminLeadStatusLabel,
} from "../data/adminLeadStatus";
import { useAdminCollection } from "../hooks/useAdminCollection";
import {
  deleteAdminTestDrive,
  fetchAdminTestDrives,
  updateAdminTestDrive,
} from "../services/adminApi";
import {
  formatAdminDate,
  formatAdminDateTime,
  getAdminLeadStatus,
  getAdminNotificationNotice,
  matchesAdminSearch,
} from "../utils/admin";

function formatTestDriveHour(value) {
  return value ? String(value).slice(0, 5) : "-";
}

function getTestDriveTitle(testDrive) {
  return (
    testDrive.vehicle_label?.trim() ||
    testDrive.vehicle_slug ||
    `Test Drive ${testDrive.id}`
  );
}

function getTestDriveMetaItems(testDrive) {
  return [
    ["Viatura", testDrive.vehicle_label || "-"],
    ["Slug", testDrive.vehicle_slug ?? "-"],
    ["Data", formatAdminDate(testDrive.data_preferida)],
    ["Hora", formatTestDriveHour(testDrive.hora_preferida)],
    ["Nome", testDrive.nome ?? "-"],
    ["Telefone", testDrive.telefone ?? "-"],
    ["Email", testDrive.email ?? "-"],
    ["Recebido em", formatAdminDateTime(testDrive.created_at)],
  ];
}

function AdminTestDrives() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const {
    records: testDrives,
    error,
    notice,
    isLoading,
    deletingId,
    updatingId,
    updateRecord,
    deleteRecord,
  } = useAdminCollection({
    loadRecords: fetchAdminTestDrives,
    loadErrorMessage: "Não foi possível carregar os pedidos de test drive.",
  });

  const filteredTestDrives = useMemo(
    () =>
      testDrives.filter((testDrive) => {
        const testDriveStatus = getAdminLeadStatus(testDrive.status);

        if (statusFilter !== "all" && testDriveStatus !== statusFilter) {
          return false;
        }

        return matchesAdminSearch(
          [
            testDrive.vehicle_label,
            testDrive.vehicle_slug,
            testDrive.nome,
            testDrive.email,
            testDrive.telefone,
            testDrive.data_preferida,
            formatAdminDate(testDrive.data_preferida),
            testDrive.hora_preferida,
            formatTestDriveHour(testDrive.hora_preferida),
            getAdminLeadStatusLabel(testDriveStatus),
          ],
          searchTerm,
        );
      }),
    [searchTerm, statusFilter, testDrives],
  );

  function handleUpdateTestDrive(testDrive, status) {
    return updateRecord(testDrive, {
      request: updateAdminTestDrive,
      payload: { status },
      errorMessage: "Não foi possível atualizar o pedido.",
      onSuccess: (updatedTestDrive, setNotice) =>
        setNotice(
          getAdminNotificationNotice(updatedTestDrive, [
            "scheduled",
            "cancelled",
          ]),
        ),
    });
  }

  function handleDeleteTestDrive(testDrive) {
    return deleteRecord(testDrive, {
      request: deleteAdminTestDrive,
      getLabel: (record) =>
        record.vehicle_label?.trim() ||
        record.nome?.trim() ||
        `pedido #${record.id}`,
      errorMessage: "Não foi possível eliminar o pedido de test drive.",
    });
  }

  return (
    <AdminRecordsPage
      title="Pedidos de Test Drive"
      currentSection="testDrives"
      isLoading={isLoading}
      error={error}
      records={testDrives}
      filteredRecords={filteredTestDrives}
      notice={notice}
      loadingText="A carregar pedidos de test drive..."
      emptyText="Ainda não existem pedidos de test drive registados."
      filteredEmptyText="Nenhum pedido corresponde aos filtros selecionados."
      searchTerm={searchTerm}
      onSearchTermChange={setSearchTerm}
      searchPlaceholder="Viatura, nome, email, telefone, data ou hora"
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      statusOptions={ADMIN_LEAD_STATUS_FILTER_OPTIONS}
      countText={`${filteredTestDrives.length} de ${testDrives.length} pedido${
        testDrives.length === 1 ? "" : "s"
      } de test drive visíve${filteredTestDrives.length === 1 ? "l" : "is"}.`}
      renderRecord={(testDrive) => {
        const testDriveStatus = getAdminLeadStatus(testDrive.status);

        return (
          <AdminLeadCard
            key={testDrive.id}
            eyebrow={`Pedido #${testDrive.id}`}
            title={getTestDriveTitle(testDrive)}
            timestamp={formatAdminDateTime(testDrive.created_at)}
            status={{
              value: testDriveStatus,
              label: getAdminLeadStatusLabel(testDriveStatus),
            }}
            metaItems={getTestDriveMetaItems(testDrive)}
            manage={
              <AdminStatusSelect
                value={testDriveStatus}
                options={ADMIN_LEAD_STATUS_ACTION_OPTIONS}
                disabled={updatingId === testDrive.id}
                onChange={(nextStatus) =>
                  handleUpdateTestDrive(testDrive, nextStatus)
                }
              />
            }
            actions={
              <AdminDeleteButton
                disabled={deletingId === testDrive.id}
                onClick={() => handleDeleteTestDrive(testDrive)}
              />
            }
          />
        );
      }}
    />
  );
}

export default AdminTestDrives;
