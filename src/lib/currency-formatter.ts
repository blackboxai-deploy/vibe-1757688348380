/**
 * Currency formatting utilities for US Dollars ($)
 */

export function formatUSD(amount: number): string {
  // Handle very small amounts with more precision
  if (amount < 1) {
    return `${amount.toFixed(2)}`;
  }
  
  // Handle normal amounts with standard formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatUSDCompact(amount: number): string {
  if (amount < 1000) {
    return formatUSD(amount);
  }
  
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let suffixIndex = 0;
  let value = amount;
  
  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }
  
  return `${value.toFixed(suffixIndex > 0 ? 1 : 2)}${suffixes[suffixIndex]}`;
}

// Export aliases for backward compatibility and easier migration
export const formatPHP = formatUSD;
export const formatPHPCompact = formatUSDCompact;

export function formatDigits(digits: number): string {
  return new Intl.NumberFormat('en-US').format(digits);
}

export function formatRate(rate: number, unit: string = 'min'): string {
  if (rate < 0.01) {
    return `0.00/${unit}`;
  }
  return `${rate.toFixed(2)}/${unit}`;
}

export function formatRateUSD(rate: number, unit: string = 'min'): string {
  if (rate < 0.01) {
    return `$0.00/${unit}`;
  }
  return `${rate.toFixed(2)}/${unit}`;
}