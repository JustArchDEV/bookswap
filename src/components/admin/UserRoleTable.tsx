'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  _count: {
    books: number;
    requestedExchanges: number;
    ownedExchanges: number;
  };
};

export function UserRoleTable({ users: initialUsers }: { users: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [pending, startTransition] = useTransition();

  async function updateRole(id: string, role: 'USER' | 'ADMIN') {
    try {
      const response = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Не вдалося змінити роль');
      }

      startTransition(() => {
        setUsers((current) =>
          current.map((user) => (user.id === id ? { ...user, role } : user))
        );
      });
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Помилка оновлення ролі');
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Ім&apos;я</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Email</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Книг</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Обміни</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Роль</th>
            <th className="px-6 py-4 text-sm font-semibold text-slate-700">Дія</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 text-sm text-slate-900">{user.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{user._count.books}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{user._count.requestedExchanges + user._count.ownedExchanges}</td>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{user.role}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Button
                    variant={user.role === 'ADMIN' ? 'secondary' : 'outline'}
                    size="sm"
                    disabled={pending || user.role === 'ADMIN'}
                    onClick={() => updateRole(user.id, 'ADMIN')}
                  >
                    {user.role === 'ADMIN' ? 'ADMIN' : 'Зробити ADMIN'}
                  </Button>
                  <Button
                    variant={user.role === 'USER' ? 'secondary' : 'outline'}
                    size="sm"
                    disabled={pending || user.role === 'USER'}
                    onClick={() => updateRole(user.id, 'USER')}
                  >
                    {user.role === 'USER' ? 'USER' : 'Зробити USER'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
