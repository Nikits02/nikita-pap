function PageHero({
  title,
  description,
  kicker,
  className = "",
  baseClassName = "contact-hero",
  kickerClassName = "",
}) {
  const sectionClassName = [baseClassName, className].filter(Boolean).join(" ");
  const resolvedKickerClassName = kickerClassName || undefined;

  return (
    <section className={sectionClassName}>
      {kicker ? <p className={resolvedKickerClassName}>{kicker}</p> : null}
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </section>
  );
}

export default PageHero;
