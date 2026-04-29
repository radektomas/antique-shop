import type { Product } from './types';

export function getDisplayPrice(product: Pick<Product, 'price' | 'sale_price' | 'is_sale'>) {
  const isOnSale =
    !!product.is_sale &&
    product.sale_price != null &&
    product.sale_price < product.price;

  return {
    isOnSale,
    current: isOnSale ? product.sale_price! : product.price,
    original: isOnSale ? product.price : null,
    discountPercent: isOnSale
      ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
      : 0,
  };
}

export function formatCZK(amount: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount);
}
