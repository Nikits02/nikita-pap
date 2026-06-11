import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleAdminSessionError } from "../utils/admin";

function getErrorMessage(error, fallbackMessage) {
  return error.message ?? fallbackMessage;
}

export function useAdminCollection({ loadRecords, loadErrorMessage }) {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminRecords() {
      try {
        setIsLoading(true);
        const loadedRecords = await loadRecords();

        if (isMounted) {
          setRecords(loadedRecords);
        }
      } catch (loadError) {
        if (!isMounted || handleAdminSessionError(loadError, navigate)) {
          return;
        }

        setError(getErrorMessage(loadError, loadErrorMessage));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminRecords();

    return () => {
      isMounted = false;
    };
  }, [loadErrorMessage, loadRecords, navigate]);

  async function updateRecord(record, { request, payload, errorMessage, onSuccess }) {
    try {
      setUpdatingId(record.id);
      setError("");
      setNotice("");

      const nextPayload =
        typeof payload === "function" ? payload(record) : payload;
      const updatedRecord = await request(record.id, nextPayload);

      setRecords((currentRecords) =>
        currentRecords.map((currentRecord) =>
          currentRecord.id === record.id ? updatedRecord : currentRecord,
        ),
      );
      onSuccess?.(updatedRecord, setNotice);

      return updatedRecord;
    } catch (updateError) {
      if (handleAdminSessionError(updateError, navigate)) {
        return null;
      }

      setError(getErrorMessage(updateError, errorMessage));
      return null;
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteRecord(record, { request, getLabel, errorMessage }) {
    const recordLabel = getLabel?.(record) ?? `registo #${record.id}`;
    const shouldDelete = window.confirm(
      `Tem a certeza que pretende eliminar ${recordLabel}?`,
    );

    if (!shouldDelete) {
      return false;
    }

    try {
      setDeletingId(record.id);
      setError("");
      await request(record.id);
      setRecords((currentRecords) =>
        currentRecords.filter(({ id }) => id !== record.id),
      );
      return true;
    } catch (deleteError) {
      if (handleAdminSessionError(deleteError, navigate)) {
        return false;
      }

      setError(getErrorMessage(deleteError, errorMessage));
      return false;
    } finally {
      setDeletingId(null);
    }
  }

  return {
    records,
    setRecords,
    error,
    setError,
    notice,
    setNotice,
    isLoading,
    deletingId,
    updatingId,
    updateRecord,
    deleteRecord,
  };
}
