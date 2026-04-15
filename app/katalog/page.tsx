import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import CatalogFilters from './CatalogFilters';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('[katalog] Supabase error:', error);
  return data ?? [];
}

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string; cena?: string }>;
}) {
  const { kategorie, cena } = await searchParams;
  const products = await getProducts();

  let filtered = products;

  if (kategorie) {
    filtered = filtered.filter((p) => p.category === kategorie);
  }

  if (cena === 'do-500') {
    filtered = filtered.filter((p) => p.price < 500);
  } else if (cena === '500-2000') {
    filtered = filtered.filter((p) => p.price >= 500 && p.price <= 2000);
  } else if (cena === '2000') {
    filtered = filtered.filter((p) => p.price > 2000);
  }

  return (
    <div className="min-h-screen bg-[#1a1410]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-cream">Katalog</h1>
          <div className="mt-3 w-12 h-px bg-gold" />
        </div>

        <CatalogFilters activeCategory={kategorie} activePrice={cena} />

        <p className="text-sm text-brown-200 mb-6">
          Zobrazeno {filtered.length} {filtered.length === 1 ? 'produkt' : filtered.length >= 2 && filtered.length <= 4 ? 'produkty' : 'produktů'}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-brown-300">Žádné produkty neodpovídají zvoleným filtrům.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: 'stretch' }}>
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
