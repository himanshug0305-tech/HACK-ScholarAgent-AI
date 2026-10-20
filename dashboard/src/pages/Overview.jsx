import { Link } from 'react-router-dom'
import { useWorkspace } from '../context/DataContext'
import { DOCUMENT_TYPES } from '../services/storage/seed'
import {
  daysUntil,
  deadlineLabel,
  firstName,
  formatCurrency,
  formatShortDate,
  greetingFor,
  parseDate,
  pluralize,
  timeAgo,
} from '../utils/format'
import { Icon } from '../components/Icon'
import { OpportunityMiniRow } from '../components/OpportunityCard'
import { ScoreRing } from '../components/ScoreRing'
import { ProgressBar } from '../components/Feedback'

function StatBand({ opportunities, documents }) {
  const active = opportunities.filter((item) => item.status !== 'disqualified')
  const total = active.reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const strong = opportunities.filter((item) => item.status === 'eligible').length
  const ready = documents.filter((document) => document.status === 'verified').length
  const required = DOCUMENT_TYPES.filter((type) => type.required).length

  const stats = [
    { value: formatCurrency(total), label: 'within reach', detail: `across ${pluralize(active.length, 'live scheme')}` },
    { value: String(strong).padStart(2, '0'), label: 'good fits', detail: 'clear your visible criteria' },
    { value: `${ready}/${required}`, label: 'papers ready', detail: 'sitting safely in your vault' },
  ]

  return (
    <div className="mt-7 grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-baseline gap-3 py-4 sm:px-6 sm:py-5 sm:first:pl-0 sm:last:pr-0">
          <span className="min-w-[94px] font-display text-[27px] leading-none tracking-[-0.04em] text-ink sm:min-w-0">
            {stat.value}
          </span>
          <span className="text-[10.5px] leading-tight text-muted">
            <span className="block font-semibold text-ink-soft">{stat.label}</span>
            {stat.detail}
          </span>
        </div>
      ))}
    </div>
  )
}

function FeaturedBanner({ opportunity }) {
  const days = daysUntil(opportunity.deadline)

  return (
    <article className="relative flex min-h-[368px] flex-col overflow-hidden rounded-[30px] bg-forest p-6 text-ivory sm:p-8 lg:p-9">
      <div className="auth-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 -top-24 h-[300px] w-[300px] rounded-full border border-ivory/[0.07]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-4 -top-8 h-[180px] w-[180px] rounded-full border border-ivory/[0.05]" aria-hidden="true" />
      <div className="pointer-events-none absolute right-16 top-10 h-2 w-2 rounded-full bg-clay" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-12 right-8 h-1.5 w-1.5 rounded-full bg-honey" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full border border-ivory/15 bg-ivory/[0.06] px-3 py-1.5">
          <span className="relative flex h-1.5 w-1.5 text-honey">
            <span className="absolute inset-0 rounded-full bg-honey" />
            <span className="absolute -inset-1 rounded-full bg-honey/25" />
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-ivory/65">Your strongest match</span>
        </div>
        <span className="hidden rotate-[-4deg] font-display text-[15px] italic text-honey/80 sm:block">start here</span>
      </div>

      <div className="relative mt-7 flex flex-1 flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[530px]">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.17em] text-ivory/55">{opportunity.provider}</p>
          <h2 className="mt-2.5 font-display text-[32px] leading-[1.02] tracking-[-0.035em] text-ivory sm:text-[40px] lg:text-[42px]">
            {opportunity.title}
          </h2>
          <p className="mt-3.5 max-w-[430px] text-[12.5px] leading-[1.7] text-ivory/60">{opportunity.summary}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="flex items-center gap-2 text-[12px] font-semibold text-ivory">
              <Icon name="rupee" size={13} className="text-honey" />
              {formatCurrency(opportunity.amount)}
              <span className="font-normal text-ivory/55">{opportunity.amountNote}</span>
            </span>
            <span className={`flex items-center gap-1.5 text-[11px] ${days <= 14 ? 'text-[#f0b2a1]' : 'text-ivory/55'}`}>
              <Icon name="calendar" size={12} />
              {deadlineLabel(opportunity.deadline)}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to={`/opportunities/${opportunity.id}`} className="btn btn-cream btn-sm h-[42px] px-5">
              See why it fits
              <Icon name="arrow-right" size={14} />
            </Link>
            <span className="flex items-center gap-1.5 text-[10px] text-ivory/55">
              <Icon name="shield" size={12} />
              You approve the final submit
            </span>
          </div>
        </div>

        <div className="flex flex-none items-center gap-5 sm:flex-col sm:items-end sm:gap-3">
          <div className="sm:rotate-[-3deg]">
            <ScoreRing score={opportunity.score} size={106} stroke={5} tone="cream" label="match" />
          </div>
          <p className="max-w-[130px] text-right font-mono text-[8px] leading-[1.7] uppercase tracking-[0.12em] text-ivory/55">
            Every visible condition checked
          </p>
        </div>
      </div>
    </article>
  )
}

function DeadlineCard({ opportunities }) {
  const upcoming = opportunities
    .filter((item) => item.status !== 'disqualified' && (daysUntil(item.deadline) ?? -1) >= 0)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3)

  return (
    <section className="card p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Dates to hold</p>
          <h2 className="mt-1.5 font-display text-[23px] leading-tight tracking-[-0.025em]">Coming up</h2>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-moss">
          <Icon name="calendar" size={15} />
        </span>
      </div>

      <div className="mt-4">
        {upcoming.length === 0 && <p className="py-8 text-center text-[12px] text-muted">No deadlines in sight.</p>}
        {upcoming.map((opportunity, index) => {
          const date = parseDate(opportunity.deadline)
          const days = daysUntil(opportunity.deadline)
          return (
            <Link
              key={opportunity.id}
              to={`/opportunities/${opportunity.id}`}
              className={`group flex items-center gap-4 py-3.5 ${index === 0 ? '' : 'border-t border-line/70'}`}
            >
              <span className="flex h-[52px] w-[52px] flex-none flex-col items-center justify-center rounded-[14px] border border-line bg-ivory">
                <span className="font-display text-[21px] leading-none tracking-[-0.03em] text-ink">{date.getDate()}</span>
                <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.13em] text-muted">
                  {new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date)}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11.5px] font-semibold leading-snug text-ink">{opportunity.title}</span>
                <span className={`mt-1 block text-[9.5px] ${days <= 14 ? 'font-medium text-clay' : 'text-muted'}`}>
                  {days <= 14 ? `Only ${days} days left` : formatShortDate(opportunity.deadline)}
                </span>
              </span>
              <Icon name="chevron-right" size={14} className="flex-none text-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          )
        })}
      </div>

      <Link to="/opportunities" className="link-arrow mt-3 border-t border-line/70 pt-4 text-[11px]">
        All opportunities
        <Icon name="arrow-right" size={13} />
      </Link>
    </section>
  )
}

function MissingPaperCard({ documents }) {
  const presentTypes = new Set(documents.map((document) => document.type))
  const missing = DOCUMENT_TYPES.filter((type) => type.required && !presentTypes.has(type.id))
  const ready = documents.filter((document) => document.status === 'verified').length
  const requiredCount = DOCUMENT_TYPES.filter((type) => type.required).length

  if (missing.length === 0) {
    return (
      <section className="card-soft flex items-start gap-4 p-5">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-ok-soft text-ok">
          <Icon name="check" size={17} />
        </span>
        <div>
          <p className="text-[12px] font-bold text-ink">Your papers are in order.</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-muted">Every required proof is ready for application forms.</p>
        </div>
      </section>
    )
  }

  const firstMissing = missing[0]

  return (
    <section className="card-soft relative overflow-hidden p-5">
      <span className="pointer-events-none absolute -bottom-7 -right-7 h-24 w-24 rounded-full border border-line" aria-hidden="true" />
      <div className="relative flex items-start gap-4">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[12px] border border-line bg-paper text-clay">
          <Icon name="file-text" size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[8px]">One small task</p>
          <p className="mt-1 font-display text-[18px] leading-tight tracking-[-0.02em] text-ink">
            Add your {firstMissing.label.toLowerCase()}.
          </p>
          <p className="mt-1.5 text-[10.5px] leading-relaxed text-muted">
            {missing.length === 1
              ? 'One required paper is missing from your vault.'
              : `${missing.length} required papers are still missing from your vault.`}
          </p>
          <div className="mt-3.5 flex items-center justify-between gap-3">
            <div className="flex-1">
              <ProgressBar value={(ready / requiredCount) * 100} height={4} tone="forest" />
            </div>
            <Link to="/documents" className="link-arrow flex-none text-[10px]">
              Open vault
              <Icon name="arrow-right" size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Overview() {
  const { profile, opportunities, documents, lastDiscovery } = useWorkspace()
  const featured = opportunities
    .filter((item) => item.status === 'eligible')
    .sort((a, b) => b.score - a.score || new Date(a.deadline) - new Date(b.deadline))[0]
  const rest = opportunities
    .filter((item) => item.id !== featured?.id && item.status !== 'disqualified')
    .slice(0, 2)
  const reviewCount = opportunities.filter((item) => item.status === 'review').length

  return (
    <div>
      <header className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[760px]">
          <p className="eyebrow mb-3 flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-honey" />
            Your desk · a quiet overview
          </p>
          <h1 className="font-display text-[40px] leading-[1.01] tracking-[-0.04em] text-ink sm:text-[50px] lg:text-[58px]">
            {greetingFor()}, <span className="italic">{firstName(profile?.fullName)}</span>.
          </h1>
          <p className="mt-4 max-w-[550px] text-[14px] leading-[1.75] text-ink-soft">
            {reviewCount > 0
              ? `${reviewCount} ${reviewCount === 1 ? 'scheme needs' : 'schemes need'} a small look. The strongest one is already open — you can begin there.`
              : 'Your matches are in order. Start with the one that fits best, or let me look for something new.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/discover" className="btn btn-primary">
            <Icon name="sparkles" size={15} />
            Find scholarships
          </Link>
          <Link to="/opportunities" className="btn btn-secondary">
            View all
            <Icon name="arrow-up-right" size={14} />
          </Link>
        </div>
      </header>

      <StatBand opportunities={opportunities} documents={documents} />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.58fr)_minmax(300px,0.82fr)]">
        <div className="min-w-0 space-y-6">
          {featured ? (
            <FeaturedBanner opportunity={featured} />
          ) : (
            <section className="card flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ivory text-moss">
                <Icon name="sparkles" size={23} />
              </span>
              <h2 className="mt-4 font-display text-[26px] tracking-[-0.02em]">A fresh page.</h2>
              <p className="mt-2 max-w-[330px] text-[12px] leading-relaxed text-muted">
                Run a search and we’ll line up the schemes that actually fit your life.
              </p>
              <Link to="/discover" className="btn btn-primary mt-5">
                Start a search
              </Link>
            </section>
          )}

          <section className="card p-6 sm:p-7">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Also on your desk</p>
                <h2 className="mt-1.5 font-display text-[25px] leading-tight tracking-[-0.025em]">Worth a closer look</h2>
              </div>
              <Link to="/opportunities" className="link-arrow hidden text-[11px] sm:inline-flex">
                See all {opportunities.length}
                <Icon name="arrow-right" size={13} />
              </Link>
            </div>

            <div className="mt-4">
              {rest.length > 0 ? (
                rest.map((opportunity, index) => (
                  <OpportunityMiniRow key={opportunity.id} opportunity={opportunity} last={index === rest.length - 1} />
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-[12px] text-muted">Nothing else is waiting for you right now.</p>
                  <Link to="/discover" className="link-arrow mt-3 text-[11px]">
                    Look for more
                    <Icon name="arrow-right" size={13} />
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-[15px] border border-dashed border-line bg-ivory/60 px-4 py-3 sm:hidden">
              <span className="text-[10.5px] text-muted">{opportunities.length} opportunities in your file</span>
              <Link to="/opportunities" className="link-arrow text-[10px]">
                View
                <Icon name="arrow-right" size={11} />
              </Link>
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <DeadlineCard opportunities={opportunities} />
          <MissingPaperCard documents={documents} />

          <aside className="relative overflow-hidden rounded-[24px] border border-[#e8d5a9] bg-honey-soft p-6">
            <span className="pointer-events-none absolute -right-6 -top-6 font-display text-[110px] italic leading-none text-[#c99a3d]/20" aria-hidden="true">
              ”
            </span>
            <div className="relative">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8bd82] text-[#7a5a1c]">
                <Icon name="leaf" size={14} />
              </span>
              <p className="mt-4 font-display text-[19px] leading-[1.35] tracking-[-0.015em] text-[#4d3b18]">
                You don’t need to do everything today. One clear application is worth more than five half-read tabs.
              </p>
              <p className="mt-4 font-mono text-[7.5px] uppercase tracking-[0.14em] text-[#8a6c2f]">A note from your desk</p>
            </div>
          </aside>

          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-muted">
              {lastDiscovery?.lastCheckedAt ? `Last look ${timeAgo(lastDiscovery.lastCheckedAt)}` : 'No search yet'}
            </span>
            <Link to="/discover" className="flex items-center gap-1 text-[10px] font-semibold text-forest transition-opacity hover:opacity-70">
              Search again
              <Icon name="refresh" size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
