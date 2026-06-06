export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-72 rounded-[2rem] bg-slate-200" />
        ))}
      </div>
    </main>
  );
}
