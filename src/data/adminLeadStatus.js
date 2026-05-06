export const ADMIN_LEAD_STATUS_OPTIONS = [
  { value: "new", label: "Por ver" },
  { value: "in_contact", label: "Em contacto" },
  { value: "scheduled", label: "Agendado" },
  { value: "completed", label: "Concluido" },
  { value: "cancelled", label: "Cancelado" },
];

export const ADMIN_LEAD_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Todos" },
  ...ADMIN_LEAD_STATUS_OPTIONS,
];

export function getAdminLeadStatusLabel(status) {
  return (
    ADMIN_LEAD_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    "Por ver"
  );
}
