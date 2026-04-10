import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  const { data, error } = await getSupabase()
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error('[katalog] Supabase error:', error);
  return data ?? [];
}

export default async function KatalogPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#1a1410]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-4xl text-cream">Katalog</h1>
          <div className="mt-3 w-12 h-px bg-gold" />
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-brown-300">Zatím žádné produkty. Brzy přibydou nové kusy.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ alignItems: 'stretch' }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
