import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import MessagesClient from '@/components/messages/MessagesClient';

export default async function DashboardMessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const userId = session.user.id;
  const conversations = await prisma.exchange.findMany({
    where: {
      OR: [{ requesterId: userId }, { ownerId: userId }],
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      requester: true,
      owner: true,
      requestedBook: { select: { id: true, title: true } },
      offeredBook: { select: { id: true, title: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  const serialized = JSON.parse(JSON.stringify(conversations));
  return <MessagesClient initialConversations={serialized} currentUserId={userId} />;
}
