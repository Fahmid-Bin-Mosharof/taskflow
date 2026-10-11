import Logo from '../components/common/Logo'
import ThemeToggle from '../components/common/ThemeToggle'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <Logo className="mb-8" />
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
      <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">{footer}</p>
    </main>
  )
}