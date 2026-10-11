import { FiCheckSquare, FiMove, FiBarChart2 } from 'react-icons/fi'

const features = [
  {
    icon: FiCheckSquare,
    title: 'Task Management',
    text: 'Create tasks with priorities, due dates, and descriptions. Keep every detail in one place.',
  },
  {
    icon: FiMove,
    title: 'Drag & Drop',
    text: 'Move tasks across Todo, In Progress, and Done with a smooth drag-and-drop board.',
  },
  {
    icon: FiBarChart2,
    title: 'Progress Tracking',
    text: 'See project statistics and charts that show how much is done and what is left.',
  },
]

export default function Features() {
  return (
    <section id="features" className="scroll-mt-16 bg-white py-20 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Everything you need to stay on track</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Simple tools that help you plan, focus, and finish.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}