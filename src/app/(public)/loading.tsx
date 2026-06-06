export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-2/5 rounded-2xl bg-slate-200" />
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-52 rounded-[2rem] bg-slate-200" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
