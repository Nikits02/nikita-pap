export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin";
const ADMIN_VEHICLES_PATH = "/admin/viaturas";
export const ADMIN_NEW_VEHICLE_PATH = "/admin/viaturas/nova";
const ADMIN_TRADE_INS_PATH = "/admin/retomas";
const ADMIN_USERS_PATH = "/admin/utilizadores";
const ADMIN_CONTACT_MESSAGES_PATH = "/admin/contactos";
const ADMIN_FINANCE_REQUESTS_PATH = "/admin/financiamentos";
const ADMIN_TEST_DRIVES_PATH = "/admin/test-drives";

export const ADMIN_SECTIONS = [
  { key: "dashboard", label: "Resumo", path: ADMIN_HOME_PATH },
  { key: "vehicles", label: "Viaturas", path: ADMIN_VEHICLES_PATH },
  { key: "tradeIns", label: "Retomas", path: ADMIN_TRADE_INS_PATH },
  { key: "users", label: "Utilizadores", path: ADMIN_USERS_PATH },
  {
    key: "contacts",
    label: "Contactos",
    path: ADMIN_CONTACT_MESSAGES_PATH,
  },
  {
    key: "finance",
    label: "Financiamentos",
    path: ADMIN_FINANCE_REQUESTS_PATH,
  },
  {
    key: "testDrives",
    label: "Test Drives",
    path: ADMIN_TEST_DRIVES_PATH,
  },
];
