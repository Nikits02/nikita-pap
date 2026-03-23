import { cars } from "./cars";
import { destaquesSemana } from "./destaquesSemana";

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSummary(vehicle, typeLabel) {
  const versionText = vehicle.versao ? `na versao ${vehicle.versao}` : "";
  const yearText = vehicle.ano ? ` de ${vehicle.ano}` : "";
  const mileageText = vehicle.quilometragem ? ` com ${vehicle.quilometragem}` : "";
  const fuelText = vehicle.combustivel
    ? ` e motorizacao ${vehicle.combustivel.toLowerCase()}`
    : "";

  return `${vehicle.marca} ${vehicle.modelo}${yearText}, ${typeLabel.toLowerCase()} ${versionText}${mileageText}${fuelText}. Uma opcao equilibrada para quem procura conforto, presenca e acompanhamento profissional na compra.`
    .replace(/\s+/g, " ")
    .replace(" ,", ",")
    .trim();
}

function buildHighlights(vehicle, typeLabel) {
  const items = [];

  if (vehicle.versao) {
    items.push(`Versao ${vehicle.versao}`);
  }

  if (vehicle.quilometragem) {
    items.push(`${vehicle.quilometragem} verificados`);
  }

  if (vehicle.caixa) {
    items.push(`Caixa ${vehicle.caixa.toLowerCase()}`);
  }

  if (vehicle.combustivel) {
    items.push(`Motor ${vehicle.combustivel.toLowerCase()}`);
  }

  if (vehicle.potencia) {
    items.push(`Potencia de ${vehicle.potencia}`);
  }

  items.push(`${typeLabel} pronta para entrega`);
  items.push("Possibilidade de financiamento");
  items.push("Retoma sob avaliacao");

  return items.slice(0, 6);
}

function buildSpecs(vehicle, typeLabel) {
  return [
    { label: "Marca", value: vehicle.marca },
    { label: "Modelo", value: vehicle.modelo },
    { label: "Versao", value: vehicle.versao },
    { label: "Tipo", value: vehicle.tipo ?? typeLabel },
    { label: "Ano", value: vehicle.ano ? String(vehicle.ano) : null },
    { label: "Quilometragem", value: vehicle.quilometragem },
    { label: "Combustivel", value: vehicle.combustivel },
    { label: "Caixa", value: vehicle.caixa },
    { label: "Potencia", value: vehicle.potencia ?? "Sob consulta" },
  ].filter((item) => item.value);
}

function withVehicleMeta(vehicle, source) {
  const sourceLabel = source === "highlight" ? "Destaque da Semana" : "Viatura em Stock";
  const typeLabel = vehicle.tipo ?? (source === "highlight" ? "Viatura em destaque" : "Viatura");
  const title = `${vehicle.marca} ${vehicle.modelo}`;
  const slug = `${source}-${vehicle.id}-${slugify(title)}`;
  const search = new URLSearchParams({
    veiculo: slug,
  }).toString();

  return {
    ...vehicle,
    source,
    slug,
    title,
    sourceLabel,
    typeLabel,
    badgeText: vehicle.novidade ? "Novo" : source === "highlight" ? "Destaque" : "Disponivel",
    detailPath: `/viaturas/${slug}`,
    testDrivePath: `/test-drive?${search}`,
    summary: buildSummary(vehicle, typeLabel),
    detailHighlights: buildHighlights(vehicle, typeLabel),
    specs: buildSpecs(vehicle, typeLabel),
  };
}

export const stockVehicles = cars.map((vehicle) => withVehicleMeta(vehicle, "stock"));
export const highlightVehicles = destaquesSemana.map((vehicle) =>
  withVehicleMeta(vehicle, "highlight"),
);
export const allVehicles = [...stockVehicles, ...highlightVehicles];

export function getVehicleDetailPath(vehicle, source = "stock") {
  return withVehicleMeta(vehicle, source).detailPath;
}

export function getVehicleBySlug(slug) {
  return allVehicles.find((vehicle) => vehicle.slug === slug) ?? null;
}

export function getRelatedVehicles(currentVehicle, limit = 3) {
  return allVehicles
    .filter((vehicle) => vehicle.slug !== currentVehicle.slug)
    .sort((firstVehicle, secondVehicle) => {
      if (firstVehicle.marca === currentVehicle.marca && secondVehicle.marca !== currentVehicle.marca) {
        return -1;
      }

      if (secondVehicle.marca === currentVehicle.marca && firstVehicle.marca !== currentVehicle.marca) {
        return 1;
      }

      return secondVehicle.preco - firstVehicle.preco;
    })
    .slice(0, limit);
}
