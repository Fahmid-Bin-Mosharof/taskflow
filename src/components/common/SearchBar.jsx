import { useId } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  label = 'Search',
  className = '',
}) {
  const id = useId()

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <FiSearch
        size={18}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  )
}