function SectionDivider({ className = "", variant = "" }) {
  const classes = ["home-section-divider"];

  if (variant) {
    classes.push(`home-section-divider--${variant}`);
  }

  if (className) {
    classes.push(className);
  }

  return <div className={classes.join(" ")} aria-hidden="true" />;
}

export default SectionDivider;
