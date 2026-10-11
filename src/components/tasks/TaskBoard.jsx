import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import TaskColumn from './TaskColumn'
import TaskCard from './TaskCard'
import { STATUSES, getStatus, groupTasksByStatus } from '../../utils/taskUtils'

// Prefer the column under the pointer; fall back to the one the card overlaps most.
function detectCollisions(args) {
  const underPointer = pointerWithin(args)
  return underPointer.length > 0 ? underPointer : rectIntersection(args)
}

export default function TaskBoard({
  tasks,
  getAssignee,
  onAddTask,
  renderMenu,
  onOpenTask,
  onMoveTask,
}) {
  const grouped = useMemo(() => groupTasksByStatus(tasks), [tasks])
  const [activeId, setActiveId] = useState(null)
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeId) ?? null,
    [tasks, activeId]
  )

  const sensors = useSensors(
    // A small distance keeps plain clicks (open details) from starting a drag.
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // Long-press to drag on touch screens, so swiping still scrolls the board.
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
  )

  const titleOf = (id) => tasks.find((task) => task.id === id)?.title ?? 'Task'

  const announcements = {
    onDragStart: ({ active }) => `Picked up ${titleOf(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over ? `${titleOf(active.id)} is over ${getStatus(over.id).label}.` : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `${titleOf(active.id)} was dropped in ${getStatus(over.id).label}.`
        : `${titleOf(active.id)} was dropped outside a column.`,
    onDragCancel: ({ active }) => `Move cancelled. ${titleOf(active.id)} was not moved.`,
  }

  const handleDragStart = ({ active }) => setActiveId(active.id)
  const handleDragCancel = () => setActiveId(null)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    const task = tasks.find((item) => item.id === active.id)
    if (task && task.status !== over.id) onMoveTask(task, over.id)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={detectCollisions}
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Mobile/tablet: horizontal scroll with snap. Large screens: three equal columns. */}
      <div
        className={`-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0 ${
          activeId ? '' : 'snap-x'
        }`}
      >
        {STATUSES.map((status) => (
          <TaskColumn
            key={status.value}
            status={status}
            tasks={grouped[status.value]}
            getAssignee={getAssignee}
            onAddTask={onAddTask}
            renderMenu={renderMenu}
            onOpenTask={onOpenTask}
          />
        ))}
      </div>

      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeTask && (
            <div className="rotate-2 cursor-grabbing rounded-xl shadow-xl">
              <TaskCard task={activeTask} assignee={getAssignee(activeTask.assignedTo)} />
            </div>
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  )
}