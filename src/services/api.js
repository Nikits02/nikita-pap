export async function fetchVehicles() {
  const response = await fetch("/api/vehicles");

  if (!response.ok) {
    throw new Error("Erro ao carregar viaturas.");
  }

  return response.json();
}

export async function createTestDrive(payload) {
  const response = await fetch("/api/test-drives", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message ?? "Erro ao guardar teste drive.");
  }

  return response.json();
}
