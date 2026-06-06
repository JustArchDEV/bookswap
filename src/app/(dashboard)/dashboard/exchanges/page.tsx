import { auth } from '@/auth';
import { exchangeService } from '@/services/exchangeService';
import { ExchangeList } from '@/components/exchanges/ExchangeList';
import { redirect } from 'next/navigation';

export default async function DashboardExchangesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const exchanges = await exchangeService.getUserExchanges(session.user.id);

  return (
    <main className="space-y-8">
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat -mx-4 sm:-mx-6 lg:-mx-8 mb-8"
        style={{ backgroundImage: "linear-gradient(rgba(15,23,42,0.6), rgba(15,23,42,0.4)), url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&q=80')" }}
      >
        <div className="relative px-4 py-20 text-center text-white sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg sm:text-5xl">Мої обміни</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">Відстежуйте статус ваших обмінів</p>
        </div>
      </section>
      <ExchangeList exchanges={exchanges} />
    </main>
  );
}

