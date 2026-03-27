import { FormError, FormField } from "../form/FormField";
import { TEST_DRIVE_HOURS } from "../../data/testDrive";

function TestDriveHourSelector({
  fieldClassName,
  label = "Hora Preferida *",
  value,
  onChange,
  buttonClassName,
  error,
  errorClassName,
}) {
  return (
    <FormField className={fieldClassName} as="div" label={label}>
      <div className="test-drive-hours">
        {TEST_DRIVE_HOURS.map((hour) => (
          <button
            key={hour}
            className={`${buttonClassName}${value === hour ? " is-active" : ""}`}
            type="button"
            onClick={() => onChange(hour)}
          >
            {hour}
          </button>
        ))}
      </div>

      <FormError className={errorClassName} message={error} />
    </FormField>
  );
}

export default TestDriveHourSelector;
