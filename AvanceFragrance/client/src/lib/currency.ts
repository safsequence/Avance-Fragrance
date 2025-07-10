export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `৳${numPrice.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPriceWithDecimals(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `৳${numPrice.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
