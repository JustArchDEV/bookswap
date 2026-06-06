'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type SupportMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export function SupportAdminTable({ messages: initialMessages }: { messages: SupportMessageRow[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMessage = selectedId ? messages.find((item) => item.id === selectedId) : null;

  async function markRead(id: string) {
    try {
      const response = await fetch(`/api/admin/support/${id}/read`, { method: 'PATCH' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Не вдалося позначити прочитаним');
      }
      setMessages((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Помилка оновлення статусу');
    }
  }

  async function removeMessage(id: string) {
    if (!confirm('Видалити це повідомлення?')) return;
    try {
      const response = await fetch(`/api/admin/support/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Не вдалося видалити повідомлення');
      }
      setMessages((current) => current.filter((item) => item.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Помилка видалення повідомлення');
    }
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Ім&apos;я</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Тема</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Дата</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Статус</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {messages.map((message) => (
              <tr key={message.id} className={message.isRead ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-6 py-4 text-sm text-slate-900">{message.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{message.email}</td>
                <td className="px-6 py-4 text-sm text-slate-900">{message.subject}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{new Date(message.createdAt).toLocaleString('uk-UA')}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{message.isRead ? 'Прочитано' : 'Непрочитано'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => setSelectedId(message.id)}>
                      Переглянути
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => markRead(message.id)}>
                      Позначити прочитаним
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => removeMessage(message.id)}>
                      Видалити
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedMessage && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">{selectedMessage.subject}</h2>
              <p className="mt-2 text-sm text-slate-500">{selectedMessage.name} · {selectedMessage.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedId(null)}>
              Закрити
            </Button>
          </div>
          <div className="mt-6 whitespace-pre-line text-slate-700">{selectedMessage.message}</div>
        </div>
      )}
    </div>
  );
}
