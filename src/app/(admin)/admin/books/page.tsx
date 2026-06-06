import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { AdminBooksTable } from '@/components/admin/AdminBooksTable';

export default async function AdminBooksPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const books = await prisma.book.findMany({
    include: { owner: true, genre: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Адмін</p>
        <h1 className="text-4xl font-semibold text-slate-950">Книги</h1>
        <p className="mt-1 text-slate-500 text-sm">Модерація оголошень — приховування та видалення книг</p>
      </div>
      <AdminBooksTable books={books} />
    </main>
  );
}