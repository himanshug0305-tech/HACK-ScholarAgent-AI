import { Icon } from './Icon'

export function Spinner({ size = 16, className = '' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

export function ProgressBar({ value, tone = 'forest', className = '', height = 6, showShimmer = false }) {
  const safeValue = Math.max(0, Math.min(100, value))
  const color = {
    forest: 'bg-forest',
    clay: 'bg-clay',
    honey: 'bg-honey',
    moss: 'bg-moss',
  }[tone]

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-[#e8e1d3] ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(safeValue)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${color} transition-[width] duration-500 ease-out`}
        style={{ width: `${safeValue}%` }}
      />
      {showShimmer && safeValue > 0 && safeValue < 100 && (
        <span
          className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)]"
          style={{ animation: 'shimmer-line 1.8s ease-in-out infinite' }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export function EmptyState({ icon = 'leaf', title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}>
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-ivory text-moss">
        <Icon name={icon} size={23} />
      </span>
      <h3 className="font-display text-[23px] tracking-[-0.02em] text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-[340px] text-[12.5px] leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
