import { Link } from 'react-router-dom'
import { deadlineLabel, formatCompactCurrency, daysUntil } from '../utils/format'
import { Icon } from './Icon'
import { ScoreRing } from './ScoreRing'
import { StatusPill } from './StatusPill'

const KIND_STYLES = {
  'State scheme': { bg: 'bg-sage', text: 'text-forest', border: 'border-[#c9d9c9]' },
  'National scheme': { bg: 'bg-sky', text: 'text-blueink', border: 'border-[#cadbe4]' },
  'Community trust': { bg: 'bg-honey-soft', text: 'text-[#755317]', border: 'border-[#ead8a8]' },
  'Private trust': { bg: 'bg-blush', text: 'text-clay-deep', border: 'border-[#e9cdc1]' },
}

export function ProviderMark({ opportunity, size = 'md' }) {
  const style = KIND_STYLES[opportunity.kind] ?? KIND_STYLES['State scheme']
  const dimensions = size === 'lg' ? 'h-[68px] w-[68px] text-[22px]' : size === 'sm' ? 'h-10 w-10 text-[12px]' : 'h-[54px] w-[54px] text-[17px]'

  return (
    <span
      className={`relative flex flex-none items-center justify-center overflow-hidden rounded-[16px] border ${style.bg} ${style.border} ${style.text} ${dimensions}`}
      aria-hidden="true"
    >
      <span className="font-display tracking-[-0.03em]">{opportunity.providerMark || 'SA'}</span>
      <span className="absolute -bottom-3 -right-3 h-7 w-7 rounded-full border border-current opacity-20" />
    </span>
  )
}

export function OpportunityCard({ opportunity, className = '', showSummary = true }) {
  const urgent = (daysUntil(opportunity.deadline) ?? 99) <= 14 && opportunity.status !== 'disqualified'

  return (
    <Link
      to={`/opportunities/${opportunity.id}`}
      className={`group relative block overflow-hidden rounded-[24px] border border-line bg-paper p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift sm:p-6 ${className}`}
      aria-label={`Open ${opportunity.title}`}
    >
      <div className="flex items-start gap-4 sm:gap-5">
        <ProviderMark opportunity={opportunity} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">{opportunity.kind}</span>
            {opportunity.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-honey-soft px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.11em] text-[#745317]">
                <span className="h-1 w-1 rounded-full bg-honey" />
                Just found
              </span>
            )}
          </div>
          <h3 className="mt-1.5 max-w-[520px] font-display text-[21px] leading-[1.14] tracking-[-0.025em] text-ink sm:text-[23px]">
            {opportunity.title}
          </h3>
          <p className="mt-1 text-[10.5px] text-muted">{opportunity.provider}</p>

          {showSummary && (
            <p className="mt-3 line-clamp-2 max-w-[560px] text-[12px] leading-[1.65] text-ink-soft">
              {opportunity.summary}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft">
              <Icon name="rupee" size={12} className="text-moss" />
              {formatCompactCurrency(opportunity.amount)}
              <span className="font-normal text-muted">· {opportunity.amountNote}</span>
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-[10.5px] font-medium ${
                urgent ? 'text-clay' : 'text-muted'
              }`}
            >
              <Icon name="calendar" size={11} className={urgent ? 'text-clay' : 'text-muted'} />
              {deadlineLabel(opportunity.deadline)}
            </span>
          </div>
        </div>

        <div className="hidden flex-none flex-col items-end justify-between self-stretch sm:flex">
          <ScoreRing score={opportunity.score} size={58} stroke={4} tone={opportunity.status === 'disqualified' ? 'danger' : 'forest'} showLabel={false} />
          <div className="mt-3">
            <StatusPill status={opportunity.status} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line/70 pt-3 sm:hidden">
        <StatusPill status={opportunity.status} />
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-forest">
          Open
          <Icon name="arrow-up-right" size={12} />
        </span>
      </div>

    </Link>
  )
}

export function OpportunityMiniRow({ opportunity, last = false }) {
  const urgent = (daysUntil(opportunity.deadline) ?? 99) <= 14

  return (
    <Link
      to={`/opportunities/${opportunity.id}`}
      className={`group flex items-start gap-4 py-4 transition-opacity hover:opacity-80 ${last ? '' : 'border-b border-line/70'}`}
    >
      <ProviderMark opportunity={opportunity} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[7.5px] uppercase tracking-[0.13em] text-muted">{opportunity.kind}</span>
          {opportunity.isNew && <span className="h-1 w-1 rounded-full bg-honey" aria-label="New" />}
        </div>
        <h4 className="mt-0.5 truncate font-display text-[16px] leading-snug tracking-[-0.015em] text-ink">
          {opportunity.title}
        </h4>
        <p className={`mt-0.5 text-[10px] ${urgent ? 'font-medium text-clay' : 'text-muted'}`}>
          {deadlineLabel(opportunity.deadline)} · {formatCompactCurrency(opportunity.amount)}
        </p>
      </div>
      <div className="flex flex-none items-center gap-2">
        <span className="font-display text-[16px] tracking-[-0.03em] text-forest">{opportunity.score}%</span>
        <Icon name="chevron-right" size={14} className="text-muted transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}
