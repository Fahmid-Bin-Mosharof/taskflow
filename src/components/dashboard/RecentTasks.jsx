import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiCheckSquare, FiFolder } from 'react-icons/fi'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import LoadingSpinner from '../common/LoadingSpinner'
import PriorityBadge from '../tasks/PriorityBadge'
import { formatShortDate, isPastDate } from '../../utils/dateUtils'
import { getRecentTasks, getStatus } from '../../utils/taskUtils'

function RecentTaskRow({ task, projectName }) {
  const status = getStatus(task.status)
  const overdue = task.status !== 'done' && isPastDate(task.dueDate)

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
      <div className="min-w-0 flex-1 basis-48">
        <Link
          to={`/dashboard/projects/${task.projectId}`}
          className="block truncate text-sm font-medium hover:text-primary"
        >
          {task.title}
        </Link>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <FiFolder size={12} aria-hidden="true" />
          <span className="truncate">{projectName ?? 'Unknown project'}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} aria-hidden="true" />
          {status.label}
        </span>
        <PriorityBadge priority={task.priority} />
        <span
          className={`inline-flex items-center gap-1 text-xs ${
            overdue
              ? 'font-medium text-red-600 dark:text-red-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FiCalendar size={13} aria-hidden="true" />
          {task.dueDate
            ? `${overdue ? 'Overdue · ' : 'Due '}${formatShortDate(task.dueDate)}`
            : 'No due date'}
        </span>
      </div>
    </li>
  )
}

/** projectNames: Map of projectId -> project name */
export default function RecentTasks({ tasks, projectNames, loading }) {
  const recent = useMemo(() => getRecentTasks(tasks, 5), [tasks])

  const renderBody = () => {
    if (loading) return <LoadingSpinner label="Loading tasks..." />

    if (recent.length === 0) {
      return (
        <EmptyState
          icon={FiCheckSquare}
          title="No tasks found."
          description="Create a task to start managing your project."
          action={
            <Button to="/dashboard/projects" variant="secondary">
              Go to Projects
            </Button>
          }
        />
      )
    }

    return (
      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
        {recent.map((task) => (
          <RecentTaskRow key={task.id} task={task} projectName={projectNames.get(task.projectId)} />
        ))}
      </ul>
    )
  }

  return (
    <section className="mt-10" aria-labelledby="recent-tasks-heading">
      <h2 id="recent-tasks-heading" className="mb-4 text-lg font-semibold">
        Recent Tasks
      </h2>
      {renderBody()}
    </section>
  )
}