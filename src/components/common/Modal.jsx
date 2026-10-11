import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export default function Modal({ open, onClose, title, size = 'md', children }) {
  const titleId = useId()
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)

  // Keep the latest onClose without re-running the open/close effect.
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    const panel = panelRef.current

    // Focus the first field (not the close button) so typing can start immediately.
    const focusables = Array.from(panel.querySelectorAll(FOCUSABLE))
    const initial = focusables.find((el) => !el.hasAttribute('data-modal-close'))
    ;(initial ?? panel).focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab') return

      const nodes = panel.querySelectorAll(FOCUSABLE)
      if (nodes.length === 0) {
        e.preventDefault()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      onMouseDown={(e) => {
        // Only close when the press starts on the overlay itself.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`max-h-[90dvh] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl focus:outline-none dark:border-slate-800 dark:bg-slate-900 ${sizes[size]}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            data-modal-close
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-2 -mt-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}