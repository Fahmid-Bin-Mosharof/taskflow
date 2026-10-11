import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'
import { getAuthErrorMessage } from '../firebase/auth'
import { validateRegister } from '../utils/validators'

const initialForm = { name: '', email: '', password: '', confirmPassword: '' }

export default function Register() {
  const { register, googleLogin } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateRegister(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    try {
      await register(form.name.trim(), form.email.trim(), form.password)
      toast.success('Account created successfully')
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      await googleLogin()
      toast.success('Login successful')
    } catch (error) {
      toast.error(getAuthErrorMessage(error))
      setGoogleLoading(false)
    }
  }

  const busy = submitting || googleLoading

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organizing your projects with TaskFlow."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit" fullWidth loading={submitting} disabled={busy}>
          Create Account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        OR
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      <Button variant="secondary" fullWidth onClick={handleGoogle} disabled={busy}>
        <FcGoogle size={20} aria-hidden="true" />
        {googleLoading ? 'Signing in...' : 'Sign up with Google'}
      </Button>
    </AuthLayout>
  )
}