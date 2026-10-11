import Modal from './Modal'
import Button from './Button'

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Delete',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} title={title} size="sm">
      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">{children}</div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}