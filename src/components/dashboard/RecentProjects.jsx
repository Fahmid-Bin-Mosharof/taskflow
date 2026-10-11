import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiFolder, FiPlus } from 'react-icons/fi'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import LoadingSpinner from '../common/LoadingSpinner'
import ProjectList from '../projects/ProjectList'
import { sortProjects } from '../../utils/projectUtils'

export default function RecentProjects({ projects, taskStats, loading }) {
  const recent = useMemo(() => sortProjects(projects, 'newest').slice(0, 3), [projects])

  const renderBody = () => {
    if (loading) return <LoadingSpinner label="Loading projects..." />

    if (recent.length === 0) {
      return (
        <EmptyState
          icon={FiFolder}
          title="No projects yet."
          description="Create your first project to get started."
          action={
            <Button to="/dashboard/projects">
              <FiPlus size={18} aria-hidden="true" />
              Create Project
            </Button>
          }
        />
      )
    }

    return <ProjectList projects={recent} taskStats={taskStats} />
  }

  return (
    <section className="mt-10" aria-labelledby="recent-projects-heading">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="recent-projects-heading" className="text-lg font-semibold">
          Recent Projects
        </h2>
        {recent.length > 0 && (
          <Link
            to="/dashboard/projects"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all
          </Link>
        )}
      </div>
      {renderBody()}
    </section>
  )
}