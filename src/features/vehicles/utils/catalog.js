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
  const filterFields = ["marca", "modelo", "combustivel", "caixa"];
  const filtered = vehicles.filter((vehicle) => {
    return filterFields.every((field) => {
      return !filters[field] || vehicle[field] === filters[field];
    });
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
