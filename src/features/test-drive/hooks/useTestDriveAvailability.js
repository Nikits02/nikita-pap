import { useEffect, useState } from "react";
import { fetchTestDriveAvailability } from "../services/testDriveApi";

function useTestDriveAvailability(date, vehicleSlug) {
  const [bookedHours, setBookedHours] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!date || !vehicleSlug) {
      setBookedHours([]);
      setError("");
      setIsLoading(false);
      return undefined;
    }

    let isCurrent = true;

    async function loadAvailability() {
      try {
        setIsLoading(true);
        setError("");
        const availability = await fetchTestDriveAvailability(date, vehicleSlug);

        if (isCurrent) {
          setBookedHours(availability.bookedHours ?? []);
        }
      } catch (loadError) {
        if (isCurrent) {
          setBookedHours([]);
          setError(loadError.message ?? "Erro ao carregar disponibilidade.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      isCurrent = false;
    };
  }, [date, vehicleSlug]);

  return { bookedHours, error, isLoading };
}

export default useTestDriveAvailability;
