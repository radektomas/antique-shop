import Link from 'next/link';

export const metadata = { title: 'Děkujeme za objednávku | Orientální dekorace' };

export default function DekujemePage() {
  const ownerPhone = process.env.OWNER_PHONE;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-28 text-center">
      <div className="text-6xl mb-6">✨</div>
      <h1 className="font-serif text-4xl text-brown-900 mb-4">
        Děkujeme za objednávku!
      </h1>
      <p className="text-brown-500 text-lg leading-relaxed mb-2">
        Vaše objednávka byla přijata. Brzy vás budeme kontaktovat
        na zadaný telefon pro domluvení osobního předání.
      </p>
      {ownerPhone && (
        <p className="text-brown-400 text-sm mb-10">
          Nebo nás můžete kontaktovat přímo:{' '}
          <a href={`tel:${ownerPhone}`} className="text-gold hover:text-gold-dark font-medium">
            {ownerPhone}
          </a>
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <Link
          href="/"
          className="inline-block border border-brown-900 text-brown-900 hover:bg-brown-900 hover:text-cream font-medium tracking-widest text-sm px-8 py-3.5 transition-colors"
        >
          ZPĚT NA ÚVOD
        </Link>
        <Link
          href="/katalog"
          className="inline-block bg-gold hover:bg-gold-dark text-white font-medium tracking-widest text-sm px-8 py-3.5 transition-colors"
        >
          PROCHÁZET KATALOG
        </Link>
      </div>
    </div>
  );
}
