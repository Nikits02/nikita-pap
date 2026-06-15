import { FormField } from "../../../../shared/components/form/FormField";

function getSelectOptions(field, value) {
  const options = field.options ?? [];

  if (!value || options.some((option) => option.value === value)) {
    return options;
  }

  return [
    ...options,
    {
      value,
      label: value,
    },
  ];
}

function AdminVehicleInput({ field, value, onChange }) {
  if (field.control === "select") {
    const options = getSelectOptions(field, value);

    return (
      <FormField
        className="admin-form__field"
        label={field.label}
        hint={field.hint}
        hintClassName="admin-form__hint"
      >
        <select
          value={value ?? ""}
          required={field.required}
          onChange={(event) => onChange(field.name, event.target.value)}
        >
          {field.placeholder ? (
            <option value="" disabled>
              {field.placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
    );
  }

  return (
    <FormField
      className="admin-form__field"
      label={field.label}
      hint={field.hint}
      hintClassName="admin-form__hint"
    >
      <input
        type={field.type}
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        placeholder={field.placeholder}
        onChange={(event) => onChange(field.name, event.target.value)}
        required={field.required}
      />
    </FormField>
  );
}

export default AdminVehicleInput;
