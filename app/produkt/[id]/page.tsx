import { notFound } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ImageGallery from '@/components/ImageGallery';
import AddToCartButton from './AddToCartButton';

export const dynamic = 'force-dynamic';

async function getProduct(id: string): Promise<Product | null> {
  const { data } = await getSupabase()
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return {};
  return {
    title: `${product.name} | Orientální dekorace`,
    description: product.description,
  };
}

export default async function ProduktPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <ImageGallery images={product.images} alt={product.name} />

        {/* Details */}
        <div className="flex flex-col gap-5">
          {/* Category */}
          <p className="text-sm font-medium tracking-widest text-gold uppercase">
            {product.category}
          </p>

          {/* Name */}
          <h1 className="font-serif text-3xl sm:text-4xl text-brown-900 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <p className="font-serif text-2xl font-semibold text-brown-900">
            {product.sold ? (
              <span className="text-brown-500">Prodáno</span>
            ) : (
              `${product.price.toLocaleString('cs-CZ')} Kč`
            )}
          </p>

          {/* Divider */}
          <div className="w-12 h-px bg-gold" />

          {/* Description */}
          {product.description && (
            <p className="text-brown-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Add to cart */}
          {product.sold ? (
            <div className="mt-2 px-6 py-4 bg-brown-100 text-brown-500 text-center font-medium tracking-wide">
              Tento předmět byl prodán
            </div>
          ) : (
            <AddToCartButton product={product} />
          )}

          {/* WhatsApp */}
          {process.env.NEXT_PUBLIC_OWNER_WHATSAPP && (
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_OWNER_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(`Dobrý den, mám zájem o: ${product.name}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 border border-green-600 text-green-700 hover:bg-green-50 font-medium tracking-wide text-sm px-6 py-3.5 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-green-600" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Napsat na WhatsApp
            </a>
          )}

          {/* Info */}
          <div className="mt-4 pt-4 border-t border-brown-200 text-sm text-brown-500 space-y-1">
            <p>Máte zájem o více informací nebo jiné fotografie?</p>
            <p>
              Neváhejte nás kontaktovat — rádi odpovíme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
