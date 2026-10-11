import { getPriorityLabel, getPriorityStyle } from '../../utils/taskUtils'

export default function PriorityBadge({ priority }) {
  const style = getPriorityStyle(priority)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {getPriorityLabel(priority)}
    </span>
  )
}