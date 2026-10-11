import SearchBar from '../common/SearchBar'
import FilterDropdown from '../common/FilterDropdown'
import {
  PRIORITY_FILTER_OPTIONS,
  SORT_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from '../../utils/taskUtils'

export default function TaskToolbar({
  filters,
  onFilterChange,
  assigneeOptions,
  hasActiveFilters,
  onClear,
  shown,
  total,
}) {
  return (
    <div className="mb-6 space-y-3">
      <SearchBar
        value={filters.search}
        onChange={(value) => onFilterChange('search', value)}
        placeholder="Search tasks..."
        label="Search tasks"
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <FilterDropdown
          label="Status"
          value={filters.status}
          onChange={(value) => onFilterChange('status', value)}
          options={STATUS_FILTER_OPTIONS}
        />
        <FilterDropdown
          label="Priority"
          value={filters.priority}
          onChange={(value) => onFilterChange('priority', value)}
          options={PRIORITY_FILTER_OPTIONS}
        />
        <FilterDropdown
          label="Assigned to"
          value={filters.assignee}
          onChange={(value) => onFilterChange('assignee', value)}
          options={assigneeOptions}
        />
        <FilterDropdown
          label="Sort by"
          value={filters.sortBy}
          onChange={(value) => onFilterChange('sortBy', value)}
          options={SORT_OPTIONS}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <p role="status" className="text-slate-600 dark:text-slate-400">
            Showing {shown} of {total} {total === 1 ? 'task' : 'tasks'}
          </p>
          <button
            type="button"
            onClick={onClear}
            className="font-medium text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}