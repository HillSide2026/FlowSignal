export default function ScenariosLoading() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 max-w-3xl">
        <div className="h-4 w-32 bg-gray-200" />
        <div className="mt-3 h-8 w-72 bg-gray-200" />
        <div className="mt-4 h-4 w-full max-w-xl bg-gray-100" />
      </div>
      <div className="grid gap-4">
        {[0, 1, 2].map((item) => (
          <div key={item} className="border border-gray-200 bg-white p-6">
            <div className="h-5 w-64 bg-gray-200" />
            <div className="mt-3 h-4 w-full max-w-lg bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

