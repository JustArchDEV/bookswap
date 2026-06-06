import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { GenreEditor } from '@/components/admin/GenreEditor';

export default async function GenresPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const genres = await prisma.genre.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { books: true } } },
  });

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Адмін</p>
        <h1 className="text-4xl font-semibold text-slate-950">Жанри</h1>
      </div>
      <GenreEditor genres={genres} />
    </main>
  );
}

