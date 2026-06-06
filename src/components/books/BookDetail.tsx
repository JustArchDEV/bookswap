import { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { BOOK_CONDITION_LABELS, BOOK_STATUS_LABELS, LANGUAGE_LABELS } from '@/constants/books';
 

type BookDetailBook = Prisma.BookGetPayload<{
  include: {
    owner: true;
    genre: true;
    images: true;
  };
}>;

export function BookDetail({ book }: { book: BookDetailBook }) {
  const cover = book.images.find((image) => image.isCover) ?? book.images[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {cover ? <div className="relative aspect-[4/3] w-full"><Image src={cover.url} alt={book.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" /></div> : <div className="aspect-[4/3] flex items-center justify-center text-slate-400">Немає фото</div>}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {book.images.map((image) => (
            <div key={image.id} className={`relative aspect-square overflow-hidden rounded-2xl ${image.isCover ? 'ring-2 ring-amber-500' : ''}`}>
              <Image src={image.url} alt={book.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
            </div>
          ))}
        </div>
      </div>
      <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{book.genre.name}</p>
            <h1 className="text-3xl font-semibold text-slate-900">{book.title}</h1>
            <p className="text-lg text-slate-600">{book.author}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1">{BOOK_STATUS_LABELS[book.status]}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{BOOK_CONDITION_LABELS[book.condition]}</span>
          </div>
        </div>
        <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{book.description}</p>
        <div className="space-y-3 text-sm text-slate-600">
          <div>
            <p className="mb-2 font-medium text-slate-900">Власник</p>
            <Link href={`/users/${book.owner.id}`} className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100">
              {book.owner.avatar ? (
                <img src={book.owner.avatar} width={32} height={32} alt={book.owner.name} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-xs font-semibold text-slate-700">
                  {book.owner.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-slate-900">{book.owner.name}</span>
            </Link>
          </div>
          <p><span className="font-medium text-slate-900">Мова:</span> {book.language ? LANGUAGE_LABELS[book.language] || book.language : 'Не вказано'}</p>
          <p><span className="font-medium text-slate-900">Рік:</span> {book.publishedYear ?? 'Не вказано'}</p>
        </div>
        
      </aside>
    </div>
  );
}
