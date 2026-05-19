import { createElement } from "react";

function FormError({ className, message }) {
  if (!message) {
    return null;
  }

  return <p className={className}>{message}</p>;
}

function FormField({
  as = "label",
  className,
  label,
  hint,
  hintClassName,
  error,
  errorClassName,
  children,
  ...props
}) {
  return createElement(
    as,
    { className, ...props },
    <>
      {label != null ? <span>{label}</span> : null}
      {children}
      {hint ? <small className={hintClassName}>{hint}</small> : null}
      <FormError className={errorClassName} message={error} />
    </>,
  );
}

function FormInputField({
  className,
  label,
  hint,
  hintClassName,
  error,
  errorClassName,
  inputClassName,
  inputRef,
  ...inputProps
}) {
  return (
    <FormField
      className={className}
      label={label}
      hint={hint}
      hintClassName={hintClassName}
      error={error}
      errorClassName={errorClassName}
    >
      <input className={inputClassName} ref={inputRef} {...inputProps} />
    </FormField>
  );
}

function FormTextareaField({
  className,
  label,
  hint,
  hintClassName,
  error,
  errorClassName,
  textareaClassName,
  ...textareaProps
}) {
  return (
    <FormField
      className={className}
      label={label}
      hint={hint}
      hintClassName={hintClassName}
      error={error}
      errorClassName={errorClassName}
    >
      <textarea className={textareaClassName} {...textareaProps} />
    </FormField>
  );
}

function FormSelectField({
  className,
  label,
  hint,
  hintClassName,
  error,
  errorClassName,
  selectClassName,
  children,
  ...selectProps
}) {
  return (
    <FormField
      className={className}
      label={label}
      hint={hint}
      hintClassName={hintClassName}
      error={error}
      errorClassName={errorClassName}
    >
      <select className={selectClassName} {...selectProps}>
        {children}
      </select>
    </FormField>
  );
}

export {
  FormError,
  FormField,
  FormInputField,
  FormSelectField,
  FormTextareaField,
};
