export const vehicleDetailFields = [
  {
    type: "registo",
    label: "Registo",
    getValue: (vehicle) => (vehicle.ano ? String(vehicle.ano) : "Sob consulta"),
  },
  {
    type: "quilometros",
    label: "Quilometragem",
    getValue: (vehicle) => vehicle.quilometragem ?? "Sob consulta",
  },
  {
    type: "versao",
    label: "Versao",
    getValue: (vehicle) => vehicle.versao ?? "Sob consulta",
  },
  {
    type: "potencia",
    label: "Potencia",
    getValue: (vehicle) => vehicle.potencia ?? "Sob consulta",
  },
  {
    type: "combustivel",
    label: "Combustivel",
    getValue: (vehicle) => vehicle.combustivel ?? "Sob consulta",
  },
  {
    type: "transmissao",
    label: "Transmissao",
    getValue: (vehicle) => vehicle.caixa ?? "Sob consulta",
  },
  {
    type: "tipo",
    label: "Tipo",
    getValue: (vehicle) => vehicle.tipo ?? vehicle.typeLabel ?? "Viatura",
  },
  {
    type: "garantia",
    label: "Disponibilidade",
    getValue: (vehicle) =>
      vehicle.source === "highlight" ? "Destaque em loja" : "No catalogo",
  },
];

export function buildVehicleDetailRows(vehicle) {
  return vehicleDetailFields.map((field) => ({
    type: field.type,
    label: field.label,
    value: field.getValue(vehicle),
  }));
}
