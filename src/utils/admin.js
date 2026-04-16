import { clearAuthSession } from "../services/authApi";
import { ADMIN_LOGIN_PATH } from "../data/adminNavigation";

const createdAtFormatter = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const createdDateFormatter = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatAdminValue(value, formatter) {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return formatter.format(parsedDate);
}

export function formatAdminDateTime(value) {
  return formatAdminValue(value, createdAtFormatter);
}

export function formatAdminDate(value) {
  const formattedValue = formatAdminValue(value, createdDateFormatter);

  return formattedValue === String(value) ? String(value).slice(0, 10) : formattedValue;
}

export function handleAdminSessionError(error, navigate) {
  if (error.message !== "Sessao expirada.") {
    return false;
  }

  clearAuthSession();
  navigate(ADMIN_LOGIN_PATH, { replace: true });
  return true;
}
