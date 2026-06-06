'use client';

import { useState } from 'react';

export function MessageInput({ onSend }: { onSend: (content: string) => Promise<void> }) {
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = content.trim();
    if (!value) return;
    setBusy(true);
    try {
      await onSend(value);
      setContent('');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-3 border-t border-slate-200 p-4">
      <input value={content} onChange={(event) => setContent(event.target.value)} placeholder="Введіть повідомлення..." className="flex-1 rounded-xl border px-4 py-3" />
      <button disabled={busy || !content.trim()} className="rounded-xl bg-amber-500 px-4 py-3 font-medium text-white">Надіслати</button>
    </form>
  );
}
