import { toDateInputValue } from './dateUtils'
import { STATUSES } from './taskUtils'

const STATUS_COLORS = {
  todo: '#94a3b8',
  'in-progress': '#3b82f6',
  done: '#10b981',
}

export const ACTIVITY_COLORS = {
  created: '#6366f1',
  completed: '#10b981',
}

/** [{ key, name, value, color }] for Todo, In Progress, Completed. */
export function getStatusChartData(tasks) {
  return STATUSES.map(({ value, label }) => ({
    key: value,
    name: value === 'done' ? 'Completed' : label,
    value: tasks.filter((task) => task.status === value).length,
    color: STATUS_COLORS[value],
  }))
}

const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

/**
 * The last 7 days (oldest first) as [{ key, label, created, completed }].
 * "completed" counts tasks currently in Done by the day they were last updated.
 */
export function getWeeklyActivity(tasks, now = new Date()) {
  const days = []
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset)
    days.push({
      key: toDateInputValue(date),
      label: weekdayFormatter.format(date),
      created: 0,
      completed: 0,
    })
  }

  const byKey = new Map(days.map((day) => [day.key, day]))

  tasks.forEach((task) => {
    const createdDay = byKey.get(toDateInputValue(task.createdAt))
    if (createdDay) createdDay.created += 1

    if (task.status === 'done') {
      const doneDay = byKey.get(toDateInputValue(task.updatedAt))
      if (doneDay) doneDay.completed += 1
    }
  })

  return days
}