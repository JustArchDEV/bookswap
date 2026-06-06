import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { bookFiltersSchema } from '@/lib/validators/book.schema';
import { bookService } from '@/services/bookService';
import { BookList } from '@/components/books/BookList';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardBooksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const params = await searchParams;
  const asValue = (value: string | string[] | undefined) => (typeof value === 'string' && value.trim() !== '' ? value : undefined);
  const filters = bookFiltersSchema.parse({
    title: asValue(params.title),
    author: asValue(params.author),
    genreId: asValue(params.genreId),
    language: asValue(params.language),
    condition: asValue(params.condition),
    status: asValue(params.status),
    sortBy: asValue(params.sortBy) ?? 'newest',
    page: asValue(params.page) ?? 1,
    limit: asValue(params.limit) ?? 12,
  });

  const [booksResult, genres] = await Promise.all([
    bookService.getUserBooks(session.user.id, filters),
    prisma.genre.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <>
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.4)), url('https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80')" }}
      >
        <div className="relative px-4 py-20 text-center text-white sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg sm:text-5xl">Мої книги</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">Керуйте власними книгами для обміну</p>
          <Link href="/dashboard/books/create" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700">
            + Додати книгу
          </Link>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BookList books={booksResult.books} filters={filters} page={booksResult.page} pages={booksResult.pages} total={booksResult.total} genres={genres} showCreateButton currentUserId={session.user.id} />
      </main>
    </>
  );
}

