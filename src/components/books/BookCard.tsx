'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Prisma } from '@prisma/client';
import { BOOK_CONDITION_COLORS, BOOK_CONDITION_LABELS, BOOK_STATUS_COLORS, BOOK_STATUS_LABELS } from '@/constants/books';

type BookCardBook = Prisma.BookGetPayload<{
  include: {
    owner: true;
    genre: true;
    images: true;
  };
}>;

export function BookCard({ book, currentUserId }: { book: BookCardBook; currentUserId?: string }) {
  const coverImage = book.images.find((image) => image.isCover) ?? book.images[0];
  const isCurrentUserBook = currentUserId && book.ownerId === currentUserId;

  return (
    <Link href={`/books/${book.id}`} className="group block">
      <article className="w-full h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="relative h-48 bg-slate-100 overflow-hidden">
          {isCurrentUserBook && (
            <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Моя книга
            </div>
          )}
          {coverImage ? (
            <div className="relative h-full w-full">
              <Image src={coverImage.url} alt={book.title} fill className="object-cover transition duration-300 group-hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 25vw" />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">Немає фото</div>
          )}
        </div>
        <div className="space-y-2 p-3">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{book.title}</h3>
            <p className="line-clamp-1 text-sm text-slate-600">{book.author}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`rounded-full px-2.5 py-1 ${BOOK_STATUS_COLORS[book.status]}`}>{BOOK_STATUS_LABELS[book.status]}</span>
            <span className={`rounded-full px-2.5 py-1 ${BOOK_CONDITION_COLORS[book.condition]}`}>{BOOK_CONDITION_LABELS[book.condition]}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{book.genre.name}</span>
            <span
  className="text-slate-500 hover:underline text-xs cursor-pointer"
  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/users/${book.owner.id}`; }}
>
  {book.owner.name}
</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
