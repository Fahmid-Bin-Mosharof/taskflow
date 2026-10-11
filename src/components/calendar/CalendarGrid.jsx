import { useEffect, useRef } from 'react'
import { addDays, getWeekdayLabels } from '../../utils/calendarUtils'
import { formatLongDate, parseDateInput } from '../../utils/dateUtils'
import { getPriorityStyle } from '../../utils/taskUtils'

const WEEKDAYS = getWeekdayLabels()
const MAX_CHIPS = 2
const MAX_DOTS = 4
const ARROW_OFFSETS = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }

function DayCell({ day, tasks, isToday, isSelected, isTabStop, onSelect }) {
  const count = tasks.length
  const label = `${formatLongDate(day.date)}, ${
    count === 0 ? 'no tasks' : `${count} ${count === 1 ? 'task' : 'tasks'} due`
  }`

  return (
    <td
      className={`border-l border-t border-slate-200 p-0 align-top first:border-l-0 dark:border-slate-800 ${
        day.inMonth ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-950/60'
      }`}
    >
      <button
        type="button"
        data-key={day.key}
        tabIndex={isTabStop ? 0 : -1}
        aria-label={label}
        aria-pressed={isSelected}
        aria-current={isToday ? 'date' : undefined}
        onClick={() => onSelect(day)}
        className={`flex min-h-20 w-full flex-col items-stretch gap-1 p-1.5 text-left transition hover:bg-slate-50 sm:min-h-28 sm:p-2 dark:hover:bg-slate-800/60 ${
          isSelected ? 'ring-2 ring-inset ring-primary' : ''
        }`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium sm:text-sm ${
            isToday
              ? 'bg-primary text-white'
              : day.inMonth
                ? 'text-slate-900 dark:text-slate-100'
                : 'text-slate-400 dark:text-slate-600'
          }`}
        >
          {day.date.getDate()}
        </span>

        {/* Tablet and up: task titles */}
        <span className="hidden flex-col gap-1 sm:flex">
          {tasks.slice(0, MAX_CHIPS).map((task) => {
            const style = getPriorityStyle(task.priority)
            return (
              <span
                key={task.id}
                className={`flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs font-medium ${style.badge} ${
                  task.status === 'done' ? 'line-through opacity-60' : ''
                }`}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                <span className="truncate">{task.title}</span>
              </span>
            )
          })}
          {count > MAX_CHIPS && (
            <span className="px-1.5 text-xs text-slate-500 dark:text-slate-400">
              +{count - MAX_CHIPS} more
            </span>
          )}
        </span>

        {/* Phones: priority dots only */}
        <span className="mt-auto flex flex-wrap items-center gap-0.5 sm:hidden">
          {tasks.slice(0, MAX_DOTS).map((task) => (
            <span
              key={task.id}
              className={`h-1.5 w-1.5 rounded-full ${getPriorityStyle(task.priority).dot}`}
            />
          ))}
          {count > MAX_DOTS && (
            <span className="text-[10px] leading-none text-slate-500 dark:text-slate-400">
              +{count - MAX_DOTS}
            </span>
          )}
        </span>
      </button>
    </td>
  )
}

/**
 * weeks: from getMonthGrid. tasksByDay: Map of 'YYYY-MM-DD' -> tasks.
 * onSelect(day) handles clicks; onMoveSelection(date) handles arrow keys.
 */
export default function CalendarGrid({
  label,
  weeks,
  tasksByDay,
  selectedKey,
  todayKey,
  onSelect,
  onMoveSelection,
}) {
  const tableRef = useRef(null)
  const shouldFocus = useRef(false)

  const allDays = weeks.flat()
  const tabStopKey = allDays.some((day) => day.key === selectedKey)
    ? selectedKey
    : allDays.find((day) => day.inMonth).key

  // After an arrow-key move, focus the newly selected day once it has rendered
  // (it may be in a different month, which changes the grid).
  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    tableRef.current?.querySelector(`[data-key="${selectedKey}"]`)?.focus()
  }, [selectedKey, weeks])

  const handleKeyDown = (e) => {
    const offset = ARROW_OFFSETS[e.key]
    const key = e.target.dataset?.key
    if (!offset || !key) return

    e.preventDefault()
    shouldFocus.current = true
    onMoveSelection(addDays(parseDateInput(key), offset))
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table
        ref={tableRef}
        onKeyDown={handleKeyDown}
        className="w-full table-fixed border-collapse"
      >
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            {WEEKDAYS.map((weekday) => (
              <th
                key={weekday.long}
                scope="col"
                abbr={weekday.long}
                className="py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              >
                {weekday.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0].key}>
              {week.map((day) => (
                <DayCell
                  key={day.key}
                  day={day}
                  tasks={tasksByDay.get(day.key) ?? []}
                  isToday={day.key === todayKey}
                  isSelected={day.key === selectedKey}
                  isTabStop={day.key === tabStopKey}
                  onSelect={onSelect}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}