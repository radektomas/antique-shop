export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sold: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image: string | null;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  payment_method: 'dobírka' | 'bankovní převod';
  total_price: number;
  status: string;
  created_at: string;
}

export const CATEGORIES = [
  'nábytek',
  'keramika',
  'obrazy',
  'hodiny',
  'ostatní',
] as const;

export type Category = (typeof CATEGORIES)[number];
