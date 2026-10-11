import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-primary text-white shadow-sm hover:bg-primary-hover',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
  ghost:
    'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  to,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? 'w-full' : ''
  } ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} disabled={loading || disabled} {...props}>
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}