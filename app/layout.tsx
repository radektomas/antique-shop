import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Orientální dekorace | Výběrový antikvariát',
  description:
    'Výběrový antikvariát s jedinečnými kusy nábytku, keramiky, obrazů a dalšího.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-cream font-sans text-brown-900 antialiased">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="border-t border-brown-200 bg-brown-900 text-brown-200 py-10 mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <p className="font-serif text-lg text-cream">Orientální dekorace</p>
              <p className="text-brown-300">
                &copy; {new Date().getFullYear()} Výběrový antikvariát. Všechna práva
                vyhrazena.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
