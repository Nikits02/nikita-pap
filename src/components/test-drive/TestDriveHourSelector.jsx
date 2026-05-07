import { FormError, FormField } from "../form/FormField";
import { TEST_DRIVE_HOURS } from "../../data/testDrive";

function TestDriveHourSelector({
  fieldClassName,
  label = "Hora Preferida *",
  value,
  onChange,
  buttonClassName,
  disabledHours = [],
  error,
  errorClassName,
}) {
  const disabledHoursSet = new Set(disabledHours);

  return (
    <FormField className={fieldClassName} as="div" label={label}>
      <div className="test-drive-hours">
        {TEST_DRIVE_HOURS.map((hour) => {
          const isDisabled = disabledHoursSet.has(hour);

          return (
            <button
              key={hour}
              className={`${buttonClassName}${value === hour ? " is-active" : ""}${isDisabled ? " is-disabled" : ""}`}
              type="button"
              onClick={() => onChange(hour)}
              disabled={isDisabled}
              aria-label={isDisabled ? `${hour} indisponível` : hour}
              title={isDisabled ? "Indisponível" : undefined}
            >
              <span>{hour}</span>
              {isDisabled ? <small>Indisponível</small> : null}
            </button>
          );
        })}
      </div>

      <FormError className={errorClassName} message={error} />
    </FormField>
  );
}

export default TestDriveHourSelector;
