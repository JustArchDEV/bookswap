import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BookCard } from '@/components/books/BookCard';
import { StarRating } from '@/components/reviews/StarRating';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      avatar: true,
      city: true,
      bio: true,
      requestedExchanges: true,
      ownedExchanges: true,
      books: {
        where: { status: 'AVAILABLE' },
        include: { images: true, genre: true, owner: true },
        orderBy: { createdAt: 'desc' },
      },
      reviewsReceived: {
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) notFound();

  const completedCount = await prisma.exchange.count({ where: { OR: [{ requesterId: id, status: 'COMPLETED' }, { ownerId: id, status: 'COMPLETED' }] } });
  const reviews = user.reviewsReceived ?? [];
  const avgRating = reviews.length ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10 : null;

  return (
    <main className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-100">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xl text-slate-700">{user.name.split(' ').map((p) => p[0]).join('').slice(0,2).toUpperCase()}</div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{user.name}</h2>
            {user.city && (
              <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {user.city}
              </div>
            )}
            <p className="mt-2 text-sm text-slate-700">{user.bio}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
              <div>Книг: <span className="font-semibold text-slate-900">{user.books.length}</span></div>
              <div>Завершених обмінів: <span className="font-semibold text-slate-900">{completedCount}</span></div>
              <div>
                Рейтинг: {avgRating ? (<><StarRating rating={Math.round((avgRating))*1} size="sm" /> <span className="ml-1 font-semibold">{avgRating}</span></>) : <span className="text-slate-500">Немає оцінок</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Книги користувача</h3>
        {user.books.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">Немає доступних книг</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {user.books.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Відгуки</h3>
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">Поки немає відгуків</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-100 text-sm items-center justify-center flex text-slate-700">{r.author.name.split(' ').map((p)=>p[0]).join('').slice(0,2).toUpperCase()}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{r.author.name}</p>
                      <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString('uk-UA')}</p>
                    </div>
                  </div>
                  <div><StarRating rating={r.rating} /></div>
                </div>
                {r.comment && <p className="mt-3 text-sm text-slate-700">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
