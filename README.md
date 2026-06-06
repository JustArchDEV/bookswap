# BookSwap - Маркетплейс для обміну книгами

## 📚 Про проект

BookSwap — це веб-застосунок для обміну книгами між користувачами. Платформа дозволяє користувачам додавати книги, переглядати каталог, пропонувати обміни та спілкуватися через внутрішній чат.

## 🛠️ Технологічний стек

### Frontend
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **React Hook Form**

### Backend
- **Next.js Route Handlers** (REST API)
- **Auth.js v5** (NextAuth)
- **bcryptjs**
- **Zod** (валідація)

### База даних
- **PostgreSQL**
- **Prisma ORM**

### Інше
- **Cloudinary** (зберігання зображень)

## 🚀 Установка та запуск

### Передумови
- Node.js 18+
- npm або yarn
- PostgreSQL
- Cloudinary акаунт (для завантаження зображень)

### Кроки установки

1. **Клонування репозиторію**
   ```bash
   git clone <repository-url>
   cd BookSwap
   ```

2. **Установка залежностей**
   ```bash
   npm install
   ```

3. **Налаштування змінних середовища**
   ```bash
   cp .env.example .env.local
   ```
   Редагуйте `.env.local` і вкажіть:
   - `DATABASE_URL` — рядок підключення до PostgreSQL
   - `NEXTAUTH_SECRET` — секретний ключ (можна генерувати через `openssl rand -base64 32`)
   - `NEXTAUTH_URL` — URL застосунку (http://localhost:3000 для локальної розробки)
   - Cloudinary облікові дані

4. **Міграція бази даних**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed бази даних**
   ```bash
   npm run prisma:seed
   ```
   Це створить:
   - 7 жанрів книг
   - Адміністраторський акаунт (admin@bookswap.local / Admin123!)

6. **Запуск розробницького сервера**
   ```bash
   npm run dev
   ```

Застосунок буде доступний на `http://localhost:3000`

## 📖 Використання

### Реєстрація та вхід
1. Перейдіть на `/register` для створення нового акаунту
2. Після реєстрації перейдіть на `/login` для входу
3. Тестовий адміністратор: `admin@bookswap.local` / `Admin123!`

### Функціонал (планується)
- Додавання та управління книгами
- Перегляд каталогу з фільтрацією та пошуком
- Створення пропозицій обміну
- Чат між користувачами
- Адміністративна панель

## 🗂️ Структура проекту

```
src/
├── app/                 # Next.js App Router
│   ├── (public)/       # Публічні сторінки
│   ├── (dashboard)/    # Особистий кабінет
│   ├── (admin)/        # Адміністративна панель
│   ├── api/            # REST API
│   └── layout.tsx      # Глобальний layout
├── components/         # React компоненти
│   ├── ui/            # shadcn/ui компоненти
│   └── auth/          # Auth компоненти
├── lib/               # Утиліти та конфігурація
│   ├── auth.ts        # NextAuth конфіг
│   ├── prisma.ts      # Prisma Singleton
│   ├── validators/    # Zod схеми
│   └── cloudinary.ts  # Cloudinary конфіг
├── types/             # TypeScript типи
├── constants/         # Константи застосунку
└── middleware.ts      # Next.js middleware
```

## 🔐 Безпека

- Всі паролі хешуються за допомогою bcryptjs
- JWT сесії для автентифікації
- Middleware для захисту приватних маршрутів
- Role-based access control (RBAC)
- CSRF захист через Next.js

## 📝 Ліцензія

Цей проект розроблений як кваліфікаційна робота.

## 👥 Контакт

Для питань та пропозицій будь ласка зв'яжіться з розробником.
