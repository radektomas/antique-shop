export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number | null;
  category: string;
  images: string[];
  sold: boolean;
  is_new?: boolean;
  is_sale?: boolean;
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
  'Buddhové & Božstva',
  'Šperky & Doplňky',
  'Nádobí & Porcelán',
  'Ostatní',
] as const;

export type Category = (typeof CATEGORIES)[number];
