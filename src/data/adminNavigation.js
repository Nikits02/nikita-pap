export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_VEHICLES_PATH = "/admin/viaturas";
export const ADMIN_NEW_VEHICLE_PATH = "/admin/viaturas/nova";
export const ADMIN_TRADE_INS_PATH = "/admin/retomas";
export const ADMIN_USERS_PATH = "/admin/utilizadores";
export const ADMIN_CONTACT_MESSAGES_PATH = "/admin/contactos";
export const ADMIN_FINANCE_REQUESTS_PATH = "/admin/financiamentos";
export const ADMIN_TEST_DRIVES_PATH = "/admin/test-drives";

export const ADMIN_SECTIONS = [
  { key: "vehicles", label: "Ver Viaturas", path: ADMIN_VEHICLES_PATH },
  { key: "tradeIns", label: "Ver Retomas", path: ADMIN_TRADE_INS_PATH },
  { key: "users", label: "Ver Utilizadores", path: ADMIN_USERS_PATH },
  {
    key: "contacts",
    label: "Ver Contactos",
    path: ADMIN_CONTACT_MESSAGES_PATH,
  },
  {
    key: "finance",
    label: "Ver Financiamentos",
    path: ADMIN_FINANCE_REQUESTS_PATH,
  },
  {
    key: "testDrives",
    label: "Ver Test Drives",
    path: ADMIN_TEST_DRIVES_PATH,
  },
];
