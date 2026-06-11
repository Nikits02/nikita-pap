const sectionDividerVariants = {
  flush: "home-section-divider--flush",
  tight: "home-section-divider--tight",
};

function SectionDivider({ className = "", variant = "" }) {
  const classes = ["home-section-divider"];
  const variantClass = sectionDividerVariants[variant];

  if (variantClass) {
    classes.push(variantClass);
  }

  if (className) {
    classes.push(className);
  }

  return <div className={classes.join(" ")} aria-hidden="true" />;
}

export default SectionDivider;
