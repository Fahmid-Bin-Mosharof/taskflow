import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import CalendarGrid from '../components/calendar/CalendarGrid'
import TaskCard from '../components/tasks/TaskCard'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '../hooks/useTasks'
import { useUsers } from '../hooks/useUsers'
import { getMonthGrid, groupTasksByDay, startOfMonth } from '../utils/calendarUtils'
import {
  formatLongDate,
  formatMonthYear,
  parseDateInput,
  toDateInputValue,
} from '../utils/dateUtils'

export default function Calendar() {
  const navigate = useNavigate()
  const { tasks, loading, error, retry } = useTasks()
  const { projects } = useProjects()
  const { users, loading: usersLoading } = useUsers()

  const todayKey = toDateInputValue(new Date())
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()))
  const [selectedKey, setSelectedKey] = useState(todayKey)

  const weeks = useMemo(() => getMonthGrid(viewDate), [viewDate])
  const tasksByDay = useMemo(() => groupTasksByDay(tasks), [tasks])
  const undatedCount = useMemo(() => tasks.filter((task) => !task.dueDate).length, [tasks])

  const monthTaskCount = useMemo(
    () =>
      weeks
        .flat()
        .filter((day) => day.inMonth)
        .reduce((sum, day) => sum + (tasksByDay.get(day.key)?.length ?? 0), 0),
    [weeks, tasksByDay]
  )

  const projectNames = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects]
  )
  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])

  const getAssignee = (assignedTo) => {
    if (!assignedTo) return null
    return (
      usersById.get(assignedTo) ?? {
        name: usersLoading ? 'Loading...' : 'Unknown user',
        photoURL: '',
      }
    )
  }

  const openProject = useCallback(
    (task) => navigate(`/dashboard/projects/${task.projectId}`),
    [navigate]
  )

  const changeMonth = (delta) =>
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))

  const goToToday = () => {
    setViewDate(startOfMonth(new Date()))
    setSelectedKey(toDateInputValue(new Date()))
  }

  // Clicking a day from a neighboring month also switches to that month.
  const handleSelect = (day) => {
    setSelectedKey(day.key)
    if (!day.inMonth) setViewDate(startOfMonth(day.date))
  }

  const handleMoveSelection = (date) => {
    setSelectedKey(toDateInputValue(date))
    setViewDate(startOfMonth(date))
  }

  const monthLabel = formatMonthYear(viewDate)
  const selectedDate = parseDateInput(selectedKey)
  const selectedTasks = tasksByDay.get(selectedKey) ?? []

  const renderContent = () => {
    if (loading) return <LoadingSpinner label="Loading calendar..." />

    if (error) {
      return (
        <EmptyState
          icon={FiAlertCircle}
          title="Couldn't load your tasks"
          description={error}
          action={<Button onClick={retry}>Try again</Button>}
        />
      )
    }

    return (
      <>
        <CalendarGrid
          label={`Task due dates for ${monthLabel}`}
          weeks={weeks}
          tasksByDay={tasksByDay}
          selectedKey={selectedKey}
          todayKey={todayKey}
          onSelect={handleSelect}
          onMoveSelection={handleMoveSelection}
        />

        {tasks.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            No tasks yet. Create tasks with due dates in a project and they will appear here.
          </p>
        ) : (
          undatedCount > 0 && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {undatedCount} {undatedCount === 1 ? 'task has' : 'tasks have'} no due date and{' '}
              {undatedCount === 1 ? "isn't" : "aren't"} shown.
            </p>
          )
        )}

        <section aria-labelledby="selected-day-heading" className="mt-8">
          <h2 id="selected-day-heading" className="mb-4 text-lg font-semibold">
            {formatLongDate(selectedDate)}
          </h2>

          {selectedTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No tasks due on this day.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {selectedTasks.map((task) => (
                <li key={task.id}>
                  <TaskCard
                    task={task}
                    assignee={getAssignee(task.assignedTo)}
                    projectName={projectNames.get(task.projectId)}
                    onOpen={openProject}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </>
    )
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Calendar</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          See when your tasks are due.
        </p>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 aria-live="polite" className="text-xl font-semibold">
            {monthLabel}
          </h2>
          {!loading && !error && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {monthTaskCount} {monthTaskCount === 1 ? 'task' : 'tasks'} due this month
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Previous month"
            onClick={() => changeMonth(-1)}
          >
            <FiChevronLeft size={18} aria-hidden="true" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Next month"
            onClick={() => changeMonth(1)}
          >
            <FiChevronRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>

      {renderContent()}
    </div>
  )
}