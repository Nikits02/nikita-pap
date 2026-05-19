import AdminVehicleInput from "./AdminVehicleInput";

function AdminVehicleFormSection({
  title,
  description,
  fields,
  fieldsByName,
  formData,
  onChange,
}) {
  return (
    <section className="admin-form-section">
      <div className="admin-form-section__heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="admin-form__grid admin-form__grid--vehicle">
        {fields.map((fieldName) => {
          const field = fieldsByName.get(fieldName);

          if (!field) {
            return null;
          }

          return (
            <AdminVehicleInput
              key={field.name}
              field={field}
              value={formData[field.name]}
              onChange={onChange}
            />
          );
        })}
      </div>
    </section>
  );
}

export default AdminVehicleFormSection;
