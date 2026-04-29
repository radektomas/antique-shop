'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Product, Order } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { formatCZK } from '@/lib/pricing';

type Tab = 'produkty' | 'objednavky';

const ORDER_STATUSES = ['nová', 'potvrzená', 'odeslána', 'dokončena', 'zrušena'];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('produkty');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load data
  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => {
        if (r.status === 401) { router.push('/admin/login'); throw new Error('unauth'); }
        return r.json();
      }),
      fetch('/api/admin/orders').then((r) => r.json()),
    ])
      .then(([prods, ords]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setOrders(Array.isArray(ords) ? ords : []);
      })
      .catch((e) => { if (e.message !== 'unauth') console.error(e); })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const toggleSold = async (product: Product) => {
    const updated = { ...product, sold: !product.sold };
    await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sold: !product.sold }),
    });
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Opravdu smazat tento produkt?')) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const onProductSaved = (product: Product, isNew: boolean) => {
    if (isNew) {
      setProducts((prev) => [product, ...prev]);
      setShowAddForm(false);
    } else {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      setEditProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-brown-500">Načítám...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-brown-900">Administrace</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-brown-500 hover:text-red-600 transition-colors"
        >
          Odhlásit
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-brown-200 mb-8">
        {(['produkty', 'objednavky'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium tracking-wide capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-gold text-brown-900'
                : 'border-transparent text-brown-500 hover:text-brown-900'
            }`}
          >
            {t === 'produkty' ? `Produkty (${products.length})` : `Objednávky (${orders.length})`}
          </button>
        ))}
      </div>

      {/* Products tab */}
      {tab === 'produkty' && (
        <div className="space-y-6">
          {/* Add product button */}
          {!showAddForm && !editProduct && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gold hover:bg-gold-dark text-white font-medium tracking-wide text-sm px-5 py-2.5 transition-colors"
            >
              + Přidat produkt
            </button>
          )}

          {/* Add/Edit form */}
          {(showAddForm || editProduct) && (
            <ProductForm
              product={editProduct}
              onSaved={onProductSaved}
              onCancel={() => { setShowAddForm(false); setEditProduct(null); }}
            />
          )}

          {/* Product table */}
          {products.length === 0 ? (
            <p className="text-brown-500 py-8 text-center">Žádné produkty</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brown-200 text-left text-brown-500 font-medium text-xs tracking-wide uppercase">
                    <th className="pb-3 pr-4 w-16">Foto</th>
                    <th className="pb-3 pr-4">Název</th>
                    <th className="pb-3 pr-4">Kategorie</th>
                    <th className="pb-3 pr-4 text-right">Cena</th>
                    <th className="pb-3 pr-4 text-center">Dostupnost</th>
                    <th className="pb-3 text-right">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-brown-100 hover:bg-brown-50">
                      <td className="py-3 pr-4">
                        <div className="relative w-12 h-10 rounded overflow-hidden bg-brown-100 flex-none">
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="48px" />
                          ) : null}
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-medium text-brown-900 max-w-[200px] truncate">
                        {p.name}
                      </td>
                      <td className="py-3 pr-4 text-brown-500 capitalize">{p.category}</td>
                      <td className="py-3 pr-4 text-right text-brown-900">
                        {p.is_sale && p.sale_price != null && p.sale_price < p.price ? (
                          <span>
                            <span className="text-brown-400 line-through mr-2">{formatCZK(p.price)}</span>
                            <span className="text-red-600 font-semibold">{formatCZK(p.sale_price)}</span>
                          </span>
                        ) : (
                          formatCZK(p.price)
                        )}
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <button
                          onClick={() => toggleSold(p)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                            p.sold
                              ? 'bg-brown-200 text-brown-700 hover:bg-brown-300'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {p.sold ? 'Prodáno' : 'Dostupné'}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => { setEditProduct(p); setShowAddForm(false); }}
                            className="text-brown-500 hover:text-gold transition-colors"
                          >
                            Upravit
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="text-brown-400 hover:text-red-600 transition-colors"
                          >
                            Smazat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders tab */}
      {tab === 'objednavky' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-brown-500 py-8 text-center">Žádné objednávky</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <p className="font-medium text-brown-900">{order.customer_name}</p>
                    <p className="text-sm text-brown-500">{order.customer_email} · {order.customer_phone}</p>
                    <p className="text-sm text-brown-500 mt-1">{order.customer_address}</p>
                    <p className="text-sm text-brown-500">Platba: {order.payment_method}</p>
                    <div className="mt-2 space-y-0.5">
                      {(order.items as Array<{ name: string; price: number }>).map((item, i) => (
                        <p key={i} className="text-sm text-brown-700">
                          {item.name} — {formatCZK(item.price)}
                        </p>
                      ))}
                    </div>
                    <p className="font-serif text-base font-semibold text-brown-900 mt-2">
                      Celkem: {formatCZK(Number(order.total_price))}
                    </p>
                    <p className="text-xs text-brown-400 mt-1">
                      {new Date(order.created_at).toLocaleString('cs-CZ')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border border-brown-200 rounded px-3 py-1.5 text-sm text-brown-900 focus:outline-none focus:border-gold bg-cream"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    nová: 'bg-blue-100 text-blue-700',
    potvrzená: 'bg-yellow-100 text-yellow-700',
    odeslána: 'bg-purple-100 text-purple-700',
    dokončena: 'bg-green-100 text-green-700',
    zrušena: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${colors[status] ?? 'bg-brown-100 text-brown-700'}`}>
      {status}
    </span>
  );
}

// ────────────────────────────────────────────────────────────
// Product form (add / edit)
// ────────────────────────────────────────────────────────────
interface ProductFormProps {
  product: Product | null;
  onSaved: (product: Product, isNew: boolean) => void;
  onCancel: () => void;
}

function ProductForm({ product, onSaved, onCancel }: ProductFormProps) {
  const isNew = !product;
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    sale_price: product?.sale_price != null ? product.sale_price.toString() : '',
    category: product?.category ?? CATEGORIES[0],
    images: product?.images ?? [] as string[],
    is_sale: product?.is_sale ?? false,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = await res.json();
        urls.push(url);
      }
    }
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const priceNum = parseFloat(form.price);
  const salePriceNum = form.sale_price === '' ? null : parseFloat(form.sale_price);
  const salePriceInvalid =
    form.is_sale &&
    (salePriceNum == null ||
      Number.isNaN(salePriceNum) ||
      Number.isNaN(priceNum) ||
      salePriceNum >= priceNum ||
      salePriceNum <= 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salePriceInvalid) {
      setError('Výprodejová cena musí být kladná a nižší než běžná cena.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      images: form.images,
      is_sale: form.is_sale,
      price: priceNum,
      sale_price: form.is_sale && salePriceNum != null ? salePriceNum : null,
    };

    const url = isNew ? '/api/products' : `/api/products/${product!.id}`;
    const method = isNew ? 'POST' : 'PUT';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? 'Chyba při ukládání');
      setSaving(false);
      return;
    }

    const saved = await res.json();
    onSaved(saved, isNew);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gold">
      <h2 className="font-serif text-xl text-brown-900 mb-5">
        {isNew ? 'Přidat produkt' : 'Upravit produkt'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Název *">
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inp}
              placeholder="Název předmětu"
            />
          </Field>
          <Field label="Cena (Kč) *">
            <input
              name="price"
              type="number"
              required
              min={0}
              value={form.price}
              onChange={handleChange}
              className={inp}
              placeholder="0"
            />
          </Field>
          <Field label="Kategorie *">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inp}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Popis">
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className={`${inp} resize-none`}
            placeholder="Popis předmětu, stáří, stav, rozměry..."
          />
        </Field>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.is_sale}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  is_sale: e.target.checked,
                  sale_price: e.target.checked ? f.sale_price : '',
                }))
              }
              className="w-4 h-4 accent-red-600"
            />
            <span className="text-sm text-brown-700">Ve výprodeji</span>
          </label>

          {form.is_sale && (
            <Field label="Výprodejová cena (Kč) *">
              <input
                name="sale_price"
                type="number"
                min={0}
                step="0.01"
                value={form.sale_price}
                onChange={handleChange}
                className={inp}
                placeholder="0"
                required
              />
              {salePriceInvalid && (
                <p className="text-xs text-red-600 mt-1">
                  Výprodejová cena musí být kladná a nižší než běžná cena ({form.price || '0'} Kč).
                </p>
              )}
            </Field>
          )}
        </div>

        {/* Image upload */}
        <Field label="Fotografie">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-20 h-16 rounded overflow-hidden group">
                  <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="text-sm text-brown-700 file:mr-4 file:py-1.5 file:px-4 file:border file:border-brown-300 file:text-sm file:font-medium file:text-brown-700 file:bg-cream hover:file:bg-brown-100 file:transition-colors file:cursor-pointer"
                disabled={uploading}
              />
              {uploading && <p className="text-xs text-brown-400 mt-1">Nahrávám...</p>}
            </div>
          </div>
        </Field>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || uploading || salePriceInvalid}
            className="bg-brown-900 hover:bg-charcoal disabled:opacity-60 text-cream font-medium tracking-wide text-sm px-6 py-2.5 transition-colors"
          >
            {saving ? 'Ukládám...' : isNew ? 'Přidat' : 'Uložit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-brown-300 text-brown-700 hover:border-brown-900 font-medium text-sm px-6 py-2.5 transition-colors"
          >
            Zrušit
          </button>
        </div>
      </form>
    </div>
  );
}

const inp =
  'w-full border border-brown-200 rounded px-4 py-2 text-brown-900 text-sm focus:outline-none focus:border-gold transition-colors bg-cream';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-brown-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
