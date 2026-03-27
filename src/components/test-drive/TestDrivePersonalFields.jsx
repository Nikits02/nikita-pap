import { FormInputField } from "../form/FormField";

const personalFields = [
  { name: "nome", label: "Nome Completo *", type: "text" },
  { name: "telefone", label: "Telefone *", type: "tel" },
  { name: "email", label: "Email *", type: "email" },
];

function TestDrivePersonalFields({
  gridClassName,
  fieldClassName,
  values,
  onChange,
}) {
  return (
    <div className={gridClassName}>
      {personalFields.map((field) => (
        <FormInputField
          key={field.name}
          className={fieldClassName}
          label={field.label}
          type={field.type}
          value={values[field.name]}
          onChange={(event) => onChange(field.name, event.target.value)}
          required
        />
      ))}
    </div>
  );
}

export default TestDrivePersonalFields;
