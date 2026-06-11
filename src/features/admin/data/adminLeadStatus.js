const ADMIN_LEAD_STATUS_OPTIONS = [
  { value: "new", label: "Por ver" },
  { value: "scheduled", label: "Agendado" },
  { value: "cancelled", label: "Cancelado" },
];

export const ADMIN_LEAD_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Todos" },
  ...ADMIN_LEAD_STATUS_OPTIONS,
];

export const ADMIN_LEAD_STATUS_ACTION_OPTIONS = [
  { value: "scheduled", label: "Agendado" },
  { value: "cancelled", label: "Cancelado" },
];

const ADMIN_CONTACT_STATUS_OPTIONS = [
  { value: "new", label: "Por ver" },
  { value: "responded", label: "Respondido" },
];

export const ADMIN_CONTACT_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Todos" },
  ...ADMIN_CONTACT_STATUS_OPTIONS,
];

export const ADMIN_CONTACT_STATUS_ACTION_OPTIONS = [
  { value: "responded", label: "Respondido" },
];

const ADMIN_DECISION_STATUS_OPTIONS = [
  { value: "new", label: "Por ver" },
  { value: "accepted", label: "Aceite" },
  { value: "rejected", label: "Recusado" },
];

export const ADMIN_DECISION_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Todos" },
  ...ADMIN_DECISION_STATUS_OPTIONS,
];

export const ADMIN_DECISION_STATUS_ACTION_OPTIONS = [
  { value: "accepted", label: "Aceite" },
  { value: "rejected", label: "Recusado" },
];

export function getAdminLeadStatusLabel(status) {
  return (
    ADMIN_LEAD_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    "Por ver"
  );
}

export function getAdminContactStatusLabel(status) {
  return (
    ADMIN_CONTACT_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? "Por ver"
  );
}

export function getAdminDecisionStatusLabel(status) {
  return (
    ADMIN_DECISION_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? "Por ver"
  );
}
