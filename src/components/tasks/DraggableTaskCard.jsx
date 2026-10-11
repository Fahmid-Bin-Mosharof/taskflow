import { useDraggable } from '@dnd-kit/core'
import TaskCard from './TaskCard'

export default function DraggableTaskCard({ task, ...cardProps }) {
  const { setNodeRef, listeners, isDragging } = useDraggable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      className={`touch-manipulation select-none transition-opacity ${
        isDragging ? 'opacity-40' : ''
      }`}
    >
      <TaskCard task={task} {...cardProps} />
    </div>
  )
}