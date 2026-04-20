export default function ScenarioResultLoading() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 max-w-3xl">
        <div className="h-4 w-32 bg-gray-200" />
        <div className="mt-3 h-8 w-96 max-w-full bg-gray-200" />
        <div className="mt-4 h-4 w-full max-w-2xl bg-gray-100" />
      </div>
      <div className="border border-gray-200 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-20 bg-gray-100" />
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="h-72 border border-gray-200 bg-white p-6">
            <div className="h-5 w-56 bg-gray-200" />
            <div className="mt-5 h-32 bg-gray-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

