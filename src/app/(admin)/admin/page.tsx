import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  startDate.setDate(startDate.getDate() - 6);

  const [users, books, pendingExchanges, usersCount, booksCount, genresCount] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true } }),
    prisma.book.findMany({ where: { createdAt: { gte: startDate } }, select: { createdAt: true } }),
    prisma.exchange.count({ where: { status: 'PENDING' } }),
    prisma.user.count(),
    prisma.book.count(),
    prisma.genre.count(),
  ]);

  const dates = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date.toISOString().slice(0, 10);
  });

  const newUsersLast7Days = dates.map((date) => ({
    date,
    count: users.filter((user) => user.createdAt.toISOString().slice(0, 10) === date).length,
  }));

  const newBooksLast7Days = dates.map((date) => ({
    date,
    count: books.filter((book) => book.createdAt.toISOString().slice(0, 10) === date).length,
  }));

  return (
    <main className="space-y-10">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Адмін-панель</p>
        <h1 className="text-4xl font-semibold text-slate-950">Огляд системи</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Всього користувачів</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{usersCount}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Всього книг</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{booksCount}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Жанрів</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{genresCount}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Запитів в очікуванні</p>
          <p className="mt-4 text-3xl font-semibold text-slate-950">{pendingExchanges}</p>
        </div>
      </div>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Нові користувачі за останні 7 днів</h2>
          <div className="mt-4 space-y-3">
            {newUsersLast7Days.map((item) => (
              <div key={item.date} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-700">{item.date}</span>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Нові книги за останні 7 днів</h2>
          <div className="mt-4 space-y-3">
            {newBooksLast7Days.map((item) => (
              <div key={item.date} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-700">{item.date}</span>
                <span className="text-sm font-semibold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

