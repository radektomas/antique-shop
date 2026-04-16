import Link from 'next/link';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const image = product.images?.[0];

  return (
    <Link href={`/produkt/${product.id}`} className="group" style={{ display: 'flex', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
          opacity: product.sold ? 0.5 : 1,
          transition: 'box-shadow 0.3s',
        }}
        className="hover:shadow-xl"
      >
        {/* Image — fixed 300px, never shrinks or grows */}
        <div style={{ flexShrink: 0, height: '300px', overflow: 'hidden', backgroundColor: '#f5ede4', position: 'relative' }}>
          {product.is_new && !product.sold && (
            <span style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              zIndex: 10,
              backgroundColor: '#c9932a',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '4px 10px',
              borderRadius: '4px',
            }}>
              Nově přidáno
            </span>
          )}
          {product.sold && (
            <span style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 1,
              backgroundColor: '#3b2a1a',
              color: '#f5ede4',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '4px 10px',
              borderRadius: '4px',
            }}>
              Prodáno
            </span>
          )}
          {image ? (
            <img
              src={image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                transition: 'transform 0.5s',
              }}
              className="group-hover:scale-105"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a882' }}>
              <PlaceholderIcon />
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <h3 className="font-serif group-hover:text-gold-dark transition-colors" style={{ fontSize: '1rem', color: '#3b2a1a', lineHeight: '1.4', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
          <p className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 600, color: product.sold ? '#a08060' : '#3b2a1a' }}>
            {product.sold ? 'Prodáno' : `${product.price.toLocaleString('cs-CZ')} Kč`}
          </p>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '48px', height: '48px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
