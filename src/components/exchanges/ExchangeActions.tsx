'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ExchangeActions({ exchangeId, actions }: { exchangeId: string; actions: Array<'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED'> }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function runAction(status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED') {
    setBusy(status);
    try {
      const response = await fetch(`/api/exchanges/${exchangeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? 'Помилка зміни статусу');
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {actions.includes('ACCEPTED') && <button onClick={() => runAction('ACCEPTED')} disabled={busy !== null} className="rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white">{busy === 'ACCEPTED' ? '...' : 'Прийняти'}</button>}
      {actions.includes('REJECTED') && <button onClick={() => runAction('REJECTED')} disabled={busy !== null} className="rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white">{busy === 'REJECTED' ? '...' : 'Відхилити'}</button>}
      {actions.includes('CANCELLED') && <button onClick={() => runAction('CANCELLED')} disabled={busy !== null} className="rounded-xl bg-slate-900 px-6 py-3 text-base font-semibold text-white">{busy === 'CANCELLED' ? '...' : 'Скасувати'}</button>}
      {actions.includes('COMPLETED') && <button onClick={() => runAction('COMPLETED')} disabled={busy !== null} className="rounded-xl bg-violet-600 px-6 py-3 text-base font-semibold text-white">{busy === 'COMPLETED' ? '...' : 'Завершити'}</button>}
    </div>
  );
}
