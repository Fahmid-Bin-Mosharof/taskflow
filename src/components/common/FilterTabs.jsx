/** options: [{ value, label, count? }] */
export default function FilterTabs({ label, options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              active
                ? 'border-primary bg-primary text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {option.label}
            {typeof option.count === 'number' && (
              <span
                className={`rounded-full px-1.5 text-xs ${
                  active ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}