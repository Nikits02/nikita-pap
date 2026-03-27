function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeVehicle(vehicle) {
  return {
    ...vehicle,
    source: vehicle.source ?? "catalog",
    preco: Number(vehicle.preco),
    insertedAt: vehicle.insertedAt ?? vehicle.inserted_at ?? null,
    novidade: Boolean(vehicle.novidade),
  };
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

function getShuffledVehicles(vehicles) {
  const shuffledVehicles = [...vehicles];

  for (let index = shuffledVehicles.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentVehicle = shuffledVehicles[index];

    shuffledVehicles[index] = shuffledVehicles[randomIndex];
    shuffledVehicles[randomIndex] = currentVehicle;
  }

  return shuffledVehicles;
}

export function withVehicleMeta(vehicle) {
  const normalizedVehicle = normalizeVehicle(vehicle);
  const sourceLabel =
    normalizedVehicle.source === "highlight"
      ? "Destaque da Semana"
      : "Catalogo";
  const typeLabel =
    normalizedVehicle.tipo ??
    (normalizedVehicle.source === "highlight"
      ? "Viatura em destaque"
      : "Viatura");
  const title = `${normalizedVehicle.marca} ${normalizedVehicle.modelo}`;
  const slug = `${normalizedVehicle.source}-${normalizedVehicle.id}-${slugify(title)}`;
  const search = new URLSearchParams({
    veiculo: slug,
  }).toString();

  return {
    ...normalizedVehicle,
    slug,
    title,
    sourceLabel,
    typeLabel,
    badgeText: normalizedVehicle.novidade
      ? "Novo"
      : normalizedVehicle.source === "highlight"
        ? "Destaque"
        : "Disponivel",
    detailPath: `/viaturas/${slug}`,
    testDrivePath: `/test-drive?${search}`,
    summary: buildSummary(normalizedVehicle, typeLabel),
    detailHighlights: buildHighlights(normalizedVehicle, typeLabel),
    specs: buildSpecs(normalizedVehicle, typeLabel),
  };
}

export function mapVehiclesWithMeta(vehicles = []) {
  return vehicles.map((vehicle) => withVehicleMeta(vehicle));
}

export function getVehicleDetailPath(vehicle, source = "catalog") {
  return withVehicleMeta({
    ...vehicle,
    source: vehicle.source ?? source,
  }).detailPath;
}

export function getVehicleBySlug(vehicles, slug) {
  return vehicles.find((vehicle) => vehicle.slug === slug) ?? null;
}

export function getRelatedVehicles(vehicles, currentVehicle, limit = 3) {
  if (!currentVehicle) {
    return [];
  }

  return getShuffledVehicles(
    vehicles.filter((vehicle) => vehicle.slug !== currentVehicle.slug),
  ).slice(0, limit);
}
