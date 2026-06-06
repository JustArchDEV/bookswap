'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export type AdminGenre = {
  id: string;
  name: string;
  _count: { books: number };
};

export function GenreEditor({ genres: initialGenres }: { genres: AdminGenre[] }) {
  const router = useRouter();
  const [genres, setGenres] = useState(initialGenres);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [newGenreName, setNewGenreName] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  function startEdit(genreId: string, currentName: string) {
    setEditingId(genreId);
    setNameInput(currentName);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newGenreName.trim()) return;
    setAdding(true);
    setAddError('');
    const res = await fetch('/api/genres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newGenreName.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setGenres((current) => [...current, { ...data, _count: { books: 0 } }]);
      setNewGenreName('');
      router.refresh();
    } else {
      setAddError(data.error || 'Помилка при додаванні');
    }
    setAdding(false);
  }

  async function saveGenre(id: string) {
    try {
      const response = await fetch(`/api/admin/genres/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameInput.trim() }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Не вдалося зберегти жанр');
      }
      setGenres((current) => current.map((genre) => (genre.id === id ? { ...genre, name: nameInput.trim() } : genre)));
      setEditingId(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Помилка оновлення жанру');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Видалити жанр? Це може вплинути на книги цього жанру.')) return;
    const res = await fetch(`/api/admin/genres/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setGenres((current) => current.filter((g) => g.id !== id));
    } else {
      alert('Помилка при видаленні жанру');
    }
  }

  return (
    <div className="space-y-4">
      {/* Форма додавання */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-2">
        <input
          type="text"
          value={newGenreName}
          onChange={(e) => setNewGenreName(e.target.value)}
          placeholder="Назва нового жанру"
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={adding}>
          {adding ? 'Додається...' : 'Додати жанр'}
        </Button>
      </form>
      {addError && <p className="text-sm text-red-600">{addError}</p>}

      {/* Список жанрів */}
      {genres.map((genre) => (
        <div key={genre.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {editingId === genre.id ? (
              <input
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            ) : (
              <p className="text-lg font-semibold text-slate-950">{genre.name}</p>
            )}
            <p className="mt-1 text-sm text-slate-600">Книг: {genre._count.books}</p>
          </div>
          <div className="flex items-center gap-2">
            {editingId === genre.id ? (
              <>
                <Button size="sm" onClick={() => saveGenre(genre.id)}>Зберегти</Button>
                <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Скасувати</Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={() => startEdit(genre.id, genre.name)}>Редагувати</Button>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => handleDelete(genre.id)}>Видалити</Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}