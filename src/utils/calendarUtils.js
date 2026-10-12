import { toDateInputValue } from './dateUtils'
import { sortTasks } from './taskUtils'

export const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1)

export const addDays = (date, amount) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)

/** 
 * Sunday-first weekday names: [{ short: 'Sun', long: 'Sunday' }, ...] 
 */
export function getWeekdayLabels() {
  const short = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
  const long = new Intl.DateTimeFormat('en-US', { weekday: 'long' })

  // January 1, 2023 was a Sunday.
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2023, 0, 1 + index)
    return { short: short.format(date), long: long.format(date) }
  })
}

/**
 * Whole weeks covering the month, as arrays of 7:
 * [[{ date, key: 'YYYY-MM-DD', inMonth }, ...], ...]
 * Days from the neighboring months fill the first and last week.
 */
export function getMonthGrid(viewDate) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const leading = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7

  const weeks = []
  for (let start = 0; start < totalCells; start += 7) {
    weeks.push(
      Array.from({ length: 7 }, (_, offset) => {
        // Day numbers outside 1..daysInMonth roll into the adjacent month.
        const date = new Date(year, month, 1 - leading + start + offset)
        return { date, key: toDateInputValue(date), inMonth: date.getMonth() === month }
      })
    )
  }
  return weeks
}

/** Map of 'YYYY-MM-DD' -> tasks due that day (high priority first). Skips undated tasks. */
export function groupTasksByDay(tasks) {
  const byDay = new Map()

  sortTasks(
    tasks.filter((task) => task.dueDate),
    'priority'
  ).forEach((task) => {
    const key = toDateInputValue(task.dueDate)
    const list = byDay.get(key)
    if (list) list.push(task)
    else byDay.set(key, [task])
  })
  return byDay
}