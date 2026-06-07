export const aud = (n: number): string =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);

export const pct = (n: number): string => `${(n * 100).toFixed(0)}%`;
