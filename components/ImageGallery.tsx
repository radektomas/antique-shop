'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const goPrev = useCallback(() => setLightboxIndex(i => i === null ? null : (i - 1 + images.length) % images.length), [images.length]);
  const goNext = useCallback(() => setLightboxIndex(i => i === null ? null : (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, goPrev, goNext]);

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goNext(); else goPrev();
    }
    touchStartX.current = null;
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-brown-100 rounded-lg flex items-center justify-center text-brown-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image — fully clickable */}
        <div
          className="group relative aspect-[4/3] bg-brown-100 rounded-lg overflow-hidden cursor-zoom-in"
          onClick={() => openLightbox(active)}
          role="button"
          tabIndex={0}
          aria-label="Zobrazit fotografii"
          onKeyDown={(e) => e.key === 'Enter' && openLightbox(active)}
        >
          <Image
            src={images[active]}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Desktop hint — hidden on touch devices via hover */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 text-brown-900 text-xs font-medium px-3 py-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            🔍 Zvětšit
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`relative flex-none w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
                  i === active ? 'border-gold' : 'border-transparent hover:border-brown-300'
                }`}
              >
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.92)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            aria-label="Zavřít"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10000,
              background: 'rgba(0,0,0,0.4)',
              border: 'none',
              color: 'white',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>

          {/* Prev — hidden on mobile (swipe instead) */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Předchozí"
              style={{
                position: 'absolute',
                left: '16px',
                zIndex: 10000,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ‹
            </button>
          )}

          {/* Image — stopPropagation so clicking image itself doesn't close */}
          <img
            src={images[lightboxIndex]}
            alt={`${alt} ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              display: 'block',
              userSelect: 'none',
            }}
          />

          {/* Next — hidden on mobile (swipe instead) */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Další"
              style={{
                position: 'absolute',
                right: '16px',
                zIndex: 10000,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ›
            </button>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 10000,
              }}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  aria-label={`Fotografie ${i + 1}`}
                  style={{
                    width: i === lightboxIndex ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === lightboxIndex ? 'white' : 'rgba(255,255,255,0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'width 0.2s, background 0.2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
