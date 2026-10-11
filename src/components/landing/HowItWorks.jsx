import { FiFolderPlus, FiEdit3, FiTrendingUp, FiArrowDown, FiArrowRight } from 'react-icons/fi'

const steps = [
  { icon: FiFolderPlus, title: 'Create Project', text: 'Start a project for anything you are working on.' },
  { icon: FiEdit3, title: 'Add Tasks', text: 'Break the work into tasks and set priorities and due dates.' },
  { icon: FiTrendingUp, title: 'Track Progress', text: 'Move tasks across the board and watch your progress grow.' },
]

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Get started in three simple steps.
          </p>
        </div>

        <ol className="mt-12 flex flex-col items-center gap-4 md:flex-row md:items-stretch md:justify-center">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="flex flex-col items-center gap-4 md:flex-row">
              <div className="w-full max-w-xs rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
                  Step {index + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{text}</p>
              </div>
              {index < steps.length - 1 && (
                <>
                  <FiArrowDown className="text-slate-400 md:hidden" size={24} aria-hidden="true" />
                  <FiArrowRight className="hidden text-slate-400 md:block" size={24} aria-hidden="true" />
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}