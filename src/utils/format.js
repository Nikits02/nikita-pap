const euroFormatter = new Intl.NumberFormat("pt-PT");
const roundedFormatter = new Intl.NumberFormat("pt-PT", {
  maximumFractionDigits: 0,
});

export function formatEuro(value) {
  return euroFormatter.format(value).replace(/\u00A0/g, " ");
}

export function formatRoundedNumber(value) {
  return roundedFormatter.format(Math.round(value || 0));
}
