import { useId, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export default function Input({
  label,
  error,
  type = 'text',
  multiline = false,
  rows = 3,
  className = '',
  ...props
}) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = !multiline && type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  const Field = multiline ? 'textarea' : 'input'

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <div className="relative">
        <Field
          id={id}
          type={multiline ? undefined : inputType}
          rows={multiline ? rows : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 ${
            error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
          } ${isPassword ? 'pr-11' : ''} ${multiline ? 'resize-y' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}