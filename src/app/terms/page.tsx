export default function TermsPage() {
  return (
    <main className="bg-slate-50">
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">BookSwap</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Умови використання</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-100">
            Ознайомтесь з правилами користування платформою BookSwap для безпечних та прозорих обмінів книгами.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-12 text-slate-600 leading-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Загальні положення</h2>
            <p className="mt-4">
              BookSwap — це онлайн-платформа для обміну книгами між користувачами. Використання сайту означає прийняття цих умов. Ми залишаємо за собою право змінювати умови, попередивши користувачів через доступний канал зв’язку.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Реєстрація та акаунт</h2>
            <p className="mt-4">
              Користувач повинен створити акаунт з дійсною електронною поштою, ім’ям та паролем. Ви несете відповідальність за безпеку вхідних даних і за всі дії, виконані через ваш обліковий запис.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Правила розміщення книг</h2>
            <p className="mt-4">
              Книги повинні бути описані чесно та точно. Вкажіть стан, рік видання, авторів і жанр. Заборонено розміщувати матеріали з недостовірною інформацією або фото, які не відповідають реальному стану книги.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Правила обміну</h2>
            <p className="mt-4">
              Обмін відбувається за домовленістю між користувачами. Сторони самостійно узгоджують умови, місце та час передачі книг. Ми не несемо відповідальності за рішення користувачів, але рекомендуємо зберігати повідомлення в чаті як підтвердження домовленостей.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Заборонений контент</h2>
            <p className="mt-4">
              Заборонено розміщувати книги з неналежним, незаконним, образливим або дискримінаційним змістом. Також заборонено обмінюватися товарами, що порушують авторські права, або пропонувати послуги, які не пов’язані з книжковим обміном.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Відповідальність сторін</h2>
            <p className="mt-4">
              Ми надаємо платформу для знайомства та взаємодії, але не гарантуємо результат обміну. Користувачі відповідають за достовірність інформації, дотримання умов і повагу під час спілкування. BookSwap не несе відповідальності за втрату, пошкодження або невиконання домовленостей між користувачами.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Зміни до умов</h2>
            <p className="mt-4">
              Ми можемо оновлювати умови використання у будь-який час. Про зміни буде повідомлено через електронну пошту або повідомлення на платформі. Продовження використання сервісу після оновлення означає прийняття нових умов.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Контакти</h2>
            <p className="mt-4">
              Якщо у вас є питання щодо умов, будь ласка, напишіть на support@bookswap.ua. Ми відповідаємо на запити якнайшвидше.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
