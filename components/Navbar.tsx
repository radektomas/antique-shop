'use client';

import Link from 'next/link';
import { useCart } from './CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-cream border-b border-brown-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-2xl text-brown-900 tracking-wide hover:text-gold transition-colors"
        >
          Orientální dekorace
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link
            href="/"
            className="text-brown-700 hover:text-gold transition-colors"
          >
            Domů
          </Link>
          <Link
            href="/katalog"
            className="text-brown-700 hover:text-gold transition-colors"
          >
            Katalog
          </Link>
          <Link
            href="/kosik"
            className="relative flex items-center gap-1.5 text-brown-700 hover:text-gold transition-colors"
          >
            <CartIcon />
            <span>Košík</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile: cart + hamburger */}
        <div className="flex sm:hidden items-center gap-4">
          <Link href="/kosik" className="relative text-brown-700">
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-brown-700 p-1"
            aria-label="Menu"
          >
            <HamburgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-brown-200 bg-cream">
          <nav className="flex flex-col px-6 py-4 gap-4 text-sm font-medium">
            <Link href="/" onClick={() => setOpen(false)} className="text-brown-700 hover:text-gold transition-colors">
              Domů
            </Link>
            <Link href="/katalog" onClick={() => setOpen(false)} className="text-brown-700 hover:text-gold transition-colors">
              Katalog
            </Link>
            <Link href="/kosik" onClick={() => setOpen(false)} className="text-brown-700 hover:text-gold transition-colors">
              Košík {count > 0 && `(${count})`}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
