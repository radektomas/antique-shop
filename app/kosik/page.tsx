'use client';

import { useCart } from '@/components/CartContext';
import { formatCZK } from '@/lib/pricing';
import Image from 'next/image';
import Link from 'next/link';

export default function KosikPage() {
  const { items, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="font-serif text-3xl text-brown-900 mb-4">
          Váš košík je prázdný
        </h1>
        <p className="text-brown-500 mb-8">
          Přidejte si předměty z našeho katalogu.
        </p>
        <Link
          href="/katalog"
          className="inline-block bg-brown-900 hover:bg-charcoal text-cream font-medium tracking-widest text-sm px-8 py-4 transition-colors"
        >
          PROCHÁZET KATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-4xl text-brown-900 mb-2">Košík</h1>
      <div className="mt-3 w-12 h-px bg-gold mb-10" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Item list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex gap-4 bg-white rounded-lg p-4 shadow-sm"
            >
              {/* Image */}
              <div className="relative w-20 h-20 flex-none rounded overflow-hidden bg-brown-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-full h-full bg-brown-100" />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/produkt/${item.product_id}`}
                    className="font-serif text-base text-brown-900 hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="font-serif text-lg font-semibold text-brown-900 mt-1">
                    {formatCZK(item.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-brown-400 hover:text-red-600 transition-colors text-sm mt-1"
                  aria-label="Odstranit"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="font-serif text-xl text-brown-900 mb-4">Shrnutí</h2>
            <div className="border-t border-brown-200 pt-4 space-y-3">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm text-brown-700">
                  <span className="truncate pr-2">{item.name}</span>
                  <span className="flex-none">{formatCZK(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-brown-200 mt-4 pt-4 flex justify-between font-serif text-lg font-semibold text-brown-900">
              <span>Celkem</span>
              <span>{formatCZK(total)}</span>
            </div>
            <p className="text-xs text-brown-400 mt-2">+ doprava dle dohody</p>
            <Link
              href="/objednavka"
              className="mt-6 block text-center bg-gold hover:bg-gold-dark text-white font-medium tracking-widest text-sm px-6 py-4 transition-colors"
            >
              OBJEDNAT
            </Link>
            <Link
              href="/katalog"
              className="mt-3 block text-center text-brown-500 hover:text-brown-900 text-sm transition-colors"
            >
              Pokračovat v nákupu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
