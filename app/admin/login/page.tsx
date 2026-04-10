'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Nesprávné heslo');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-brown-900">Administrace</h1>
          <div className="mt-3 mx-auto w-12 h-px bg-gold" />
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brown-700">Heslo</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-brown-200 rounded px-4 py-2.5 text-brown-900 focus:outline-none focus:border-gold transition-colors bg-cream text-sm"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brown-900 hover:bg-charcoal disabled:opacity-60 text-cream font-medium tracking-widest text-sm px-6 py-3.5 transition-colors"
          >
            {loading ? 'Přihlašuji...' : 'PŘIHLÁSIT'}
          </button>
        </form>
      </div>
    </div>
  );
}
