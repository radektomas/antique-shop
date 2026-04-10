'use client';

import { useCart } from '@/components/CartContext';
import type { Product } from '@/lib/types';
import { useState } from 'react';
import Link from 'next/link';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.product_id === product.id);

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? null,
    });
    setAdded(true);
  };

  if (inCart || added) {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <p className="text-sm text-green-700 font-medium">✓ Přidáno do košíku</p>
        <Link
          href="/kosik"
          className="w-full text-center bg-gold hover:bg-gold-dark text-white font-medium tracking-widest text-sm px-6 py-4 transition-colors"
        >
          PŘEJÍT DO KOŠÍKU
        </Link>
      </div>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className="mt-2 w-full bg-brown-900 hover:bg-charcoal text-cream font-medium tracking-widest text-sm px-6 py-4 transition-colors"
    >
      PŘIDAT DO KOŠÍKU
    </button>
  );
}
