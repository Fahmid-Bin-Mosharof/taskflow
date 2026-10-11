import toast from 'react-hot-toast'
import { FiCalendar, FiCheckCircle, FiCheckSquare, FiFolder } from 'react-icons/fi'
import StatsCard from '../components/dashboard/StatsCard'
import ProfileForm from '../components/profile/ProfileForm'
import ProfilePhoto from '../components/profile/ProfilePhoto'
import { useAuth } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import { useTasks } from '../hooks/useTasks'
import { getAuthErrorMessage } from '../firebase/auth'
import { getFirestoreErrorMessage } from '../firebase/errors'
import { formatDate } from '../utils/dateUtils'
import { countByStatus } from '../utils/taskUtils'
import { getDisplayName } from '../utils/userUtils'

const getErrorMessage = (err) =>
  err?.code?.startsWith('auth/') ? getAuthErrorMessage(err) : getFirestoreErrorMessage(err)

export default function Profile() {
  const { user, updateProfileInfo, updatePhoto } = useAuth()
  const { projects, loading: projectsLoading } = useProjects()
  const { tasks, loading: tasksLoading } = useTasks()

  const name = getDisplayName(user)
  const created = user.createdAt ? new Date(user.createdAt) : null
  const accountCreated = created && !Number.isNaN(created.getTime()) ? formatDate(created) : '—'
  const show = (isLoading, value) => (isLoading ? '–' : value)

  // Each handler rethrows so the form or modal can re-enable its buttons.
  const handleSave = async (values) => {
    try {
      await updateProfileInfo(values)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(getErrorMessage(err))
      throw err
    }
  }

  const handleSavePhoto = async (photoURL) => {
    try {
      await updatePhoto(photoURL)
      toast.success('Profile photo updated successfully')
    } catch (err) {
      toast.error(getErrorMessage(err))
      throw err
    }
  }

  const handleRemovePhoto = async () => {
    try {
      await updatePhoto('')
      toast.success('Profile photo removed')
    } catch (err) {
      toast.error(getErrorMessage(err))
      throw err
    }
  }

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Profile</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Manage your account details.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section
          aria-label="Account summary"
          className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <ProfilePhoto
            name={name}
            photoURL={user.photoURL}
            onSave={handleSavePhoto}
            onRemove={handleRemovePhoto}
          />
          <h2 className="mt-5 wrap-break-word text-lg font-semibold">{name}</h2>
          <p className="break-all text-sm text-slate-600 dark:text-slate-400">{user.email}</p>

          <dl className="mt-6 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
            <dt className="flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <FiCalendar size={13} aria-hidden="true" />
              Account Created
            </dt>
            <dd className="mt-1">{accountCreated}</dd>
          </dl>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-5 text-lg font-semibold">Edit Profile</h2>
          <ProfileForm user={user} onSubmit={handleSave} />
        </section>
      </div>

      <section aria-label="Account statistics" className="mt-6 grid gap-4 sm:grid-cols-3">
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
          label="Completed Tasks"
          value={show(tasksLoading, countByStatus(tasks, 'done'))}
          icon={FiCheckCircle}
          tone="emerald"
        />
      </section>
    </div>
  )
}