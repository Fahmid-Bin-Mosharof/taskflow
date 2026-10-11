import { useCallback, useMemo, useState } from 'react'
import { ALL, DEFAULT_FILTERS, filterTasks, sortTasks } from '../utils/taskUtils'

export function useTaskFilters(tasks) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const setFilter = useCallback(
    (key, value) => setFilters((prev) => ({ ...prev, [key]: value })),
    []
  )

  // Resets search and filters but keeps the chosen sort order.
  const clearFilters = useCallback(
    () => setFilters((prev) => ({ ...DEFAULT_FILTERS, sortBy: prev.sortBy })),
    []
  )

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.status !== ALL ||
    filters.priority !== ALL ||
    filters.assignee !== ALL

  const visibleTasks = useMemo(
    () => sortTasks(filterTasks(tasks, filters), filters.sortBy),
    [tasks, filters]
  )

  return { filters, setFilter, clearFilters, hasActiveFilters, visibleTasks }
}