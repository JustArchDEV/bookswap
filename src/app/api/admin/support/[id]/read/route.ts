import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }

    const { id } = await params;
    const supportMessage = await prisma.supportMessage.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ supportMessage });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка оновлення повідомлення' }, { status: 500 });
  }
}
