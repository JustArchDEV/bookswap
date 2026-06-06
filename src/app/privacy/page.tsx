export default function PrivacyPage() {
  return (
    <main className="bg-slate-50">
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">BookSwap</p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Політика конфіденційності</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-100">
            Дізнайтесь, які дані ми збираємо, як їх обробляємо та як ви можете захистити свою інформацію.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-12 text-slate-600 leading-7">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Які дані збираємо</h2>
            <p className="mt-4">
              Ми збираємо інформацію, яку ви надаєте під час реєстрації, зокрема ім’я, електронну пошту та дані профілю. Можуть також збиратися технічні дані про пристрій, браузер та IP-адресу для покращення роботи сервісу.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Як використовуємо дані</h2>
            <p className="mt-4">
              Ми використовуємо ваші дані для обробки реєстрації, управління акаунтом, підтримки користувачів і покращення платформи. Інформація також використовується для забезпечення безпеки та запобігання шахрайству.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Cookies</h2>
            <p className="mt-4">
              Ми використовуємо cookies для збереження налаштувань, аутентифікації та аналітики. Ви можете вимкнути cookies у браузері, але це може обмежити функціональність сайту.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Передача даних третім особам</h2>
            <p className="mt-4">
              Ми не продаємо ваші дані. Інформація може бути передана лише службам, які допомагають працювати платформі, наприклад хостинг-провайдерам та сервісам електронної пошти. Усі партнери зобов’язані дотримуватися вимог конфіденційності.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Безпека даних</h2>
            <p className="mt-4">
              Ми застосовуємо технічні та організаційні заходи для захисту даних від несанкціонованого доступу. Ваші дані зберігаються на захищених серверах, а зв’язок шифрується за допомогою HTTPS.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Права користувача</h2>
            <p className="mt-4">
              Ви маєте право переглядати свої дані, оновлювати інформацію або запросити видалення акаунту. Також ви можете звернутися за оновленням налаштувань приватності та дізнатись, які дані ми зберігаємо.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">Контакти</h2>
            <p className="mt-4">
              Якщо у вас є питання щодо політики конфіденційності, звертайтесь на support@bookswap.ua. Ми відповідаємо на такі запити якомога швидше.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
