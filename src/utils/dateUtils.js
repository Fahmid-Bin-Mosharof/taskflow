export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

/** e.g. "Oct 10, 2026" */
export function formatDate(date) {
  return date ? dateFormatter.format(date) : '—'
}

/** e.g. "Oct 10" */
export function formatShortDate(date) {
  return date ? shortDateFormatter.format(date) : ''
}

/** True if the date is before the start of today. */
export function isPastDate(date) {
  if (!date) return false
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  return date < startOfToday
}

/** Date -> "YYYY-MM-DD" (local time) for <input type="date">. */
export function toDateInputValue(date) {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** "YYYY-MM-DD" -> Date at local midnight, or null for an empty value. */
export function parseDateInput(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
})

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

/** e.g. "October 2026" */
export function formatMonthYear(date) {
  return monthYearFormatter.format(date)
}

/** e.g. "Friday, October 9, 2026" */
export function formatLongDate(date) {
  return longDateFormatter.format(date)
}