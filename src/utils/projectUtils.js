export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name (A-Z)' },
]

export function getProgress(total, completed) {
  return total === 0 ? 0 : Math.round((completed / total) * 100)
}

export function filterProjects(projects, searchTerm) {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return projects
  return projects.filter(
    (project) =>
      project.name.toLowerCase().includes(term) ||
      project.description.toLowerCase().includes(term)
  )
}

export function sortProjects(projects, sortBy) {
  const time = (project) => project.createdAt?.getTime() ?? 0
  const sorted = [...projects]

  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => time(a) - time(b))
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'newest':
    default:
      return sorted.sort((a, b) => time(b) - time(a))
  }
}