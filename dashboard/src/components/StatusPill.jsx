import { statusMeta } from '../services/profileMeta'

export function StatusPill({ status, label, className = '', dot = true }) {
  const meta = statusMeta(status)
  return (
    <span className={`status-pill status-${meta.tone} ${className}`}>
      {dot && <span className="status-dot" />}
      {label ?? meta.label}
    </span>
  )
}

export function MiniBadge({ children, tone = 'neutral', className = '' }) {
  return <span className={`status-pill status-${tone} ${className}`}>{children}</span>
}
