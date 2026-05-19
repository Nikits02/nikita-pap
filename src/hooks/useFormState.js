import { useCallback, useState } from "react";

function useFormState(initialState) {
  const [formData, setFormData] = useState(initialState);

  const updateField = useCallback((field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }, []);

  return {
    formData,
    setFormData,
    updateField,
  };
}

export default useFormState;
