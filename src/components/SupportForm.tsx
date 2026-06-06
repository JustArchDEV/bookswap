'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SupportForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Загальне питання');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = 'Ім\'я має містити принаймні 2 символи.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Введіть коректний email.';
    if (!subject.trim()) nextErrors.subject = 'Оберіть тему.';
    if (message.trim().length < 20) nextErrors.message = 'Повідомлення має містити принаймні 20 символів.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setBusy(true);
    setSuccess('');
    setError('');

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Не вдалося відправити повідомлення');
      }

      setSuccess('Повідомлення надіслано. Дякуємо за звернення!');
      setName('');
      setEmail('');
      setSubject('Загальне питання');
      setMessage('');
      setErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка відправки');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-800">Ім&apos;я</span>
          <input
            type="text"
            value={name}
            onChange={(event) => { setName(event.target.value); setErrors((prev) => { const n = {...prev}; delete n.name; return n; }); }}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-800">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setErrors((prev) => { const n = {...prev}; delete n.email; return n; }); }}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
        </label>
      </div>

      <label className="block space-y-2 mt-6">
        <span className="text-sm font-medium text-slate-800">Тема</span>
        <select
          value={subject}
          onChange={(event) => { setSubject(event.target.value); setErrors((prev) => { const n = {...prev}; delete n.subject; return n; }); }}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Загальне питання</option>
          <option>Технічна проблема</option>
          <option>Скарга</option>
          <option>Пропозиція</option>
        </select>
        {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
      </label>

      <label className="block space-y-2 mt-6">
        <span className="text-sm font-medium text-slate-800">Повідомлення</span>
        <textarea
          value={message}
          onChange={(event) => { setMessage(event.target.value); setErrors((prev) => { const n = {...prev}; delete n.message; return n; }); }}
          rows={6}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.message && <p className="text-sm text-red-600">{errors.message}</p>}
      </label>

      <div className="mt-8 min-h-[3rem] space-y-3 flex flex-col">
        {success && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}
        {error && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <Button type="submit" disabled={busy} className="w-full mt-auto">
          {busy ? 'Надсилаємо...' : 'Надіслати повідомлення'}
        </Button>
      </div>
    </form>
  );
}
