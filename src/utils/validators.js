const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const isValidEmail = (email) => EMAIL_REGEX.test(email.trim())

export function validateLogin({ email, password }) {
  const errors = {}
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function validateRegister({ name, email, password, confirmPassword }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Name is required.'
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!isValidEmail(email)) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.'
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'
  return errors
}


export const PROJECT_NAME_MAX = 60
export const PROJECT_DESCRIPTION_MAX = 200

export function validateProject({ name, description }) {
  const errors = {}
  if (!name.trim()) {
    errors.name = 'Project name is required.'
  } else if (name.trim().length > PROJECT_NAME_MAX) {
    errors.name = `Project name must be ${PROJECT_NAME_MAX} characters or fewer.`
  }
  if (description.trim().length > PROJECT_DESCRIPTION_MAX) {
    errors.description = `Description must be ${PROJECT_DESCRIPTION_MAX} characters or fewer.`
  }
  return errors
}

export const TASK_TITLE_MAX = 100
export const TASK_DESCRIPTION_MAX = 500

export function validateTask({ title, description, status, priority, dueDate }) {
  const errors = {}
  if (!title.trim()) {
    errors.title = 'Task title is required.'
  } else if (title.trim().length > TASK_TITLE_MAX) {
    errors.title = `Title must be ${TASK_TITLE_MAX} characters or fewer.`
  }
  if (description.trim().length > TASK_DESCRIPTION_MAX) {
    errors.description = `Description must be ${TASK_DESCRIPTION_MAX} characters or fewer.`
  }
  if (!status) errors.status = 'Status is required.'
  if (!priority) errors.priority = 'Priority is required.'
  if (dueDate && Number.isNaN(new Date(dueDate).getTime())) {
    errors.dueDate = 'Enter a valid date.'
  }
  return errors
}

export const PROFILE_NAME_MAX = 50
export const PHOTO_URL_MAX = 2000

export function isHttpUrl(value) {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

export function validateProfile({ name }) {
  const errors = {}
  if (!name.trim()) {
    errors.name = 'Display name is required.'
  } else if (name.trim().length > PROFILE_NAME_MAX) {
    errors.name = `Name must be ${PROFILE_NAME_MAX} characters or fewer.`
  }
  return errors
}

/** Returns an error message, or '' if the URL is acceptable. */
export function validatePhotoUrl(photoURL) {
  const url = photoURL.trim()
  if (!url) return 'Enter an image URL.'
  if (url.length > PHOTO_URL_MAX) return 'That URL is too long.'
  if (!isHttpUrl(url)) return 'Enter a valid image URL starting with http:// or https://'
  return ''
}