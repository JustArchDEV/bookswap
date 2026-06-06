'use client';

import { useState } from 'react';
 

export default function ReviewForm({ exchangeId, targetId }: { exchangeId: string; targetId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (rating < 1 || rating > 5) {
      setError('Оберіть рейтинг від 1 до 5');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, exchangeId, rating, comment: comment || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Помилка збереження відгуку');
      } else {
        setSuccess('Дякуємо за відгук');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка збереження відгуку');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold text-slate-900">Залишити відгук</h3>
      <div className="mt-3 flex items-center gap-2">
        {[1,2,3,4,5].map((s) => (
          <button key={s} type="button" onClick={() => setRating(s)} className={`text-yellow-500 ${s <= rating ? 'text-yellow-500' : 'text-slate-300'} text-2xl`} aria-label={`${s} star`}>
            {s <= rating ? '★' : '☆'}
          </button>
        ))}
        <div className="ml-2 text-sm text-slate-600">{rating} / 5</div>
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Коментар (необов'язково)" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
      <div className="mt-3">
        <button disabled={busy || !!success} onClick={submit} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          {busy ? 'Відправка...' : 'Відправити відгук'}
        </button>
      </div>
    </div>
  );
}
