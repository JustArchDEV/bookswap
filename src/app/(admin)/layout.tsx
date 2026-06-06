import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

interface ExtendedSession extends Session {
  user: Session['user'] & {
    id: string;
    role: string;
    isBlocked: boolean;
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await auth()) as ExtendedSession | null;

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const unreadSupportCount = await prisma.supportMessage.count({ where: { isRead: false } });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Адмін-панель</p>
            <h1 className="text-2xl font-semibold text-slate-950">BookSwap Admin</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
            <Link href="/admin" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-slate-100">
              Статистика
            </Link>
            <Link href="/admin/users" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-slate-100">
              Користувачі
            </Link>
            <Link href="/admin/books" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-slate-100">
              Книги
            </Link>
            <Link href="/admin/support" className="relative rounded-full border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-slate-100">
              Техпідтримка
              {unreadSupportCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-[0.65rem] font-semibold text-white">
                  {unreadSupportCount}
                </span>
              )}
            </Link>
            <Link href="/admin/genres" className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 hover:bg-slate-100">
              Жанри
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}