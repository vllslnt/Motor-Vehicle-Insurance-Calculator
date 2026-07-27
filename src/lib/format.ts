/**
 * Formats a number as Indonesian Rupiah
 * @param value The amount to format
 * @returns Formatted string (e.g., "Rp 200.000.000")
 */
export function formatRupiah(value: number): string {
  if (isNaN(value)) return "Rp 0";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Parses a numeric string containing formatting back to a number
 * @param formatted The formatted string
 * @returns The numeric value
 */
export function parseRupiah(formatted: string): number {
  const digits = formatted.replace(/\D/g, '');
  return parseInt(digits, 10) || 0;
}
