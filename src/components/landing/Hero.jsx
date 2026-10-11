import Button from '../common/Button'
import { useAuth } from '../../hooks/useAuth'
const previewColumns = [
  { title: 'Todo', tasks: [{ name: 'Build Navbar', tag: 'High', color: 'bg-red-500' }, { name: 'Create Footer', tag: 'Medium', color: 'bg-amber-500' }] },
  { title: 'In Progress', tasks: [{ name: 'Login Page', tag: 'High', color: 'bg-red-500' }] },
  { title: 'Done', tasks: [{ name: 'Project Setup', tag: 'Low', color: 'bg-emerald-500' }, { name: 'Design System', tag: 'Low', color: 'bg-emerald-500' }] },
]

export default function Hero() {
  const { user } = useAuth()
  return (
    <section id="home" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Simple project management
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Organize Your Work. Get Things Done.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-400">
          TaskFlow helps you organize projects, manage tasks, and track progress from one
          simple workspace.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {user ? (
            <Button to="/dashboard" size="lg">Go to Dashboard</Button>
          ) : (
            <>
              <Button to="/register" size="lg">Get Started</Button>
              <Button to="/login" variant="secondary" size="lg">Login</Button>
            </>
          )}
        </div>

        {/* Decorative board preview */}
        <div
          aria-hidden="true"
          className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-900"
        >
          {previewColumns.map((col) => (
            <div key={col.title} className="rounded-xl bg-slate-100 p-3 text-left dark:bg-slate-800/60">
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <span>{col.title}</span>
                <span>{col.tasks.length}</span>
              </div>
              <div className="space-y-2">
                {col.tasks.map((task) => (
                  <div
                    key={task.name}
                    className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <p className="text-sm font-medium">{task.name}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span className={`h-2 w-2 rounded-full ${task.color}`} />
                      {task.tag}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}