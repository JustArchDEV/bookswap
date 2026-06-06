'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ExchangeProposalForm({
  requestedBookId,
  userBooks,
}: {
  requestedBookId: string;
  userBooks: Array<{ id: string; title: string; status?: string }>;
}) {
  const router = useRouter();
  const [offeredBookId, setOfferedBookId] = useState(userBooks[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (userBooks.length === 0) return;
    if (!offeredBookId) {
      setError('Оберіть книгу для обміну');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/exchanges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestedBookId, offeredBookId, message: message || undefined }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload?.error ?? 'Помилка створення обміну');
        return;
      }
      router.push('/dashboard/exchanges');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка створення обміну');
    } finally {
      setBusy(false);
    }
  }

  const noBooks = userBooks.length === 0;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Запропонувати обмін</h3>
      {noBooks ? (
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          У вас немає доступних книг для обміну. <a href="/dashboard/books/create" className="text-amber-900 font-semibold hover:underline">Додати книгу</a>
        </div>
      ) : (
        <select value={offeredBookId} onChange={(event) => setOfferedBookId(event.target.value)} className="w-full rounded-xl border px-3 py-2">
          {userBooks.map((book) => (
            <option key={book.id} value={book.id}>{book.title}</option>
          ))}
        </select>
      )}
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Повідомлення власнику" className="min-h-28 w-full rounded-xl border px-3 py-2" />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={submit} disabled={busy || !offeredBookId || noBooks} className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50">{busy ? 'Відправка...' : 'Надіслати пропозицію'}</button>
    </div>
  );
}
