import { Link, useNavigate } from 'react-router-dom'
import {
  FiCalendar,
  FiCheckCircle,
  FiCheckSquare,
  FiEdit2,
  FiExternalLink,
  FiTrash2,
} from 'react-icons/fi'
import OptionsMenu from '../common/OptionsMenu'
import { formatDate } from '../../utils/dateUtils'
import { getProgress } from '../../utils/projectUtils'

export default function ProjectCard({
  project,
  taskCount = 0,
  completedCount = 0,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate()
  const projectPath = `/dashboard/projects/${project.id}`
  const progress = getProgress(taskCount, completedCount)

  const menuItems = [
    { label: 'Open', icon: FiExternalLink, onClick: () => navigate(projectPath) },
    onEdit && { label: 'Edit', icon: FiEdit2, onClick: () => onEdit(project) },
    onDelete && {
      label: 'Delete',
      icon: FiTrash2,
      danger: true,
      onClick: () => onDelete(project),
    },
  ].filter(Boolean)

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-lg font-semibold">
          <Link to={projectPath} className="block truncate hover:text-primary">
            {project.name}
          </Link>
        </h3>
        {(onEdit || onDelete) && (
          <OptionsMenu items={menuItems} label={`Options for ${project.name}`} />
        )}
      </div>

      <p className="mt-1.5 line-clamp-2 min-h-10 text-sm text-slate-600 dark:text-slate-400">
        {project.description || (
          <span className="italic text-slate-400 dark:text-slate-500">No description</span>
        )}
      </p>

      <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <FiCheckSquare size={16} aria-hidden="true" />
          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
        </span>
        <span className="flex items-center gap-1.5">
          <FiCheckCircle size={16} aria-hidden="true" />
          {completedCount} done
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-label={`${project.name} progress`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <FiCalendar size={14} aria-hidden="true" />
          {formatDate(project.createdAt)}
        </span>
        <Link
          to={projectPath}
          className="text-sm font-medium text-primary hover:underline"
          aria-label={`View project ${project.name}`}
        >
          View Project
        </Link>
      </div>
    </article>
  )
}