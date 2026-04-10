'use client';

import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface FormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  note: string;
}

export default function ObjednavkaPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    note: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(({ product_id, name, price }) => ({
            product_id,
            name,
            price,
          })),
          total_price: total,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Chyba při odesílání objednávky');
      }

      clearCart();
      router.push('/objednavka/dekujeme');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neočekávaná chyba');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-brown-900 mb-4">Košík je prázdný</h1>
        <Link href="/katalog" className="text-gold hover:text-gold-dark underline">
          Zpět do katalogu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-4xl text-brown-900 mb-2">Objednávka</h1>
      <div className="mt-3 w-12 h-px bg-gold mb-10" />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-5">
              <h2 className="font-serif text-xl text-brown-900">Kontaktní údaje</h2>

              <Field label="Jméno a příjmení *">
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={form.customer_name}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="Jan Novák"
                />
              </Field>

              <Field label="E-mail *">
                <input
                  type="email"
                  name="customer_email"
                  required
                  value={form.customer_email}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="jan@example.cz"
                />
              </Field>

              <Field label="Telefon *">
                <input
                  type="tel"
                  name="customer_phone"
                  required
                  value={form.customer_phone}
                  onChange={handleChange}
                  className={inputCls}
                  placeholder="+420 123 456 789"
                />
              </Field>

              <Field label="Poznámka (volitelné)">
                <textarea
                  name="note"
                  rows={3}
                  value={form.note}
                  onChange={handleChange}
                  className={`${inputCls} resize-none`}
                  placeholder="Případné dotazy nebo poznámky k objednávce…"
                />
              </Field>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="font-serif text-xl text-brown-900 mb-4">Souhrn</h2>
              <div className="space-y-3 border-t border-brown-200 pt-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm text-brown-700">
                    <span className="truncate pr-2">{item.name}</span>
                    <span className="flex-none">{item.price.toLocaleString('cs-CZ')} Kč</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brown-200 mt-4 pt-4 flex justify-between font-serif text-lg font-semibold text-brown-900">
                <span>Celkem</span>
                <span>{total.toLocaleString('cs-CZ')} Kč</span>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full bg-gold hover:bg-gold-dark disabled:opacity-60 text-white font-medium tracking-widest text-sm px-6 py-4 transition-colors"
              >
                {submitting ? 'Odesílám...' : 'ODESLAT OBJEDNÁVKU'}
              </button>

              <p className="mt-4 text-xs text-brown-400 leading-relaxed">
                Po odeslání vás budeme kontaktovat na zadaný telefon pro domluvení osobního předání.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  'w-full border border-brown-200 rounded px-4 py-2.5 text-brown-900 placeholder-brown-300 focus:outline-none focus:border-gold transition-colors bg-cream text-sm';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-brown-700">{label}</label>
      {children}
    </div>
  );
}
