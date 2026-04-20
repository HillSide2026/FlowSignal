export default function NewScenarioLoading() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 max-w-3xl">
        <div className="h-4 w-32 bg-gray-200" />
        <div className="mt-3 h-8 w-80 bg-gray-200" />
        <div className="mt-4 h-4 w-full max-w-2xl bg-gray-100" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="border border-gray-200 bg-white p-6">
          <div className="h-5 w-48 bg-gray-200" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="h-16 bg-gray-100" />
            ))}
          </div>
        </div>
        <div className="hidden border border-gray-200 bg-white p-6 xl:block">
          <div className="h-5 w-40 bg-gray-200" />
          <div className="mt-5 h-24 bg-gray-100" />
        </div>
      </div>
    </section>
  );
}

