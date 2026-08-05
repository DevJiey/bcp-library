function LoadingSkeleton({
  rows = 5,
  columns = 4,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />

        <div className="mt-2 h-3 w-64 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 px-6 py-5"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map(
              (_, columnIndex) => (
                <div
                  key={columnIndex}
                  className="h-4 animate-pulse rounded bg-slate-200"
                />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;