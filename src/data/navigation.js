export const primaryNavigationLinks = [
  { label: "Home", href: "/" },
  { label: "Sobre Nos", to: "/sobre" },
  { label: "Catalogo", to: "/catalogo" },
  { label: "Financiamento", to: "/financiamento" },
  { label: "Retoma", to: "/retoma" },
  { label: "Blog", to: "/blog" },
  { label: "Contacto", to: "/contacto" },
];

export const footerQuickLinks = primaryNavigationLinks.filter(
  (link) => link.label !== "Home",
);
