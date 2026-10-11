import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { PROFILE_NAME_MAX, validateProfile } from '../../utils/validators'

export default function ProfileForm({ user, onSubmit }) {
  const savedName = user.displayName?.trim() ?? ''

  const [name, setName] = useState(savedName)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const dirty = name.trim() !== savedName

  const handleChange = (e) => {
    setName(e.target.value)
    if (errors.name) setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateProfile({ name })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      await onSubmit({ name: name.trim() })
    } catch {
      // The parent already showed an error toast.
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Display Name"
        name="name"
        autoComplete="name"
        maxLength={PROFILE_NAME_MAX}
        value={name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input label="Email" name="email" value={user.email ?? ''} readOnly disabled />
      <div className="flex justify-end pt-2">
        <Button type="submit" loading={saving} disabled={!dirty}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}