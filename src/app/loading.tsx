export default function Loading() {
  return (
    <div>
      <div className="skeleton h-[50vh] min-h-[400px] w-full sm:h-[60vh]" />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        <div>
          <div className="skeleton mb-4 h-7 w-48 rounded-md" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl">
                <div className="skeleton aspect-[2/3]" />
                <div className="space-y-2 bg-zinc-900 p-3">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
