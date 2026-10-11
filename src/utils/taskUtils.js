export const ALL = 'all'
export const UNASSIGNED = 'unassigned'

export const STATUSES = [
  { value: 'todo', label: 'Todo', dot: 'bg-slate-400' },
  { value: 'in-progress', label: 'In Progress', dot: 'bg-blue-500' },
  { value: 'done', label: 'Done', dot: 'bg-emerald-500' },
]

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'due-date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
]

export const STATUS_FILTER_OPTIONS = [{ value: ALL, label: 'All' }, ...STATUSES]
export const PRIORITY_FILTER_OPTIONS = [{ value: ALL, label: 'All' }, ...PRIORITIES]

export const DEFAULT_FILTERS = {
  search: '',
  status: ALL,
  priority: ALL,
  assignee: ALL,
  sortBy: 'newest',
}

// Every badge also shows a text label, so color is never the only signal.
export const PRIORITY_STYLES = {
  high: {
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  },
  medium: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
  low: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
}

export function getPriorityStyle(priority) {
  return PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.medium
}

export function getPriorityLabel(priority) {
  return PRIORITIES.find((item) => item.value === priority)?.label ?? 'Medium'
}

export function getStatus(value) {
  return STATUSES.find((status) => status.value === value) ?? STATUSES[0]
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 }
const time = (date) => date?.getTime() ?? 0
const byNewest = (a, b) => time(b.createdAt) - time(a.createdAt)

/** Applies search + status + priority + assignee together. */
export function filterTasks(tasks, { search, status, priority, assignee }) {
  const term = search.trim().toLowerCase()

  return tasks.filter((task) => {
    if (term) {
      const matches =
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      if (!matches) return false
    }
    if (status !== ALL && task.status !== status) return false
    if (priority !== ALL && task.priority !== priority) return false
    if (assignee === UNASSIGNED && task.assignedTo) return false
    if (assignee !== ALL && assignee !== UNASSIGNED && task.assignedTo !== assignee) {
      return false
    }
    return true
  })
}

export function sortTasks(tasks, sortBy) {
  const sorted = [...tasks]

  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => time(a.createdAt) - time(b.createdAt))

    case 'due-date':
      // Soonest first; tasks without a due date go last.
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return byNewest(a, b)
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return time(a.dueDate) - time(b.dueDate) || byNewest(a, b)
      })

    case 'priority':
      // High first, then newest.
      return sorted.sort(
        (a, b) =>
          (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1) ||
          byNewest(a, b)
      )

    case 'newest':
    default:
      return sorted.sort(byNewest)
  }
}

/** Returns { todo: [], 'in-progress': [], done: [] }, keeping the incoming order. */
export function groupTasksByStatus(tasks) {
  const groups = Object.fromEntries(STATUSES.map((status) => [status.value, []]))

  tasks.forEach((task) => {
    // A task with an unexpected status is shown in Todo instead of disappearing.
    ;(groups[task.status] ?? groups.todo).push(task)
  })
  return groups
}

export function countByStatus(tasks, status) {
  return tasks.filter((task) => task.status === status).length
}

/** Returns { [projectId]: { total, completed } } */
export function getTaskStatsByProject(tasks) {
  return tasks.reduce((stats, task) => {
    const entry = stats[task.projectId] ?? { total: 0, completed: 0 }
    entry.total += 1
    if (task.status === 'done') entry.completed += 1
    stats[task.projectId] = entry
    return stats
  }, {})
}

/** Most recently created or updated tasks first. */
export function getRecentTasks(tasks, limit = 5) {
  const lastActivity = (task) => Math.max(time(task.updatedAt), time(task.createdAt))
  return [...tasks].sort((a, b) => lastActivity(b) - lastActivity(a)).slice(0, limit)
}