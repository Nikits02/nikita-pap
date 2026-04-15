export function buildUniqueVehicleText(...parts) {
  return parts
    .filter(Boolean)
    .reduce((uniqueParts, part) => {
      const trimmedPart = String(part).trim();
      const normalizedPart = trimmedPart.toLowerCase();

      if (
        uniqueParts.some((existingPart) => {
          const normalizedExistingPart = existingPart.toLowerCase();

          return (
            normalizedExistingPart === normalizedPart ||
            normalizedExistingPart.includes(normalizedPart) ||
            normalizedPart.includes(normalizedExistingPart)
          );
        })
      ) {
        return uniqueParts;
      }

      return [...uniqueParts, trimmedPart];
    }, [])
    .join(" ");
}

export function getVehicleLabel(vehicle) {
  return buildUniqueVehicleText(vehicle.title, vehicle.versao);
}
