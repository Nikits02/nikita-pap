const primaryNavigationLinks = [
  { label: "Home", href: "/" },
  { label: "Sobre Nos", to: "/sobre" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Financiamento", to: "/financiamento", requiresAuth: true },
  { label: "Retoma", to: "/retoma", requiresAuth: true },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

export function getVisibleNavigationLinks(isAuthenticated) {
  return primaryNavigationLinks.filter(
    (link) => isAuthenticated || !link.requiresAuth,
  );
}

export function getFooterQuickLinks(isAuthenticated) {
  return getVisibleNavigationLinks(isAuthenticated).filter(
    (link) => link.label !== "Home",
  );
}
