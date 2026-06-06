'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: 'Як зареєструватись на BookSwap?',
    answer: 'Натисніть кнопку «Реєстрація», введіть ім\'я, email та пароль. Акаунт створюється миттєво.',
  },
  {
    question: 'Чи безкоштовний сервіс?',
    answer: 'Так, BookSwap повністю безкоштовний для всіх користувачів.',
  },
  {
    question: 'Як додати книгу?',
    answer: 'Перейдіть до розділу «Мої книги» та натисніть «Додати книгу». Заповніть форму та завантажте фото.',
  },
  {
    question: 'Скільки книг можна додати?',
    answer: 'Немає обмежень на кількість книг у вашому профілі.',
  },
  {
    question: 'Як запропонувати обмін?',
    answer: 'Знайдіть книгу в каталозі, відкрийте її сторінку і натисніть «Запропонувати обмін».',
  },
  {
    question: 'Як відбувається обмін?',
    answer: 'Після прийняття пропозиції обидва користувачі домовляються в чаті про деталі зустрічі.',
  },
  {
    question: 'Чи можна скасувати обмін?',
    answer: 'Так, обмін можна скасувати до його підтвердження обома сторонами.',
  },
  {
    question: 'Що робити якщо користувач не виходить на зв&apos;язок?',
    answer: 'Зверніться до служби підтримки через форму на сторінці контактів.',
  },
  {
    question: 'Як видалити книгу?',
    answer: 'Перейдіть до «Мої книги», відкрийте книгу і натисніть «Видалити».',
  },
  {
    question: 'Як змінити дані профілю?',
    answer: 'Перейдіть до розділу «Профіль» та натисніть «Редагувати профіль».',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <main className="bg-slate-50">
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat -mx-4 sm:-mx-6 lg:-mx-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.4)), url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1600&q=80')",
        }}
      >
        <div className="relative px-4 py-20 text-center text-white sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg sm:text-5xl">Часті запитання</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">Знайдіть відповідь на своє запитання або зв&apos;яжіться з нами</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Відповіді на популярні запитання</h2>
            <p className="mt-3 text-slate-600 leading-7">Оберіть питання, щоб побачити відповідь.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-slate-900"
                  >
                    <span className="font-medium">{item.question}</span>
                    <span className="text-xl font-semibold text-slate-500">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-5 text-slate-600 leading-7">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
