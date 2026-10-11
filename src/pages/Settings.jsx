import { FiMoon, FiSun } from 'react-icons/fi'
import Avatar from '../components/common/Avatar'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { getDisplayName } from '../utils/userUtils'

const themeOptions = [
  { value: 'light', label: 'Light', description: 'Bright and clean.', icon: FiSun },
  { value: 'dark', label: 'Dark', description: 'Easier on the eyes at night.', icon: FiMoon },
]

function SettingsSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const name = getDisplayName(user)

  return (
    <div>
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Manage how TaskFlow looks and works for you.
        </p>
      </header>

      <div className="mt-8 max-w-3xl space-y-6">
        <SettingsSection
          title="Appearance"
          description="Your choice is saved on this device."
        >
          <fieldset>
            <legend className="sr-only">Theme</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {themeOptions.map(({ value, label, description, icon: Icon }) => (
                <label key={value} className="relative block cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={theme === value}
                    onChange={() => setTheme(value)}
                    className="peer sr-only"
                  />
                  <span className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary dark:border-slate-700 dark:hover:bg-slate-800">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="block text-sm text-slate-600 dark:text-slate-400">
                        {description}
                      </span>
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </SettingsSection>

        <SettingsSection title="Account">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={name} photoURL={user.photoURL} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{name}</p>
                <p className="truncate text-sm text-slate-600 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
            </div>
            <Button to="/dashboard/profile" variant="secondary">
              Edit profile
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection title="About">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            TaskFlow is a clean, focused task management workspace designed to help you organize projects, manage tasks, and track progress effortlessly. Create projects, move tasks across the board as work progresses, and watch your completion rate grow. TaskFlow works seamlessly across desktop, tablet, and mobile devices.
          </p>
        </SettingsSection>
      </div>
    </div>
  )
}