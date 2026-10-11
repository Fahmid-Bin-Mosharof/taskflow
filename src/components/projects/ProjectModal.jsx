import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import {
  validateProject,
  PROJECT_NAME_MAX,
  PROJECT_DESCRIPTION_MAX,
} from '../../utils/validators'

function ProjectForm({ project, onSubmit, onCancel }) {
  const isEdit = Boolean(project)
  const [form, setForm] = useState({
    name: project?.name ?? '',
    description: project?.description ?? '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateProject(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      await onSubmit({ name: form.name.trim(), description: form.description.trim() })
    } catch {
      // The parent already showed an error toast. Let the user try again.
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Project Name"
        name="name"
        placeholder="e.g. Portfolio Website"
        maxLength={PROJECT_NAME_MAX}
        value={form.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input
        label="Description"
        name="description"
        multiline
        rows={4}
        placeholder="What is this project about? (optional)"
        maxLength={PROJECT_DESCRIPTION_MAX}
        value={form.description}
        onChange={handleChange}
        error={errors.description}
      />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {isEdit ? 'Save Changes' : 'Create Project'}
        </Button>
      </div>
    </form>
  )
}

export default function ProjectModal({ open, onClose, onSubmit, project = null }) {
  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit Project' : 'New Project'}>
      <ProjectForm project={project} onSubmit={onSubmit} onCancel={onClose} />
    </Modal>
  )
}