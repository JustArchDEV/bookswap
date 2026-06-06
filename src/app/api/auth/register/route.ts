import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators/auth.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      const rawErrors = validationResult.error.flatten().fieldErrors;
      const errors: Record<string, string> = {};

      Object.entries(rawErrors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          const firstMessage = value.filter(Boolean)[0];
          if (firstMessage) {
            errors[key] = firstMessage;
          }
        }
      });

      return NextResponse.json(
        {
          success: false,
          errors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Користувач з цією email адресою вже існує',
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        isBlocked: false,
      },
    });

    // Return safe response without password
    return NextResponse.json(
      {
        success: true,
        message: 'Реєстрація успішна. Перенаправляю на вхід...',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    const message =
      process.env.NODE_ENV === 'development' && error instanceof Error
        ? error.message
        : 'Помилка при реєстрації. Спробуйте пізніше.';

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
