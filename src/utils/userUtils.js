export function getDisplayName(user) {
  return user?.displayName?.trim() || user?.email?.split('@')[0] || 'there'
}

export function getFirstName(user) {
  return getDisplayName(user).split(' ')[0]
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}