import { isValidElement } from "react";

function TypedIcon({ type, icons, fallback = null }) {
  const icon = icons[type] ?? fallback;

  if (!icon) {
    return null;
  }

  if (isValidElement(icon)) {
    return icon;
  }

  const Icon = icon;

  return <Icon />;
}

export default TypedIcon;
