import Button from '../common/Button'
import { useAuth } from '../../hooks/useAuth'

export default function CTA() {
  const { user } = useAuth()

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center text-white shadow-lg sm:px-12">
          <h2 className="text-3xl font-bold">
            {user ? 'Welcome back!' : 'Ready to get organized?'}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-indigo-100">
            {user
              ? 'Pick up where you left off in your workspace.'
              : 'Create a free account and start managing your first project in minutes.'}
          </p>
          <div className="mt-8">
            <Button
              to={user ? '/dashboard' : '/register'}
              size="lg"
              className="bg-white! text-primary! hover:bg-indigo-50!"
            >
              {user ? 'Go to Dashboard' : 'Create Your Account'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}