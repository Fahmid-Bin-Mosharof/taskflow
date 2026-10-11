import { lazy, Suspense, useMemo } from 'react'
import { FiAlertCircle, FiCheckCircle, FiCheckSquare, FiClock, FiFolder } from 'react-icons/fi'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import RecentProjects from '../components/dashboard/RecentProjects'
import RecentTasks from '../components/dashboard/RecentTasks'
import StatsCard from '../components/dashboard/StatsCard'
import { useAuth } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '../hooks/useTasks'
import { getGreeting } from '../utils/dateUtils'
import { countByStatus, getTaskStatsByProject } from '../utils/taskUtils'
import { getFirstName } from '../utils/userUtils'

// Recharts is large, so the charts load as a separate chunk.
const TaskStatusChart = lazy(() => import('../components/dashboard/TaskStatusChart'))
const WeeklyActivityChart = lazy(() => import('../components/dashboard/WeeklyActivityChart'))

export default function Dashboard() {
  const { user } = useAuth()
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    retry: retryProjects,
  } = useProjects()
  const { tasks, loading: tasksLoading, error: tasksError, retry: retryTasks } = useTasks()

  const taskStats = useMemo(() => getTaskStatsByProject(tasks), [tasks])
  const projectNames = useMemo(
    () => new Map(projects.map((project) => [project.id, project.name])),
    [projects]
  )

  const error = projectsError || tasksError
  const handleRetry = () => {
    if (projectsError) retryProjects()
    if (tasksError) retryTasks()
  }

  const show = (isLoading, value) => (isLoading ? '–' : value)

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">
          {getGreeting()}, {getFirstName(user)} 👋
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
        >
          <span className="flex items-center gap-2">
            <FiAlertCircle size={18} aria-hidden="true" />
            Some dashboard data couldn&apos;t be loaded. {error}
          </span>
          <Button size="sm" variant="secondary" onClick={handleRetry}>
            Try again
          </Button>
        </div>
      )}

      <section aria-label="Statistics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total Projects"
          value={show(projectsLoading, projects.length)}
          icon={FiFolder}
          tone="indigo"
        />
        <StatsCard
          label="Total Tasks"
          value={show(tasksLoading, tasks.length)}
          icon={FiCheckSquare}
          tone="blue"
        />
        <StatsCard
          label="In Progress"
          value={show(tasksLoading, countByStatus(tasks, 'in-progress'))}
          icon={FiClock}
          tone="amber"
        />
        <StatsCard
          label="Completed"
          value={show(tasksLoading, countByStatus(tasks, 'done'))}
          icon={FiCheckCircle}
          tone="emerald"
        />
      </section>

      <Suspense fallback={<LoadingSpinner label="Loading charts..." />}>
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <TaskStatusChart tasks={tasks} loading={tasksLoading} />
          </div>
          <div className="lg:col-span-3">
            <WeeklyActivityChart tasks={tasks} loading={tasksLoading} />
          </div>
        </div>
      </Suspense>

      <RecentProjects projects={projects} taskStats={taskStats} loading={projectsLoading} />
      <RecentTasks tasks={tasks} projectNames={projectNames} loading={tasksLoading} />
    </div>
  )
}