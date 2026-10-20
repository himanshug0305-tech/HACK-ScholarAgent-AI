import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../context/DataContext'
import { OpportunityCard } from '../components/OpportunityCard'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'
import { EmptyState } from '../components/Feedback'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'eligible', label: 'Ready' },
  { id: 'review', label: 'Needs a look' },
  { id: 'disqualified', label: 'Not a fit' },
]

export default function Opportunities() {
  const { opportunities } = useWorkspace()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('match')

  const counts = useMemo(
    () => ({
      all: opportunities.length,
      eligible: opportunities.filter((item) => item.status === 'eligible').length,
      review: opportunities.filter((item) => item.status === 'review').length,
      disqualified: opportunities.filter((item) => item.status === 'disqualified').length,
    }),
    [opportunities],
  )

  const filtered = useMemo(() => {
    const base = filter === 'all' ? opportunities : opportunities.filter((item) => item.status === filter)
    return [...base].sort((a, b) => {
      if (sort === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline)
      }
      return b.score - a.score
    })
  }, [opportunities, filter, sort])

  const active = filtered.filter((item) => item.status !== 'disqualified')
  const setAside = filtered.filter((item) => item.status === 'disqualified')

  return (
    <div>
      <PageHeader
        eyebrow="Opportunities · 2026–27"
        title="Worth your time."
        description="We read the long documents so you don’t have to. Everything here has already been checked against your profile, your income, and your course."
        actions={
          <Link to="/discover" className="btn btn-primary">
            <Icon name="sparkles" size={15} />
            Find something new
          </Link>
        }
      />

      <div className="mt-9 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1" role="group" aria-label="Filter opportunities">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`inline-flex min-h-[34px] flex-none items-center gap-2 rounded-full border px-3.5 text-[10.5px] font-semibold transition-colors ${
                filter === item.id
                  ? 'border-forest bg-forest text-ivory'
                  : 'border-transparent text-muted hover:bg-paper hover:text-ink'
              }`}
            >
              {item.label}
              <span
                className={`font-mono text-[8px] ${
                  filter === item.id ? 'text-ivory/55' : 'text-muted'
                }`}
              >
                {String(counts[item.id]).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-muted">Sort</span>
          <div className="flex rounded-full border border-line bg-paper p-0.5">
            {[
              { id: 'match', label: 'Best match' },
              { id: 'deadline', label: 'Deadline' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSort(option.id)}
                aria-pressed={sort === option.id}
                className={`min-h-[29px] rounded-full px-3 text-[9.5px] font-semibold transition-colors ${
                  sort === option.id ? 'bg-ivory text-ink shadow-[0_1px_2px_rgba(24,37,31,.08)]' : 'text-muted hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7">
        {active.length > 0 && (
          <div className="grid gap-4">
            <div className="flex items-center justify-between px-1">
              <p className="eyebrow">{filter === 'eligible' ? 'Ready for you' : filter === 'review' ? 'A little attention' : 'On your desk'}</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
                {active.length} {active.length === 1 ? 'opportunity' : 'opportunities'}
              </p>
            </div>
            {active.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="card">
            <EmptyState
              icon="leaf"
              title={filter === 'all' ? 'A clean desk.' : 'Nothing in this pile.'}
              description={
                filter === 'all'
                  ? 'No opportunities yet. A quick search will give us somewhere to begin.'
                  : 'Try another filter — or run a fresh search to see what else fits.'
              }
              action={
                <Link to="/discover" className="btn btn-primary">
                  <Icon name="sparkles" size={14} />
                  Find scholarships
                </Link>
              }
            />
          </div>
        )}

        {setAside.length > 0 && (
          <section className={active.length > 0 ? 'mt-10' : 'mt-2'}>
            <div className="flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Set aside, with a reason</p>
                <p className="mt-1.5 max-w-[580px] text-[11.5px] leading-relaxed text-muted">
                  These don’t fit your situation. We keep them here so you’re never left wondering “what about that one?”
                </p>
              </div>
              <span className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted sm:mt-0">
                {setAside.length} not a fit
              </span>
            </div>
            <div className="mt-4 grid gap-3.5">
              {setAside.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} className="opacity-80 hover:opacity-100" />
              ))}
            </div>
          </section>
        )}
      </div>

      {active.length > 0 && (
        <div className="mt-9 flex flex-col items-start justify-between gap-4 rounded-[22px] border border-dashed border-line bg-ivory/60 px-5 py-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sage text-forest">
              <Icon name="leaf" size={14} />
            </span>
            <div>
              <p className="text-[11.5px] font-semibold text-ink">You don’t have to chase every listing.</p>
              <p className="mt-0.5 text-[10.5px] text-muted">
                {active.filter((item) => item.status === 'eligible').length} of these are worth opening first.
              </p>
            </div>
          </div>
          <Link to="/discover" className="link-arrow text-[11px]">
            Run another search
            <Icon name="refresh" size={12} />
          </Link>
        </div>
      )}
    </div>
  )
}
