'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface Props {
  categories: string[];
  activeCategory?: string;
  showSold: boolean;
}

export default function CatalogFilters({ categories, activeCategory, showSold }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/katalog?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update('kategorie', null)}
          className={`px-4 py-1.5 text-sm font-medium border transition-colors capitalize tracking-wide ${
            !activeCategory
              ? 'bg-brown-900 text-cream border-brown-900'
              : 'border-brown-300 text-brown-700 hover:border-brown-900'
          }`}
        >
          Vše
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => update('kategorie', cat === activeCategory ? null : cat)}
            className={`px-4 py-1.5 text-sm font-medium border transition-colors capitalize tracking-wide ${
              activeCategory === cat
                ? 'bg-brown-900 text-cream border-brown-900'
                : 'border-brown-300 text-brown-700 hover:border-brown-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sold toggle */}
      <div className="sm:ml-auto">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-brown-700 select-none">
          <input
            type="checkbox"
            checked={showSold}
            onChange={(e) => update('dostupnost', e.target.checked ? 'vse' : null)}
            className="accent-gold w-4 h-4"
          />
          Zobrazit prodané
        </label>
      </div>
    </div>
  );
}
