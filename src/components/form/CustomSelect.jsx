import { ChevronIcon } from "../icons/CommonIcons";
import useDismissableLayer from "../../hooks/useDismissableLayer";

function defaultGetOptionValue(option) {
  return typeof option === "string" ? option : option.value;
}

function defaultGetOptionLabel(option) {
  return typeof option === "string" ? option : option.label;
}

function CustomSelect({
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  rootClassName,
  triggerClassName,
  menuClassName,
  optionClassName,
  getOptionValue = defaultGetOptionValue,
  getOptionLabel = defaultGetOptionLabel,
}) {
  const { isOpen, setIsOpen, rootRef } = useDismissableLayer();
  const selectedOption = options.find(
    (option) => getOptionValue(option) === value,
  );
  const displayLabel = selectedOption
    ? getOptionLabel(selectedOption)
    : placeholder;

  function buildClassName(baseClassName, modifiers = []) {
    return [baseClassName, ...modifiers.filter(Boolean)].join("");
  }

  function selectOption(nextValue) {
    onChange(nextValue);
    setIsOpen(false);
  }

  return (
    <div className={rootClassName} ref={rootRef}>
      <button
        className={buildClassName(triggerClassName, [
          isOpen ? " is-open" : "",
          !value ? " is-placeholder" : "",
        ])}
        type="button"
        onClick={() => !disabled && setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span>{displayLabel}</span>
        <ChevronIcon />
      </button>

      {isOpen && !disabled ? (
        <div className={menuClassName} role="listbox">
          {options.map((option) => {
            const optionValue = getOptionValue(option);

            return (
              <button
                className={buildClassName(optionClassName, [
                  value === optionValue ? " is-active" : "",
                ])}
                key={optionValue}
                type="button"
                onClick={() => selectOption(optionValue)}
              >
                {getOptionLabel(option)}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default CustomSelect;
