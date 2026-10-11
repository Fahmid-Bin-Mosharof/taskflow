import ProjectCard from './ProjectCard'

/** taskStats: { [projectId]: { total, completed } } */
export default function ProjectList({ projects, taskStats = {}, onEdit, onDelete }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const stats = taskStats[project.id]
        return (
          <ProjectCard
            key={project.id}
            project={project}
            taskCount={stats?.total ?? 0}
            completedCount={stats?.completed ?? 0}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )
      })}
    </div>
  )
}