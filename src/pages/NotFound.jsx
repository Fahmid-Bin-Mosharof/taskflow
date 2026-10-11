import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-primary-hover"
      >
        Go Home
      </Link>
    </main>
  )
}