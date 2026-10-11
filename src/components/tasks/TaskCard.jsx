import { FiCalendar, FiFolder, FiUser } from 'react-icons/fi'
import Avatar from '../common/Avatar'
import PriorityBadge from './PriorityBadge'
import { formatShortDate, isPastDate } from '../../utils/dateUtils'

export default function TaskCard({ task, assignee, projectName, menu, onOpen }) {
  const overdue = task.status !== 'done' && isPastDate(task.dueDate)
  const interactive = typeof onOpen === 'function'

  return (
    <article
      onClick={interactive ? () => onOpen(task) : undefined}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 ${
        interactive ? 'cursor-pointer' : ''
      }`}
    >
      {projectName && (
        <p className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <FiFolder size={12} aria-hidden="true" />
          <span className="truncate">{projectName}</span>
        </p>
      )}

      <div className="flex items-start justify-between gap-2">
        <h4 className="min-w-0 wrap-break-word text-sm font-semibold">
          {interactive ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpen(task)
              }}
              className="text-left hover:text-primary"
            >
              {task.title}
            </button>
          ) : (
            task.title
          )}
        </h4>
        {menu && <div className="-mr-1 -mt-1 shrink-0">{menu}</div>}
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 wrap-break-word text-sm text-slate-600 dark:text-slate-400">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <PriorityBadge priority={task.priority} />

        {task.dueDate && (
          <span
            className={`flex items-center gap-1 text-xs ${
              overdue
                ? 'font-medium text-red-600 dark:text-red-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <FiCalendar size={13} aria-hidden="true" />
            {overdue ? 'Overdue · ' : 'Due '}
            {formatShortDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
        {assignee ? (
          <>
            <Avatar name={assignee.name} photoURL={assignee.photoURL} size="xs" />
            <span className="truncate">{assignee.name}</span>
          </>
        ) : (
          <>
            <FiUser size={14} aria-hidden="true" />
            <span>Unassigned</span>
          </>
        )}
      </div>
    </article>
  )
}