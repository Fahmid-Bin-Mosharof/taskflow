import { FiPlus } from 'react-icons/fi'
import { useDroppable } from '@dnd-kit/core'
import DraggableTaskCard from './DraggableTaskCard'

export default function TaskColumn({ status, tasks, getAssignee, onAddTask, renderMenu, onOpenTask }) {
  const headingId = `column-${status.value}`
  const { setNodeRef, isOver } = useDroppable({ id: status.value })

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={headingId}
      className={`flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border p-3 transition-colors sm:w-80 lg:w-auto ${
        isOver
          ? 'border-primary bg-primary/10'
          : 'border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/60'
      }`}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} aria-hidden="true" />
          <h3
            id={headingId}
            className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
          >
            {status.label}
          </h3>
          <span
            className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            aria-label={`${tasks.length} tasks`}
          >
            {tasks.length}
          </span>
        </div>

        {onAddTask && (
          <button
            type="button"
            onClick={() => onAddTask(status.value)}
            aria-label={`Add task to ${status.label}`}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-white hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <FiPlus size={18} />
          </button>
        )}
      </header>

      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-3 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          No tasks
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <DraggableTaskCard
                task={task}
                assignee={getAssignee(task.assignedTo)}
                menu={renderMenu?.(task)}
                onOpen={onOpenTask}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}