/**
 * Currency formatter for Bangladesh Taka (BDT)
 */
export const formatBDT = (amount: number, showSymbol = true): string => {
  const rounded = Number(amount || 0).toFixed(2);
  const parts = rounded.split('.');
  
  // Format integer part with South Asian or standard numbering
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = parts.join('.');
  
  return showSymbol ? `${formatted} BDT` : formatted;
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(2)} Lac`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k`;
  }
  return formatBDT(amount);
};
