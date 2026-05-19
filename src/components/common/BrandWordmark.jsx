function BrandWordmark({
  className = "home-brand-wordmark",
  firstClassName = "home-brand-wordmark__nikita",
  secondClassName = "home-brand-wordmark__motors",
  firstWord = "Nikita",
  secondWord = "Motors",
}) {
  return (
    <span className={className}>
      <span className={firstClassName}>{firstWord}</span>
      <span className={secondClassName}>{secondWord}</span>
    </span>
  );
}

export default BrandWordmark;
