import { useEffect, useState } from "react";
import { fetchVehicles } from "../services/api";
import { mapVehiclesWithMeta } from "../utils/vehicleMeta";

function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadVehicles() {
      try {
        setIsLoading(true);
        const data = await fetchVehicles();

        if (isCancelled) {
          return;
        }

        setVehicles(mapVehiclesWithMeta(data));
        setError("");
      } catch (loadError) {
        if (isCancelled) {
          return;
        }

        setError(loadError.message ?? "Não foi possível carregar as viaturas.");
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadVehicles();

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    vehicles,
    isLoading,
    error,
  };
}

export default useVehicles;
