import { Link } from 'react-router-dom'
import { FiCheckSquare } from 'react-icons/fi'

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 text-xl font-bold ${className}`}
      aria-label="TaskFlow home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
        <FiCheckSquare size={20} aria-hidden="true" />
      </span>
      <span>TaskFlow</span>
    </Link>
  )
}