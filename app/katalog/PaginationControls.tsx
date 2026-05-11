'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Props {
  currentPage: number;
  totalPages: number;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [1];

  if (current <= 4) {
    pages.push(2, 3, 4, 5, 'ellipsis', total);
  } else if (current >= total - 3) {
    pages.push('ellipsis', total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push('ellipsis', current - 1, current, current + 1, 'ellipsis', total);
  }

  return pages;
}

export default function PaginationControls({ currentPage, totalPages }: Props) {
  const searchParams = useSearchParams();

  function buildHref(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const qs = params.toString();
    return qs ? `/katalog?${qs}` : '/katalog';
  }

  function handleScroll() {
    const grid = document.getElementById('product-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const pages = getPageNumbers(currentPage, totalPages);

  const btnBase = 'px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap';
  const btnActive = 'bg-gold border-gold text-white';
  const btnInactive = 'border-brown-600 text-brown-300 hover:border-gold hover:text-gold';
  const btnDisabled = 'border-brown-700 text-brown-500 opacity-50 cursor-not-allowed';

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav className="mt-10 flex justify-center" aria-label="Stránkování">
      {/* Mobile */}
      <div className="flex sm:hidden items-center gap-3">
        {prevDisabled ? (
          <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
            « Předchozí
          </span>
        ) : (
          <Link
            href={buildHref(currentPage - 1)}
            scroll={false}
            onClick={handleScroll}
            className={`${btnBase} ${btnInactive}`}
          >
            « Předchozí
          </Link>
        )}
        <span className="text-sm text-brown-200 whitespace-nowrap">
          {currentPage} / {totalPages}
        </span>
        {nextDisabled ? (
          <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
            Další »
          </span>
        ) : (
          <Link
            href={buildHref(currentPage + 1)}
            scroll={false}
            onClick={handleScroll}
            className={`${btnBase} ${btnInactive}`}
          >
            Další »
          </Link>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex items-center gap-2 flex-wrap justify-center">
        {prevDisabled ? (
          <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
            « Předchozí
          </span>
        ) : (
          <Link
            href={buildHref(currentPage - 1)}
            scroll={false}
            onClick={handleScroll}
            className={`${btnBase} ${btnInactive}`}
          >
            « Předchozí
          </Link>
        )}

        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-brown-400 select-none">
              …
            </span>
          ) : p === currentPage ? (
            <span key={p} className={`${btnBase} ${btnActive}`} aria-current="page">
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={buildHref(p)}
              scroll={false}
              onClick={handleScroll}
              className={`${btnBase} ${btnInactive}`}
            >
              {p}
            </Link>
          )
        )}

        {nextDisabled ? (
          <span className={`${btnBase} ${btnDisabled}`} aria-disabled="true">
            Další »
          </span>
        ) : (
          <Link
            href={buildHref(currentPage + 1)}
            scroll={false}
            onClick={handleScroll}
            className={`${btnBase} ${btnInactive}`}
          >
            Další »
          </Link>
        )}
      </div>
    </nav>
  );
}
