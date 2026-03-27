export function getCatalogFiltersFromSearchParams(searchParams) {
  return {
    marca: searchParams.get("marca") ?? "",
    modelo: searchParams.get("modelo") ?? "",
    combustivel: searchParams.get("combustivel") ?? "",
    caixa: searchParams.get("caixa") ?? "",
    ordem: searchParams.get("ordem") ?? "recentes",
  };
}

export function updateCatalogFilters(current, field, value) {
  if (field === "marca") {
    return {
      ...current,
      marca: value,
      modelo: "",
      combustivel: "",
      caixa: "",
    };
  }

  return {
    ...current,
    [field]: value,
  };
}

export function filterAndSortVehicles(vehicles, filters) {
  const filtered = vehicles.filter((vehicle) => {
    if (filters.marca && vehicle.marca !== filters.marca) {
      return false;
    }

    if (filters.modelo && vehicle.modelo !== filters.modelo) {
      return false;
    }

    if (filters.combustivel && vehicle.combustivel !== filters.combustivel) {
      return false;
    }

    if (filters.caixa && vehicle.caixa !== filters.caixa) {
      return false;
    }

    return true;
  });

  return filtered.sort((firstVehicle, secondVehicle) => {
    if (filters.ordem === "preco-asc") {
      return firstVehicle.preco - secondVehicle.preco;
    }

    if (filters.ordem === "preco-desc") {
      return secondVehicle.preco - firstVehicle.preco;
    }

    const firstInsertedAt = firstVehicle.insertedAt
      ? new Date(firstVehicle.insertedAt).getTime()
      : 0;
    const secondInsertedAt = secondVehicle.insertedAt
      ? new Date(secondVehicle.insertedAt).getTime()
      : 0;

    return secondInsertedAt - firstInsertedAt;
  });
}
