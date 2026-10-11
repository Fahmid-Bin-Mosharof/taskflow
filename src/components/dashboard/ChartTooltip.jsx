export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {label && <p className="mb-1 font-medium">{label}</p>}
      {payload.map((item) => (
        <p key={item.dataKey ?? item.name} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: item.color ?? item.payload?.color }}
            aria-hidden="true"
          />
          {item.name}: <strong>{item.value}</strong>
        </p>
      ))}
    </div>
  )
}