export default function ChartCard({ title, description, children }) {
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && (
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  )
}