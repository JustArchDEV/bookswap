'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Book = {
  id: string;
  title: string;
  author: string;
  status: string;
  genre: { name: string };
  owner: { name: string; email: string };
};

export function AdminBooksTable({ books: initialBooks }: { books: Book[] }) {
  const [books, setBooks] = useState(initialBooks);

  async function handleDelete(id: string) {
    if (!confirm('Видалити книгу назавжди?')) return;
    const res = await fetch(`/api/admin/books/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setBooks((current) => current.filter((b) => b.id !== id));
    } else {
      alert('Помилка при видаленні');
    }
  }

  async function handleHide(id: string) {
    const res = await fetch(`/api/admin/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'EXCHANGED' }),
    });
    if (res.ok) {
      setBooks((current) =>
        current.map((b) => (b.id === id ? { ...b, status: 'EXCHANGED' } : b))
      );
    } else {
      alert('Помилка при оновленні статусу');
    }
  }

  async function handleRestore(id: string) {
    const res = await fetch(`/api/admin/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'AVAILABLE' }),
    });
    if (res.ok) {
      setBooks((current) =>
        current.map((b) => (b.id === id ? { ...b, status: 'AVAILABLE' } : b))
      );
    } else {
      alert('Помилка при відновленні');
    }
  }

  return (
    <div className="space-y-3">
      {books.map((book) => (
        <div
          key={book.id}
          className={`rounded-2xl border bg-white p-4 shadow-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${
            book.status === 'EXCHANGED' ? 'border-red-200 bg-red-50' : 'border-slate-200'
          }`}
        >
          <div>
            <p className="font-medium text-slate-950">{book.title}</p>
            <p className="text-sm text-slate-600">
              {book.author} · {book.genre.name} · {book.owner.name}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
              book.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
              book.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {book.status === 'AVAILABLE' ? 'Активна' :
               book.status === 'RESERVED' ? 'В обміні' : 'Прихована'}
            </span>
          </div>
          <div className="flex gap-2">
            {book.status !== 'EXCHANGED' ? (
              <Button
                size="sm"
                variant="outline"
                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                onClick={() => handleHide(book.id)}
              >
                Приховати
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-300 hover:bg-green-50"
                onClick={() => handleRestore(book.id)}
              >
                Відновити
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => handleDelete(book.id)}
            >
              Видалити
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}