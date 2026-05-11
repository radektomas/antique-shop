import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import CatalogFilters from './CatalogFilters';
import PaginationControls from './PaginationControls';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 30;

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
  searchParams: Promise<{ kategorie?: string; cena?: string; vyprodej?: string; page?: string }>;
}) {
  const { kategorie, cena, vyprodej, page } = await searchParams;
  const showOnlySale = vyprodej === '1';
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

  if (showOnlySale) {
    filtered = filtered.filter((p) => p.is_sale === true);
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const requestedPage = Number.parseInt(page ?? '1', 10);
  const currentPage = Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage;

  if (totalCount > 0 && currentPage > totalPages) {
    const params = new URLSearchParams();
    if (kategorie) params.set('kategorie', kategorie);
    if (cena) params.set('cena', cena);
    if (vyprodej) params.set('vyprodej', '1');
    if (totalPages > 1) params.set('page', String(totalPages));
    const qs = params.toString();
    redirect(qs ? `/katalog?${qs}` : '/katalog');
  }

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalCount);
  const pageItems = filtered.slice(startIdx, endIdx);

  const productLabel =
    totalCount === 1 ? 'produkt' : totalCount >= 2 && totalCount <= 4 ? 'produkty' : 'produktů';
  const countText =
    totalCount === 0
      ? `Zobrazeno 0 ${productLabel}`
      : `Zobrazeno ${startIdx + 1}–${endIdx} z ${totalCount} ${productLabel}`;

  return (
    <div className="min-h-screen bg-[#1a1410]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-cream">Katalog</h1>
          <div className="mt-3 w-12 h-px bg-gold" />
        </div>

        <CatalogFilters activeCategory={kategorie} activePrice={cena} activeSale={showOnlySale} />

        <p className="text-sm text-brown-200 mb-6">{countText}</p>

        {totalCount === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-brown-300">Žádné produkty neodpovídají zvoleným filtrům.</p>
          </div>
        ) : (
          <>
            <div
              id="product-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-6"
              style={{ alignItems: 'stretch' }}
            >
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {totalPages > 1 && (
              <Suspense fallback={null}>
                <PaginationControls currentPage={currentPage} totalPages={totalPages} />
              </Suspense>
            )}
          </>
        )}
      </div>
    </div>
  );
}
