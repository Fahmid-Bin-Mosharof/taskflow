import { FiCalendar, FiUser } from 'react-icons/fi'
import Modal from '../common/Modal'
import Button from '../common/Button'
import Avatar from '../common/Avatar'
import { formatDate, isPastDate } from '../../utils/dateUtils'
import { getPriorityLabel, getPriorityStyle, getStatus } from '../../utils/taskUtils'

function Field({ label, children }) {
    return (
        <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </dt>
            <dd className="mt-1 text-sm">{children}</dd>
        </div>
    )
}

function DetailsBody({ task, assignee, onEdit, onDelete }) {
    const status = getStatus(task.status)
    const priority = getPriorityStyle(task.priority)
    const overdue = task.status !== 'done' && isPastDate(task.dueDate)

    return (
        <div>
            <h3 className="wrap-break-word text-xl font-semibold">{task.title}</h3>
            <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm text-slate-600 dark:text-slate-400">
                {task.description || <span className="italic">No description</span>}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4">
                <Field label="Status">
                    <span className="inline-flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} aria-hidden="true" />
                        {status.label}
                    </span>
                </Field>

                <Field label="Priority">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${priority.badge}`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} aria-hidden="true" />
                        {getPriorityLabel(task.priority)}
                    </span>
                </Field>

                <Field label="Due Date">
                    {task.dueDate ? (
                        <span
                            className={`inline-flex items-center gap-1.5 ${overdue ? 'font-medium text-red-600 dark:text-red-400' : ''
                                }`}
                        >
                            <FiCalendar size={14} aria-hidden="true" />
                            {formatDate(task.dueDate)}
                            {overdue && ' (overdue)'}
                        </span>
                    ) : (
                        <span className="text-slate-500 dark:text-slate-400">No due date</span>
                    )}
                </Field>

                <Field label="Assigned To">
                    {assignee ? (
                        <span className="inline-flex items-center gap-2">
                            <Avatar name={assignee.name} photoURL={assignee.photoURL} size="xs" />
                            <span className="wrap-break-word">{assignee.name}</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <FiUser size={14} aria-hidden="true" />
                            Unassigned
                        </span>
                    )}
                </Field>

                <Field label="Created">{formatDate(task.createdAt)}</Field>
                <Field label="Updated">{formatDate(task.updatedAt)}</Field>
            </dl>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <Button onClick={() => onEdit(task)}>Edit</Button>
                <Button variant="danger" onClick={() => onDelete(task)}>
                    Delete
                </Button>
            </div>
        </div>
    )
}

/** Pass task = null to keep it closed. */
export default function TaskDetails({ task, getAssignee, onClose, onEdit, onDelete }) {
    return (
        <Modal open={Boolean(task)} onClose={onClose} title="Task details">
            {task && (
                <DetailsBody
                    task={task}
                    assignee={getAssignee(task.assignedTo)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </Modal>
    )
}