import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  FiAlertCircle,
  FiCheckSquare,
  FiExternalLink,
  FiMove,
  FiSearch,
} from 'react-icons/fi'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import FilterTabs from '../components/common/FilterTabs'
import LoadingSpinner from '../components/common/LoadingSpinner'
import OptionsMenu from '../components/common/OptionsMenu'
import SearchBar from '../components/common/SearchBar'
import Select from '../components/common/Select'
import TaskCard from '../components/tasks/TaskCard'
import { useAuth } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '../hooks/useTasks'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { getFirestoreErrorMessage } from '../firebase/errors'
import { ALL, SORT_OPTIONS, STATUSES, countByStatus } from '../utils/taskUtils'
import { getDisplayName } from '../utils/userUtils'

export default function MyTasks() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tasks, loading, error, retry, moveTask } = useTasks()
  const { projects } = useProjects()

  const myTasks = useMemo(
    () => tasks.filter((task) => task.assignedTo === user.uid),
    [tasks, user.uid]
  )
  const { filters, setFilter, clearFilters, hasActiveFilters, visibleTasks } =
    useTaskFilters(myTasks)

  const projectNames = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects]
  )
  const me = useMemo(
    () => ({ name: getDisplayName(user), photoURL: user.photoURL }),
    [user]
  )

  const tabs = useMemo(
    () => [
      { value: ALL, label: 'All', count: myTasks.length },
      ...STATUSES.map((status) => ({
        value: status.value,
        label: status.label,
        count: countByStatus(myTasks, status.value),
      })),
    ],
    [myTasks]
  )

  const openProject = useCallback(
    (task) => navigate(`/dashboard/projects/${task.projectId}`),
    [navigate]
  )

  const handleMoveTask = useCallback(
    async (task, status) => {
      try {
        await moveTask(task.id, status)
        toast.success('Task moved successfully', { id: 'task-moved' })
      } catch (err) {
        toast.error(getFirestoreErrorMessage(err))
      }
    },
    [moveTask]
  )

  const renderMenu = useCallback(
    (task) => (
      <OptionsMenu
        label={`Options for ${task.title}`}
        items={[
          { label: 'Open project', icon: FiExternalLink, onClick: () => openProject(task) },
          ...STATUSES.filter((status) => status.value !== task.status).map((status) => ({
            label: `Move to ${status.label}`,
            icon: FiMove,
            onClick: () => handleMoveTask(task, status.value),
          })),
        ]}
      />
    ),
    [openProject, handleMoveTask]
  )

  const renderContent = () => {
    if (loading) return <LoadingSpinner label="Loading your tasks..." />

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

    if (myTasks.length === 0) {
      return (
        <EmptyState
          icon={FiCheckSquare}
          title="No tasks assigned to you."
          description="Assign a task to yourself in a project and it will show up here."
          action={
            <Button to="/dashboard/projects" variant="secondary">
              Go to Projects
            </Button>
          }
        />
      )
    }

    return (
      <>
        <div className="space-y-3">
          <FilterTabs
            label="Filter by status"
            options={tabs}
            value={filters.status}
            onChange={(value) => setFilter('status', value)}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <SearchBar
              value={filters.search}
              onChange={(value) => setFilter('search', value)}
              placeholder="Search tasks..."
              label="Search your tasks"
              className="flex-1"
            />
            <Select
              label="Sort tasks"
              hideLabel
              options={SORT_OPTIONS}
              value={filters.sortBy}
              onChange={(e) => setFilter('sortBy', e.target.value)}
              className="sm:w-48"
            />
          </div>
        </div>

        <div className="mt-6">
          {visibleTasks.length === 0 ? (
            <EmptyState
              icon={FiSearch}
              title="No matching tasks"
              description="Try a different search term or status."
              action={
                hasActiveFilters && (
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleTasks.map((task) => (
                <li key={task.id}>
                  <TaskCard
                    task={task}
                    assignee={me}
                    projectName={projectNames.get(task.projectId)}
                    menu={renderMenu(task)}
                    onOpen={openProject}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </>
    )
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">My Tasks</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Tasks assigned to you across your projects.
        </p>
      </header>

      {renderContent()}
    </div>
  )
}