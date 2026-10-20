import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './Icon'

const ToastContext = createContext(null)

const TONE_ICONS = {
  success: 'check-circle',
  info: 'info',
  warning: 'alert',
}

const TONE_CLASSES = {
  success: 'bg-forest text-ivory border-forest',
  info: 'bg-paper text-ink border-line-strong',
  warning: 'bg-honey-soft text-[#5f4512] border-[#e5d09a]',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const showToast = useCallback(
    ({ title, description, tone = 'success', duration = 4200 }) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
      setToasts((current) => [...current.slice(-2), { id, title, description, tone }])
      const timer = window.setTimeout(() => dismiss(id), duration)
      timers.current.set(id, timer)
      return id
    },
    [dismiss],
  )

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      timers.current.clear()
    },
    [],
  )

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex flex-col items-center gap-2.5 px-4 sm:bottom-7 sm:items-end sm:pr-8"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`page-in pointer-events-auto flex w-full max-w-[390px] items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-float ${TONE_CLASSES[toast.tone] ?? TONE_CLASSES.info}`}
            role="status"
          >
            <span className="mt-0.5 flex-none">
              <Icon name={TONE_ICONS[toast.tone] ?? 'info'} size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold leading-snug">{toast.title}</p>
              {toast.description && (
                <p className={`mt-0.5 text-[11.5px] leading-relaxed ${toast.tone === 'success' ? 'text-ivory/70' : 'text-ink-soft'}`}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="mt-0.5 flex-none opacity-60 transition-opacity hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside ToastProvider')
  return context
}
