import { useCallback, useState } from "react";

function useSubmitState(defaultErrorMessage) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const runSubmit = useCallback(
    async (asyncCallback) => {
      try {
        setIsSubmitting(true);
        return await asyncCallback();
      } catch (submitError) {
        setError(submitError.message ?? defaultErrorMessage);
        return undefined;
      } finally {
        setIsSubmitting(false);
      }
    },
    [defaultErrorMessage],
  );

  return {
    error,
    setError,
    isSubmitting,
    clearError,
    runSubmit,
  };
}

export default useSubmitState;
