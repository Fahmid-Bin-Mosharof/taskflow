import { useId } from 'react'

export default function Select({
  label,
  options,
  error,
  hideLabel = false,
  className = '',
  ...props
}) {
  const id = useId()

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={
          hideLabel
            ? 'sr-only'
            : 'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300'
        }
      >
        {label}
      </label>
      <select
        id={id}
        aria-invalid={Boolean(error)}
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-900 dark:text-slate-100 ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
        }`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}