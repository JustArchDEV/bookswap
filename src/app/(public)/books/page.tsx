import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { bookFiltersSchema } from '@/lib/validators/book.schema';
import { bookService } from '@/services/bookService';
import { BookList } from '@/components/books/BookList';

export default async function BooksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth();
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
    bookService.getBooks(filters),
    prisma.genre.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <>
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.4)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80')" }}
      >
        <div className="relative px-4 py-20 text-center text-white sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg sm:text-5xl">Каталог книг</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">Знайдіть книгу для обміну серед сотень пропозицій</p>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <BookList books={booksResult.books} filters={filters} page={booksResult.page} pages={booksResult.pages} total={booksResult.total} genres={genres} currentUserId={session?.user?.id} />
      </main>
    </>
  );
}