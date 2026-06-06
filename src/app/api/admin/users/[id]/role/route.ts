import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
    }

    const body = await req.json();
    const role = body?.role;
    if (role !== 'USER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Невірна роль' }, { status: 400 });
    }

    const { id } = await params;
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ user: { id: user.id, role: user.role } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Помилка оновлення ролі' }, { status: 500 });
  }
}