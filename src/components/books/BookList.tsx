'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookCard } from './BookCard';
import { Prisma } from '@prisma/client';
import { BookFiltersDto } from '@/lib/validators/book.schema';

type BookListBook = Prisma.BookGetPayload<{
  include: {
    owner: true;
    genre: true;
    images: true;
  };
}>;

export function BookList({
  books,
  filters,
  page,
  pages,
  total,
  genres,
  showCreateButton = false,
  currentUserId,
}: {
  books: BookListBook[];
  filters: Partial<BookFiltersDto>;
  page: number;
  pages: number;
  total: number;
  genres: Array<{ id: string; name: string }>;
  showCreateButton?: boolean;
  currentUserId?: string;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const buildQuery = (nextPage: number) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    params.set('page', String(nextPage));
    return params.toString();
  };

  return (
    <div className="space-y-8">
      {/* Mobile: toggle filters button */}
      <div className="md:hidden">
        <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-left font-medium">
          {filtersOpen ? 'Сховати фільтри ▲' : 'Показати фільтри ▼'}
        </button>
      </div>

      <form method="get" className={`grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3 xl:grid-cols-6 ${filtersOpen ? '' : 'hidden md:grid'}`}>
        <input name="title" defaultValue={filters.title ?? ''} placeholder="Назва" className="rounded-xl border border-slate-300 px-3 py-2" />
        <input name="author" defaultValue={filters.author ?? ''} placeholder="Автор" className="rounded-xl border border-slate-300 px-3 py-2" />
        <select name="genreId" defaultValue={filters.genreId ?? ''} className="rounded-xl border border-slate-300 px-3 py-2">
          <option value="">Усі жанри</option>
          {genres.map((genre) => <option key={genre.id} value={genre.id}>{genre.name}</option>)}
        </select>
        <input name="language" defaultValue={filters.language ?? ''} placeholder="Мова" className="rounded-xl border border-slate-300 px-3 py-2" />
        <select name="condition" defaultValue={filters.condition ?? ''} className="rounded-xl border border-slate-300 px-3 py-2">
          <option value="">Стан</option>
          <option value="NEW">Нова</option>
          <option value="GOOD">В гарному стані</option>
          <option value="FAIR">Задовільна</option>
          <option value="POOR">Погана</option>
        </select>
        <select name="status" defaultValue={filters.status ?? ''} className="rounded-xl border border-slate-300 px-3 py-2">
          <option value="">Статус</option>
          <option value="AVAILABLE">Доступна</option>
          <option value="RESERVED">Зарезервована</option>
          <option value="EXCHANGED">Обміняна</option>
        </select>
        <select name="sortBy" defaultValue={filters.sortBy ?? 'newest'} className="rounded-xl border border-slate-300 px-3 py-2 md:col-span-2">
          <option value="newest">Новіші</option>
          <option value="oldest">Старіші</option>
          <option value="title_asc">Назва A-Z</option>
          <option value="title_desc">Назва Z-A</option>
        </select>
        <input type="hidden" name="page" value="1" />
        <div className="md:col-span-2 xl:col-span-1 flex gap-2">
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white">Пошук</button>
          <button
            type="button"
            onClick={() => { window.location.href = window.location.pathname; }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
          >
            Скинути
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Знайдено книг: {total}</p>
        {showCreateButton && (
          <Link href="/dashboard/books/create" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-semibold text-base shadow-md">Додати книгу</Link>
        )}
      </div>

      {books.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-500">Книг не знайдено</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => <BookCard key={book.id} book={book} currentUserId={currentUserId} />)}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Link href={`?${buildQuery(Math.max(1, page - 1))}`} className={`rounded-xl border px-4 py-2 text-sm ${page === 1 ? 'pointer-events-none opacity-40' : 'bg-white'}`}>Назад</Link>
          <span className="text-sm text-slate-600">Сторінка {page} / {pages}</span>
          <Link href={`?${buildQuery(Math.min(pages, page + 1))}`} className={`rounded-xl border px-4 py-2 text-sm ${page === pages ? 'pointer-events-none opacity-40' : 'bg-white'}`}>Далі</Link>
        </div>
      )}
    </div>
  );
}
