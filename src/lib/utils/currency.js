/**
 * Utilidades para formateo de monedas y conversiones
 */

export function formatUSD(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatSecondaryCurrency(amountUSD, rate, symbol = 'Bs.') {
  if (!amountUSD || isNaN(amountUSD) || !rate || isNaN(rate)) return `${symbol} 0.00`;
  const converted = Number(amountUSD) * Number(rate);
  return `${symbol} ${new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted)}`;
}
