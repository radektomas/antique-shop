'use client';

import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/types';

const PRICE_RANGES = [
  { label: 'Všechny ceny', key: null },
  { label: 'Do 500 Kč', key: 'do-500' },
  { label: '500 – 2 000 Kč', key: '500-2000' },
  { label: '2 000+ Kč', key: '2000' },
] as const;

interface Props {
  activeCategory?: string;
  activePrice?: string;
  activeSale?: boolean;
}

export default function CatalogFilters({ activeCategory, activePrice, activeSale }: Props) {
  const router = useRouter();

  function buildUrl(kategorie: string | null, cena: string | null, vyprodej: boolean) {
    const params = new URLSearchParams();
    if (kategorie) params.set('kategorie', kategorie);
    if (cena) params.set('cena', cena);
    if (vyprodej) params.set('vyprodej', '1');
    const qs = params.toString();
    return qs ? `/katalog?${qs}` : '/katalog';
  }

  const pillBase = 'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap';
  const pillActive = 'bg-gold border-gold text-white';
  const pillInactive = 'border-brown-600 text-brown-300 hover:border-gold hover:text-gold';
  const saleActive = 'bg-red-600 border-red-600 text-white';
  const saleInactive = 'border-red-600 text-red-600 hover:bg-red-50';

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => router.push(buildUrl(null, activePrice ?? null, activeSale ?? false))}
          className={`${pillBase} ${!activeCategory ? pillActive : pillInactive}`}
        >
          Vše
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              router.push(buildUrl(activeCategory === cat ? null : cat, activePrice ?? null, activeSale ?? false))
            }
            className={`${pillBase} ${activeCategory === cat ? pillActive : pillInactive}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Price + Sale filter */}
      <div className="flex flex-wrap gap-2">
        {PRICE_RANGES.map(({ label, key }) => (
          <button
            key={label}
            onClick={() =>
              router.push(buildUrl(activeCategory ?? null, (activePrice ?? null) === key ? null : key, activeSale ?? false))
            }
            className={`${pillBase} ${(activePrice ?? null) === key ? pillActive : pillInactive}`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() =>
            router.push(buildUrl(activeCategory ?? null, activePrice ?? null, !activeSale))
          }
          className={`${pillBase} ${activeSale ? saleActive : saleInactive}`}
        >
          Výprodej
        </button>
      </div>
    </div>
  );
}
