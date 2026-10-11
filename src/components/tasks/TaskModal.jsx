import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { PRIORITIES, STATUSES } from '../../utils/taskUtils'
import { parseDateInput, toDateInputValue } from '../../utils/dateUtils'
import { validateTask, TASK_TITLE_MAX, TASK_DESCRIPTION_MAX } from '../../utils/validators'

const statusOptions = STATUSES.map(({ value, label }) => ({ value, label }))
const priorityOptions = PRIORITIES.map(({ value, label }) => ({ value, label }))

// Guards against a stored value that is no longer a valid option.
const oneOf = (value, options, fallback) =>
  options.some((option) => option.value === value) ? value : fallback

function TaskForm({ task, defaultStatus, users, onSubmit, onCancel }) {
  const isEdit = Boolean(task)
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: oneOf(task?.priority, priorityOptions, 'medium'),
    status: oneOf(task?.status ?? defaultStatus, statusOptions, 'todo'),
    dueDate: toDateInputValue(task?.dueDate),
    assignedTo: task?.assignedTo ?? '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const assigneeOptions = [
    { value: '', label: 'Unassigned' },
    ...users.map((user) => ({
      value: user.id,
      label: user.email && user.email !== user.name ? `${user.name} (${user.email})` : user.name,
    })),
  ]
  // Keep the current assignee selectable even if that user can't be found anymore.
  if (form.assignedTo && !users.some((user) => user.id === form.assignedTo)) {
    assigneeOptions.push({ value: form.assignedTo, label: 'Unknown user' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateTask(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: parseDateInput(form.dueDate),
        assignedTo: form.assignedTo || null,
      })
    } catch {
      // The parent already showed an error toast. Let the user try again.
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Title"
        name="title"
        placeholder="e.g. Build login page"
        maxLength={TASK_TITLE_MAX}
        value={form.title}
        onChange={handleChange}
        error={errors.title}
      />
      <Input
        label="Description"
        name="description"
        multiline
        rows={4}
        placeholder="Add more detail (optional)"
        maxLength={TASK_DESCRIPTION_MAX}
        value={form.description}
        onChange={handleChange}
        error={errors.description}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Priority"
          name="priority"
          options={priorityOptions}
          value={form.priority}
          onChange={handleChange}
          error={errors.priority}
        />
        <Select
          label="Status"
          name="status"
          options={statusOptions}
          value={form.status}
          onChange={handleChange}
          error={errors.status}
        />
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          max="9999-12-31"
          value={form.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />
        <Select
          label="Assigned User"
          name="assignedTo"
          options={assigneeOptions}
          value={form.assignedTo}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {isEdit ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  task = null,
  defaultStatus = 'todo',
  users = [],
}) {
  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <TaskForm
        task={task}
        defaultStatus={defaultStatus}
        users={users}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}