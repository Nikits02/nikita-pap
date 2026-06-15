const CURRENT_YEAR = new Date().getFullYear();
const VEHICLE_FUEL_OPTIONS = [
  { value: "Elétrico", label: "Elétrico" },
  { value: "Gasoleo", label: "Gasóleo" },
  { value: "Gasolina", label: "Gasolina" },
  { value: "Hibrido plug-in", label: "Híbrido plug-in" },
];
const VEHICLE_GEARBOX_OPTIONS = [
  { value: "Automática", label: "Automática" },
  { value: "Manual", label: "Manual" },
];

export const adminVehicleFields = [
  {
    name: "source",
    label: "Origem *",
    control: "select",
    hint: "Catálogo aparece no catálogo e nas Últimas Viaturas Inseridas. Destaque aparece nos Destaques da Semana e também nas Últimas Viaturas Inseridas.",
    options: [
      { value: "catalog", label: "Catálogo" },
      { value: "highlight", label: "Destaques da Semana" },
    ],
  },
  {
    name: "marca",
    label: "Marca *",
    type: "text",
    placeholder: "Ex.: Tesla",
    required: true,
  },
  {
    name: "modelo",
    label: "Modelo *",
    type: "text",
    placeholder: "Ex.: Model S",
    required: true,
  },
  {
    name: "tipo",
    label: "Tipo",
    type: "text",
    placeholder: "Ex.: Berlina, SUV, Coupe",
  },
  {
    name: "versao",
    label: "Versao",
    type: "text",
    placeholder: "Ex.: Plaid",
  },
  {
    name: "preco",
    label: "Preço *",
    type: "number",
    min: "0",
    step: "0.01",
    placeholder: "Ex.: 109900",
    hint: "Introduz apenas o numero, sem EUR.",
    required: true,
  },
  {
    name: "ano",
    label: "Ano *",
    type: "number",
    min: "1900",
    max: String(CURRENT_YEAR),
    placeholder: "Ex.: 2023",
    hint: `O ano nao pode ser superior a ${CURRENT_YEAR}.`,
    required: true,
  },
  {
    name: "potencia",
    label: "Potencia",
    type: "text",
    placeholder: "Ex.: 1020 cv",
  },
  {
    name: "quilometragem",
    label: "Quilometragem *",
    type: "text",
    placeholder: "Ex.: 12 000 km",
    required: true,
  },
  {
    name: "combustivel",
    label: "Combustivel *",
    control: "select",
    placeholder: "Selecionar combustível",
    options: VEHICLE_FUEL_OPTIONS,
    required: true,
  },
  {
    name: "caixa",
    label: "Caixa *",
    control: "select",
    placeholder: "Selecionar caixa",
    options: VEHICLE_GEARBOX_OPTIONS,
    required: true,
  },
  {
    name: "inserted_at",
    label: "Data de insercao *",
    type: "date",
    hint: "Define a ordem de aparição nas Últimas Viaturas Inseridas. Numa nova viatura, por defeito fica a data de hoje.",
    required: true,
  },
  {
    name: "imagem",
    label: "Imagem *",
    type: "text",
    placeholder: "/uploads/vehicles/tesla-model-s.jpg",
    hint: "Podes carregar um ficheiro acima ou usar manualmente um caminho existente no projeto ou uma URL valida.",
    required: true,
  },
];
