import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../context/DataContext'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'
import { OpportunityCard } from '../components/OpportunityCard'
import { ProgressBar } from '../components/Feedback'
import { deadlineLabel, formatDate, timeAgo } from '../utils/format'

const SEARCH_STEPS = [
  {
    label: 'Looking through state notices',
    detail: 'Maharashtra, Karnataka, and Delhi directorates',
    duration: 1350,
    progress: 12,
    sources: 6,
  },
  {
    label: 'Opening the scheme documents',
    detail: 'Income ceilings, category rules, and course limits',
    duration: 1500,
    progress: 29,
    sources: 9,
  },
  {
    label: 'Visiting national schemes',
    detail: 'AICTE, UGC, and central ministry pages',
    duration: 1250,
    progress: 47,
    sources: 15,
  },
  {
    label: 'Checking trusts and foundations',
    detail: 'Smaller grants that rarely make the news',
    duration: 1350,
    progress: 66,
    sources: 21,
  },
  {
    label: 'Comparing every rule with your file',
    detail: 'Thirteen details from your profile and papers',
    duration: 1500,
    progress: 84,
    sources: 24,
  },
  {
    label: 'Sorting the shortlist',
    detail: 'Keeping what fits. Leaving out what doesn’t.',
    duration: 950,
    progress: 100,
    sources: 26,
  },
]

const SCOPE_OPTIONS = [
  {
    id: 'state',
    label: 'State schemes',
    description: 'Where you live and study',
    icon: 'map-pin',
  },
  {
    id: 'national',
    label: 'National schemes',
    description: 'AICTE, UGC, ministries',
    icon: 'graduation',
  },
  {
    id: 'trust',
    label: 'Trusts & foundations',
    description: 'Private and community grants',
    icon: 'leaf',
  },
]

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration))

function SearchConsole({ status, scope, setScope, onStart, onStop, progress, stepIndex, logs, sources, result }) {
  const [scopeError, setScopeError] = useState('')

  const toggleScope = (id) => {
    setScopeError('')
    setScope((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const start = () => {
    if (scope.length === 0) {
      setScopeError('Choose at least one place to look.')
      return
    }
    setScopeError('')
    onStart()
  }

  if (status === 'idle') {
    return (
      <section className="relative overflow-hidden rounded-[28px] border border-line bg-paper p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-line/60" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-full border border-line/40" aria-hidden="true" />
        <div className="pointer-events-none absolute right-16 top-16 h-2 w-2 rounded-full bg-clay" aria-hidden="true" />

        <div className="relative max-w-[560px]">
          <p className="eyebrow">A fresh search</p>
          <h2 className="mt-3 font-display text-[34px] leading-[1.04] tracking-[-0.035em] text-ink sm:text-[41px]">
            We’ll read the fine print
            <br />
            <span className="italic text-moss">so you don’t have to.</span>
          </h2>
          <p className="mt-4 max-w-[470px] text-[12.5px] leading-[1.75] text-ink-soft">
            Pick where it’s worth looking. We’ll visit the pages, read the guidelines, and return with only what fits
            your life.
          </p>
        </div>

        <div className="relative mt-7">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Where should we look?</p>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-muted">Choose any</span>
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            {SCOPE_OPTIONS.map((option) => {
              const selected = scope.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleScope(option.id)}
                  aria-pressed={selected}
                  className={`relative rounded-[17px] border p-4 text-left transition-all ${
                    selected
                      ? 'border-forest bg-sage/55 shadow-[inset_0_0_0_1px_rgba(23,59,47,.12)]'
                      : 'border-line bg-ivory/50 hover:border-line-strong'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${
                      selected ? 'bg-forest text-ivory' : 'border border-line bg-paper text-muted'
                    }`}
                  >
                    <Icon name={option.icon} size={14} />
                  </span>
                  <span className="mt-3 block text-[11px] font-bold text-ink">{option.label}</span>
                  <span className="mt-0.5 block text-[9px] leading-relaxed text-muted">{option.description}</span>
                  <span
                    className={`absolute right-3.5 top-3.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                      selected ? 'border-forest bg-forest text-ivory' : 'border-line-strong text-transparent'
                    }`}
                  >
                    <Icon name="check" size={8} strokeWidth={2.6} />
                  </span>
                </button>
              )
            })}
          </div>
          {scopeError && (
            <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-danger">
              <Icon name="alert" size={11} />
              {scopeError}
            </p>
          )}
        </div>

        <div className="relative mt-7 flex flex-wrap items-center gap-4 border-t border-line pt-5">
          <button type="button" onClick={start} className="btn btn-primary btn-lg">
            <Icon name="sparkles" size={16} />
            Start searching
          </button>
          <div className="flex items-center gap-2 text-[9.5px] text-muted">
            <span className="flex -space-x-1.5">
              {[1, 2, 3].map((item) => (
                <span key={item} className="flex h-5 w-5 items-center justify-center rounded-full border border-paper bg-sage text-forest">
                  <Icon name={item === 1 ? 'file-text' : item === 2 ? 'book' : 'shield'} size={8} />
                </span>
              ))}
            </span>
            Usually under a minute
          </div>
        </div>
      </section>
    )
  }

  if (status === 'running') {
    return (
      <section className="relative overflow-hidden rounded-[28px] border border-line bg-paper p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-line/60" aria-hidden="true" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-forest">
              <span className="pulse-dot relative h-1.5 w-1.5 rounded-full bg-clay" />
              Searching now
            </p>
            <h2 className="mt-2 font-display text-[30px] leading-tight tracking-[-0.03em] text-ink sm:text-[35px]">
              {stepIndex < SEARCH_STEPS.length ? SEARCH_STEPS[stepIndex].label : 'Wrapping up'}
            </h2>
            <p className="mt-1.5 text-[11px] text-muted">
              {stepIndex < SEARCH_STEPS.length ? SEARCH_STEPS[stepIndex].detail : 'Saving what deserves your attention'}
            </p>
          </div>
          <button type="button" onClick={onStop} className="btn btn-ghost btn-sm flex-none text-muted">
            <Icon name="stop" size={12} />
            Stop
          </button>
        </div>

        <div className="relative mt-7">
          <div className="flex items-end justify-between">
            <span className="font-display text-[44px] leading-none tracking-[-0.05em] text-ink">
              {progress}
              <span className="ml-0.5 font-sans text-[15px] font-medium text-muted">%</span>
            </span>
            <span className="mb-1.5 text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-muted">
              {sources} pages read
              <br />
              <span className="text-moss">No forms touched yet</span>
            </span>
          </div>
          <ProgressBar value={progress} height={7} className="mt-3" showShimmer />
        </div>

        <div className="relative mt-7 border-t border-line pt-2">
          {logs.map((step, index) => {
            const active = step.status === 'active'
            const done = step.status === 'done'
            return (
              <div key={step.label} className="flex items-start gap-3 py-2.5">
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                    done ? 'bg-ok-soft text-ok' : active ? 'bg-forest text-ivory' : 'border border-line text-muted/50'
                  }`}
                >
                  {done ? (
                    <Icon name="check" size={9} strokeWidth={2.5} />
                  ) : active ? (
                    <span className="h-2.5 w-2.5 animate-spin rounded-full border-[1.5px] border-ivory border-t-transparent" />
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-current" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-[10.5px] ${active ? 'font-semibold text-ink' : done ? 'text-ink-soft' : 'text-muted/60'}`}>
                    {step.label}
                  </p>
                  {(active || done) && <p className="mt-0.5 text-[8.5px] text-muted">{step.detail}</p>}
                </div>
                {done && <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">Read</span>}
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  // Complete
  const foundSomething = Boolean(result)

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[28px] border border-line bg-paper p-6 shadow-card sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-line/60" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[520px]">
            <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-ok">
              <Icon name="check-circle" size={12} />
              Search complete
            </span>
            <h2 className="mt-3 font-display text-[31px] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[38px]">
              {foundSomething ? 'One more possibility, found.' : 'No new pages today.'}
            </h2>
            <p className="mt-3 max-w-[460px] text-[12px] leading-[1.75] text-ink-soft">
              {foundSomething
                ? 'We read through 26 pages and found a private trust grant that lines up with your course, income, and grades.'
                : 'Everything we found is already on your desk. A clean search is still a useful one — nothing slipped through.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {foundSomething ? (
                <Link to={`/opportunities/${result.id}`} className="btn btn-primary btn-sm">
                  See why it fits
                  <Icon name="arrow-right" size={13} />
                </Link>
              ) : (
                <Link to="/opportunities" className="btn btn-primary btn-sm">
                  Review my opportunities
                  <Icon name="arrow-right" size={13} />
                </Link>
              )}
              <button
                type="button"
                onClick={onStart}
                className="btn btn-secondary btn-sm"
              >
                <Icon name="refresh" size={12} />
                Search again
              </button>
            </div>
          </div>

          <div className="grid flex-none grid-cols-3 gap-4 border-t border-line pt-4 sm:grid-cols-1 sm:gap-2 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
            {[
              ['26', 'pages read'],
              ['03', 'sources'],
              [foundSomething ? '01' : '00', 'new match'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-[22px] leading-none tracking-[-0.03em] text-ink">{value}</p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {foundSomething && <OpportunityCard opportunity={result} showSummary />}
    </div>
  )
}

export default function Discover() {
  const { lastDiscovery, discoverNewOpportunity } = useWorkspace()
  const [status, setStatus] = useState('idle')
  const [scope, setScope] = useState(['state', 'national', 'trust'])
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [logs, setLogs] = useState([])
  const [sources, setSources] = useState(0)
  const [result, setResult] = useState(undefined)
  const runToken = useRef(0)

  useEffect(
    () => () => {
      runToken.current += 1
    },
    [],
  )

  const stop = () => {
    runToken.current += 1
    setStatus('idle')
    setProgress(0)
    setStepIndex(0)
    setLogs([])
    setSources(0)
  }

  const start = async () => {
    runToken.current += 1
    const token = runToken.current
    const isCurrent = () => runToken.current === token

    setStatus('running')
    setProgress(SEARCH_STEPS[0].progress)
    setStepIndex(0)
    setSources(SEARCH_STEPS[0].sources)
    setResult(undefined)
    setLogs(SEARCH_STEPS.map((step, index) => ({ ...step, status: index === 0 ? 'active' : 'pending' })))

    for (let index = 0; index < SEARCH_STEPS.length; index += 1) {
      if (!isCurrent()) return
      const step = SEARCH_STEPS[index]
      setStepIndex(index)
      setProgress(step.progress)
      setSources(step.sources)
      setLogs((current) =>
        current.map((item, itemIndex) => ({
          ...item,
          status: itemIndex < index ? 'done' : itemIndex === index ? 'active' : 'pending',
        })),
      )

      await wait(step.duration)

      if (!isCurrent()) return
      setLogs((current) =>
        current.map((item, itemIndex) => (itemIndex === index ? { ...item, status: 'done' } : item)),
      )
    }

    if (!isCurrent()) return
    try {
      const found = await discoverNewOpportunity()
      if (!isCurrent()) return
      setResult(found)
      setStatus('done')
      setProgress(100)
    } catch {
      if (!isCurrent()) return
      setStatus('done')
      setResult(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Find aid · a fresh sweep"
        title="Let’s go looking."
        description="The good schemes are rarely in one place. We’ll wander through state notices, national pages, and small trust websites — then come back with only the ones that fit."
        actions={
          <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${status === 'running' ? 'bg-clay' : 'bg-ok'}`} />
            {status === 'running' ? 'Search in progress' : 'Ready when you are'}
          </div>
        }
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
        <div className="min-w-0">
          <SearchConsole
            status={status}
            scope={scope}
            setScope={setScope}
            onStart={start}
            onStop={stop}
            progress={progress}
            stepIndex={stepIndex}
            logs={logs}
            sources={sources}
            result={result}
          />
        </div>

        <aside className="space-y-4">
          <section className="card p-6">
            <p className="eyebrow">What we look at</p>
            <h2 className="mt-1.5 font-display text-[23px] leading-tight tracking-[-0.025em]">The whole page, not just the headline.</h2>
            <div className="mt-5 space-y-4">
              {[
                {
                  icon: 'file-text',
                  title: 'The published fine print',
                  copy: 'Income limits, category rules, course restrictions, and the conditions buried in the annexure.',
                },
                {
                  icon: 'user-round',
                  title: 'Your actual situation',
                  copy: 'Your year, CGPA, domicile, household income, and the papers already in your vault.',
                },
                {
                  icon: 'clock',
                  title: 'What’s still open',
                  copy: 'Closed windows and old notices are put aside. You only see dates you can still act on.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] border border-line bg-ivory text-moss">
                    <Icon name={item.icon} size={13} />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-bold text-ink">{item.title}</p>
                    <p className="mt-1 text-[9.5px] leading-[1.7] text-muted">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {lastDiscovery?.lastCheckedAt && status !== 'running' && (
            <section className="rounded-[20px] border border-line bg-transparent p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-muted">Last search</span>
                <span className="text-[9px] text-muted">{timeAgo(lastDiscovery.lastCheckedAt)}</span>
              </div>
              <p className="mt-2 font-display text-[17px] leading-tight tracking-[-0.02em] text-ink">
                {lastDiscovery.found ? 'A new possibility found.' : 'Everything already on your desk.'}
              </p>
              <p className="mt-1 text-[9px] text-muted">
                {formatDate(lastDiscovery.lastCheckedAt)}
              </p>
            </section>
          )}

          <aside className="relative overflow-hidden rounded-[22px] border border-[#e8d5a9] bg-honey-soft p-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8bd82] text-[#7a5a1c]">
              <Icon name="leaf" size={14} />
            </span>
            <p className="mt-3 font-display text-[17px] italic leading-[1.5] text-[#4d3b18]">
              A good match is not the one with the biggest number. It’s the one you can actually get.
            </p>
            <p className="mt-3 font-mono text-[7px] uppercase tracking-[0.12em] text-[#8a6c2f]">A note from your desk</p>
          </aside>
        </aside>
      </div>

      {result && (
        <div className="mt-5 flex items-center gap-2 px-1 text-[10px] text-muted">
          <Icon name="calendar" size={11} />
          Closes {deadlineLabel(result.deadline).replace('Closes ', '')} · {result.provider}
        </div>
      )}
    </div>
  )
}
