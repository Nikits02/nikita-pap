export const termOptions = [24, 36, 48, 60, 72, 84];

export const financeBenefits = [
  {
    icon: "clock",
    text: "Aprovacao rapida em 24h",
  },
  {
    icon: "graph",
    text: "Taxas competitivas",
  },
  {
    icon: "check",
    text: "Sem comissoes ocultas",
  },
  {
    icon: "shield",
    text: "Seguros integrados",
  },
];

export const financeRequestFields = [
  { name: "nome", type: "text", placeholder: "Nome", required: true },
  { name: "email", type: "email", placeholder: "Email", required: true },
  { name: "telefone", type: "tel", placeholder: "Telefone", required: true },
  {
    name: "viatura",
    type: "text",
    placeholder: "Veículo de interesse",
    required: false,
  },
];
