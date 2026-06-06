export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 sm:px-6 lg:px-8">
      <div className="h-20 bg-slate-200 rounded-2xl animate-pulse" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-lg animate-pulse" />
        ))}
      </div>
    </main>
  );
}
