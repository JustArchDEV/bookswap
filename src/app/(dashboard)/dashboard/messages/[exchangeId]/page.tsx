import { auth } from '@/auth';
import { exchangeService } from '@/services/exchangeService';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { notFound, redirect } from 'next/navigation';

export default async function MessagePage({ params }: { params: Promise<{ exchangeId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { exchangeId } = await params;
  const exchange = await exchangeService.getExchangeById(exchangeId);
  if (!exchange) {
    notFound();
  }
  if (exchange.requesterId !== session.user.id && exchange.ownerId !== session.user.id) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Чат обміну</p>
        <h1 className="text-4xl font-semibold text-slate-950">Чат обміну — #{exchange.id.slice(0, 8)}</h1>
      </div>
      <ChatPanel exchangeId={exchange.id} currentUserId={session.user.id} />
    </main>
  );
}

