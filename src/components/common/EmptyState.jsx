export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={28} aria-hidden="true" />
        </span>
      )}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}