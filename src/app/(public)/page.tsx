import Link from 'next/link';
import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import SupportForm from '@/components/SupportForm';

const steps = [
  {
    title: 'Реєструйся',
    description: 'Створи акаунт і почни свою книжкову пригоду.',
    icon: '👤',
  },
  {
    title: 'Додай книги',
    description: 'Завантаж фото, опис та стан книги за кілька хвилин.',
    icon: '📚',
  },
  {
    title: 'Знайди обмін',
    description: 'Пошук книг та пропозицій легко знаходиться в каталозі.',
    icon: '🔎',
  },
  {
    title: 'Домовся в чаті',
    description: 'Обговори деталі з користувачем і завершуй обмін.',
    icon: '💬',
  },
];

const benefits = [
  {
    title: 'Швидкий обмін',
    description: 'Знаходь нові книги та обмінюйся без зайвих кроків.',
    icon: '⚡',
    color: 'bg-orange-100 text-orange-600',
    accent: '#fb923c',
  },
  {
    title: 'Довіра спільноті',
    description: 'Рейтинги, обміни та відкриті чати зроблять процес безпечним.',
    icon: '🤝',
    color: 'bg-cyan-100 text-cyan-600',
    accent: '#22d3ee',
  },
  {
    title: 'Підтримка читачів',
    description: 'Допомога у пошуку, обміні та оформленні обміну онлайн.',
    icon: '🌟',
    color: 'bg-sky-100 text-sky-700',
    accent: '#38bdf8',
  },
];

export default async function Home() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HERO */}
      <header
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.55), rgba(15,23,42,0.35)), url('https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/20" />
        <section className="relative px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="whitespace-normal text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]">
                Знайди, обмінюйся та читай далі з BookSwap
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/90 sm:text-xl">
                Платформа для читачів, які хочуть оновити свою бібліотеку та знайти однодумців.
                Додай книги, знайди пропозицію та домовся в чаті швидко й безпечно.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/how-it-works">
                <Button size="lg" className="bg-white text-[#1e40af] px-8 py-4 text-lg hover:bg-slate-100">
                  Як це працює
                </Button>
              </Link>
              <Link href="#benefits">
                <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white/20 px-8 py-4 text-lg">
                  Про нас
                </Button>
              </Link>
              {!session && (
                <Link href="/register">
                  <Button size="lg" className="bg-[#2563eb] text-white px-8 py-4 text-lg hover:bg-blue-700">
                    Зареєструватись
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </header>

      {/* ЯК ЦЕ ПРАЦЮЄ */}
      <section id="how-it-works" className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Як це працює</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">4 кроки до ідеального обміну</h2>
            <p className="mt-4 mx-auto max-w-2xl text-base leading-7 text-slate-600">
              Простий та прозорий процес для кожного читача — від реєстрації до першого обміну.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl">
                  {step.icon}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e40af] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-950">{step.title}</h3>
                </div>
                <p className="mt-4 text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/how-it-works" className="inline-flex rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-blue-700">
              Детальніше
            </Link>
          </div>
        </div>
      </section>

      {/* ПЕРЕВАГИ */}
      <section id="benefits" className="bg-slate-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Переваги</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Чому обирають BookSwap</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-[2rem] border border-slate-200 border-t-4 bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
                style={{ borderTopColor: benefit.accent }}
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-3xl ${benefit.color}`}>
                  <span className="text-2xl">{benefit.icon}</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-950">{benefit.title}</h3>
                <p className="mt-4 text-slate-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРО НАС */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Про BookSwap</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">BookSwap — це маркетплейс для обміну книгами між людьми, які люблять читати.</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-slate-700">BookSwap — це маркетплейс для обміну книгами між людьми, які люблять читати. Ми віримо, що кожна книга заслуговує на нового читача, а кожен читач — на нову книгу.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-slate-700">Наша платформа дозволяє легко знайти книги, які вас цікавлять, запропонувати свої в обмін або віддати безкоштовно — і все це в межах вашої спільноти.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-slate-700">Приєднуйтесь до тисяч читачів, які вже обмінялись книгами через BookSwap. Разом ми будуємо культуру читання та обміну знаннями.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Зворотний зв'язок */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Зворотний зв&apos;язок</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Маєте питання? Напишіть нам — ми відповімо якнайшвидше.</h2>
          </div>
          <SupportForm />
        </div>
      </section>

      {/* CTA — тільки для незареєстрованих */}
      {!session && (
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#06b6d4] px-8 py-14 text-white shadow-2xl sm:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100/90">Готові до наступного кроку?</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Почніть обмін уже сьогодні</h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-cyan-100/90">
                  Зареєструйтесь, додайте свою першу книгу та знайдіть ідеальний обмін для своєї наступної історії.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-white text-[#1e40af] hover:bg-slate-100">
                    Створити акаунт
                  </Button>
                </Link>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full border-2 border-white text-white bg-white/20 hover:bg-white/30">
                    Увійти
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}