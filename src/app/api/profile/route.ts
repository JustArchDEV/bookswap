import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { profileUpdateSchema } from '@/lib/validators/profile.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Необхідна авторизація' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = profileUpdateSchema.parse(body);

    if (data.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json({ error: 'Цей email вже використовується' }, { status: 400 });
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        email: data.email,
        avatar: data.avatar ?? null,
        city: data.city ?? null,
        bio: data.bio ?? null,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Помилка оновлення профілю' },
      { status: 400 }
    );
  }
}

