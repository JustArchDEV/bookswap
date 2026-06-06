import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { BookForm } from '@/components/books/BookForm';
import { redirect } from 'next/navigation';

export default async function CreateBookPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } });

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-4">
        <Link href="/dashboard/books" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Мої книги
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Додати книгу</h1>
      </div>
      <BookForm mode="create" genres={genres} />
    </main>
  );
}

