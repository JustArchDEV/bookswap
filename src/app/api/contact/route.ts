import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Ім\'я має містити принаймні 2 символи.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Введіть коректний email.' }, { status: 400 });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      return NextResponse.json({ error: 'Тема є обов\'язковою.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 20) {
      return NextResponse.json({ error: 'Повідомлення має містити принаймні 20 символів.' }, { status: 400 });
    }

    console.log('Contact form submission:', { name, email, subject, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Невідома помилка' }, { status: 400 });
  }
}
