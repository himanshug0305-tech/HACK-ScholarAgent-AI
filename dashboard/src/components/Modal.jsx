import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

const SIZES = {
  sm: 'max-w-[440px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[760px]',
  xl: 'max-w-[960px]',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  bodyClassName = '',
  hideClose = false,
}) {
  const titleId = useId()
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    previousFocus.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const timer = window.setTimeout(() => closeRef.current?.focus(), 20)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose?.()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-forest-deep/55 p-0 backdrop-blur-[3px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`page-in relative max-h-[92vh] w-full overflow-hidden rounded-t-[28px] border border-line bg-paper shadow-float sm:rounded-[28px] ${SIZES[size]}`}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-6 border-b border-line px-6 pb-5 pt-6 sm:px-8">
            <div>
              {title && (
                <h2 id={titleId} className="font-display text-[25px] leading-tight tracking-[-0.025em] text-ink">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1.5 max-w-[430px] text-[12.5px] leading-relaxed text-muted">{description}</p>}
            </div>
            {!hideClose && (
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="icon-btn -mr-1 -mt-1 flex-none"
                aria-label="Close this window"
              >
                <Icon name="x" size={17} />
              </button>
            )}
          </div>
        )}
        <div className={`max-h-[calc(92vh-170px)] overflow-y-auto ${bodyClassName || 'px-6 py-6 sm:px-8'}`}>
          {children}
        </div>
        {footer && <div className="border-t border-line bg-ivory px-6 py-4 sm:px-8">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
