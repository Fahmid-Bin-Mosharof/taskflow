import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiFolder, FiPlus, FiAlertCircle } from 'react-icons/fi'
import Button from '../components/common/Button'
import SearchBar from '../components/common/SearchBar'
import Select from '../components/common/Select'
import EmptyState from '../components/common/EmptyState'
import ConfirmModal from '../components/common/ConfirmModal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProjectList from '../components/projects/ProjectList'
import ProjectModal from '../components/projects/ProjectModal'
import { useProjects } from '../hooks/useProjects'
import { getFirestoreErrorMessage } from '../firebase/errors'
import { SORT_OPTIONS, filterProjects, sortProjects } from '../utils/projectUtils'
import { useTasks } from '../hooks/useTasks'
import { getTaskStatsByProject } from '../utils/taskUtils'

const NO_MODAL = { type: null, project: null } // type: 'create' | 'edit' | 'delete'

export default function Projects() {
  const { projects, loading, error, retry, addProject, editProject, removeProject } =
    useProjects()
  const { tasks } = useTasks()
  const taskStats = useMemo(() => getTaskStatsByProject(tasks), [tasks])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [modal, setModal] = useState(NO_MODAL)
  const [deleting, setDeleting] = useState(false)

  

  const visibleProjects = useMemo(
    () => sortProjects(filterProjects(projects, search), sortBy),
    [projects, search, sortBy]
  )

  const closeModal = useCallback(() => setModal(NO_MODAL), [])
  const openCreate = () => setModal({ type: 'create', project: null })
  const openEdit = (project) => setModal({ type: 'edit', project })
  const openDelete = (project) => setModal({ type: 'delete', project })

  // Throws on failure so the form can re-enable its submit button.
  const handleSave = async (values) => {
    try {
      if (modal.type === 'edit') {
        await editProject(modal.project.id, values)
        toast.success('Project updated successfully')
      } else {
        await addProject(values)
        toast.success('Project created successfully')
      }
      closeModal()
    } catch (err) {
      toast.error(getFirestoreErrorMessage(err))
      throw err
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await removeProject(modal.project.id)
      toast.success('Project deleted successfully')
      closeModal()
    } catch (err) {
      toast.error(getFirestoreErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const renderContent = () => {
    if (loading) return <LoadingSpinner label="Loading projects..." />

    if (error) {
      return (
        <EmptyState
          icon={FiAlertCircle}
          title="Couldn't load your projects"
          description={error}
          action={<Button onClick={retry}>Try again</Button>}
        />
      )
    }

    if (projects.length === 0) {
      return (
        <EmptyState
          icon={FiFolder}
          title="No projects yet."
          description="Create your first project to get started."
          action={
            <Button onClick={openCreate}>
              <FiPlus size={18} aria-hidden="true" />
              Create Project
            </Button>
          }
        />
      )
    }

    return (
      <>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search projects..."
            label="Search projects"
            className="flex-1"
          />
          <Select
            label="Sort projects"
            hideLabel
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sm:w-48"
          />
        </div>

        {visibleProjects.length === 0 ? (
          <EmptyState
            icon={FiFolder}
            title="No matching projects"
            description="Try a different search term."
            action={
              <Button variant="secondary" onClick={() => setSearch('')}>
                Clear search
              </Button>
            }
          />
        ) : (
            <ProjectList projects={visibleProjects} onEdit={openEdit} onDelete={openDelete} taskStats={taskStats} />
        )}
      </>
    )
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Projects</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Create and manage your projects.
          </p>
        </div>
        <Button onClick={openCreate}>
          <FiPlus size={18} aria-hidden="true" />
          New Project
        </Button>
      </header>

      {renderContent()}

      <ProjectModal
        open={modal.type === 'create' || modal.type === 'edit'}
        project={modal.type === 'edit' ? modal.project : null}
        onClose={closeModal}
        onSubmit={handleSave}
      />

      <ConfirmModal
        open={modal.type === 'delete'}
        onClose={closeModal}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete project?"
      >
        <p>Are you sure you want to delete this project?</p>
        <p>
          All tasks in <strong>{modal.project?.name}</strong> will be deleted too. This action
          cannot be undone.
        </p>
      </ConfirmModal>
    </div>
  )
}