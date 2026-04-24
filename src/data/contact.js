export const contactSubjectOptions = [
  { value: "Pedido de Informação", label: "Pedido de Informação" },
  { value: "Pedido de Test Drive", label: "Pedido de Test Drive" },
  { value: "Financiamento", label: "Financiamento" },
  { value: "Retoma", label: "Retoma" },
];

export const initialContactForm = {
  nome: "",
  email: "",
  telefone: "",
  assunto: "",
  mensagem: "",
  dataPreferida: "",
  horaPreferida: "",
};

export const contactInfoItems = [
  {
    title: "Morada",
    icon: "location",
    lines: ["Escola da APEL", "Funchal, Madeira"],
  },
  {
    title: "Telefone",
    icon: "phone",
    lines: ["+351 912 345 678", "+351 291 123 456"],
  },
  {
    title: "Email",
    icon: "mail",
    lines: ["geral@nikitamotors.pt", "vendas@nikitamotors.pt"],
  },
  {
    title: "Horario",
    icon: "clock",
    lines: [
      "Segunda a Sexta: 9h00 - 19h00",
      "Sabado: 9h00 - 13h00",
      "Domingo: Fechado",
    ],
  },
];
