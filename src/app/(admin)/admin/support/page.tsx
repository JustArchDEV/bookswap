import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { SupportAdminTable } from '@/components/admin/SupportAdminTable';

export default async function SupportPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const messages = await prisma.supportMessage.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Адмін</p>
        <h1 className="text-4xl font-semibold text-slate-950">Техпідтримка</h1>
      </div>
      <SupportAdminTable messages={messages.map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      }))} />
    </main>
  );
}
