import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { UserRoleTable } from '@/components/admin/UserRoleTable';

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { _count: { select: { books: true, requestedExchanges: true, ownedExchanges: true } } },
  });

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Адмін</p>
        <h1 className="text-4xl font-semibold text-slate-950">Користувачі</h1>
      </div>
      <UserRoleTable users={users} />
    </main>
  );
}

