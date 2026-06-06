import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { bookService } from '@/services/bookService';
import { BookForm } from '@/components/books/BookForm';
import { notFound, redirect } from 'next/navigation';

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { id } = await params;
  const book = await bookService.getBookById(id);
  if (!book || book.ownerId !== session.user.id) {
    notFound();
  }

  const genres = await prisma.genre.findMany({ orderBy: { name: 'asc' } });

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Книги</p>
        <h1 className="text-4xl font-semibold text-slate-950">Редагувати книгу</h1>
      </div>
      <BookForm
        mode="edit"
        bookId={book.id}
        genres={genres}
        defaultValues={{
          title: book.title,
          author: book.author,
          description: book.description,
          language: book.language ?? undefined,
          publishedYear: book.publishedYear ?? undefined,
          genreId: book.genreId,
          condition: book.condition,
          images: book.images.map((image) => ({ url: image.url, publicId: image.publicId ?? '', isCover: image.isCover, position: image.position })),
        }}
      />
    </main>
  );
}

