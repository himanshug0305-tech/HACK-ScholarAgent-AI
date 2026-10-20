import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brand } from '../components/Brand'
import { Icon } from '../components/Icon'
import { EXTENSION_DOWNLOAD_FILENAME, EXTENSION_DOWNLOAD_URL } from '../config/extension'

const flow = [
  {
    number: '01',
    title: 'Tell us once',
    icon: 'user-round',
    copy: 'Build one student file with the details every scholarship asks for. No retyping the same answers.',
    visual: 'file',
  },
  {
    number: '02',
    title: 'We go looking',
    icon: 'compass',
    copy: 'The search moves across state, national, and trust schemes, then returns with the ones that fit.',
    visual: 'search',
  },
  {
    number: '03',
    title: 'The fine print gets read',
    icon: 'file-text',
    copy: 'Income ceilings, course limits, and quiet disqualifiers are checked before they become wasted hours.',
    visual: 'rules',
  },
  {
    number: '04',
    title: 'You make the final call',
    icon: 'check-circle',
    copy: 'Application answers are prepared for your review. Nothing is submitted until you say so.',
    visual: 'approval',
  },
]

const heroMatches = [
  { name: 'State Merit & EWS Grant', meta: 'Closes 15 Nov', score: '98' },
  { name: 'Rotary Community Grant', meta: 'Closes 8 Dec', score: '92' },
  { name: 'AICTE Pragati Scholarship', meta: 'Closes 30 Nov', score: '84' },
]

const guardrails = [
  {
    icon: 'eye',
    title: 'You see the reasoning',
    copy: 'Every match comes with the conditions it cleared — and the ones that still need a look.',
  },
  {
    icon: 'lock',
    title: 'You hold the pen',
    copy: 'The companion pauses at OTPs, CAPTCHAs, and final review. It never clicks submit on your behalf.',
  },
  {
    icon: 'shield',
    title: 'Your file stays yours',
    copy: 'Profile details and papers remain in your local vault during the demo. You choose what gets shared.',
  },
]

function FileVisual() {
  return (
    <div className="rounded-[16px] border border-line bg-ivory p-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-muted">Student file</span>
        <span className="flex items-center gap-1 font-mono text-[7px] uppercase tracking-[0.08em] text-ok">
          <span className="h-1 w-1 rounded-full bg-ok" />
          Ready
        </span>
      </div>
      <div className="mt-2.5 space-y-1.5">
        {[
          ['Course', 'B.Tech · Year 3'],
          ['Domicile', 'Maharashtra'],
          ['Income', 'Under ₹2.5L'],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-2 rounded-[8px] bg-paper px-2.5 py-1.5">
            <span className="text-[8px] text-muted">{label}</span>
            <span className="text-[8px] font-semibold text-ink-soft">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SearchVisual() {
  return (
    <div className="rounded-[16px] border border-line bg-ivory p-3.5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[8px] font-semibold text-forest">
          <span className="pulse-dot relative h-1.5 w-1.5 rounded-full bg-clay" />
          Searching
        </span>
        <span className="font-mono text-[7px] uppercase tracking-[0.08em] text-muted">26 pages</span>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
        <div className="h-full w-[72%] rounded-full bg-forest" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {['graduation', 'book', 'leaf'].map((icon) => (
            <span key={icon} className="flex h-5 w-5 items-center justify-center rounded-full border border-ivory bg-sage text-forest">
              <Icon name={icon} size={8} />
            </span>
          ))}
        </div>
        <span className="text-[8px] font-medium text-muted">3 places at once</span>
      </div>
    </div>
  )
}

function RulesVisual() {
  return (
    <div className="rounded-[16px] border border-line bg-ivory p-3.5">
      <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-muted">Key conditions</p>
      <div className="mt-2.5 space-y-2">
        <div className="flex items-center gap-2 rounded-[8px] bg-paper px-2.5 py-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ok-soft text-ok">
            <Icon name="check" size={8} strokeWidth={2.6} />
          </span>
          <span className="text-[8.5px] font-medium text-ink-soft">Income under ₹2.5L</span>
        </div>
        <div className="flex items-center gap-2 rounded-[8px] bg-honey-soft/65 px-2.5 py-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-honey/30 text-[#7b5a1c]">
            <Icon name="alert" size={8} strokeWidth={2.4} />
          </span>
          <span className="text-[8.5px] font-medium text-[#6f531d]">Hostel proof needs a look</span>
        </div>
      </div>
    </div>
  )
}

function ApprovalVisual() {
  return (
    <div className="rounded-[16px] bg-forest p-3.5 text-ivory">
      <div className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.13em] text-honey">
        <Icon name="lock" size={9} />
        Human checkpoint
      </div>
      <p className="mt-2 text-[9px] leading-[1.55] text-ivory/65">Every answer is yours to review before it leaves the desk.</p>
      <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-ivory px-2.5 py-1 text-[8px] font-bold text-forest">
        You press submit
        <Icon name="arrow-right" size={8} />
      </span>
    </div>
  )
}

function FlowVisual({ type }) {
  if (type === 'file') return <FileVisual />
  if (type === 'search') return <SearchVisual />
  if (type === 'rules') return <RulesVisual />
  return <ApprovalVisual />
}

function HeroDossier() {
  return (
    <div className="relative mx-auto w-full max-w-[470px]">
      <div className="pointer-events-none absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full border border-ivory/[0.08]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-4 -top-4 h-[230px] w-[230px] rounded-full border border-ivory/[0.05]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-10 bottom-24 h-2 w-2 rounded-full bg-clay" aria-hidden="true" />

      <article className="relative rotate-[1.1deg] rounded-[26px] border border-[#e8dfce] bg-paper p-5 text-ink shadow-[0_36px_90px_-30px_rgba(4,24,17,.62)] sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <p className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-muted">Your desk · Tuesday</p>
            <p className="mt-1 font-display text-[21px] leading-none tracking-[-0.025em]">A short, honest list.</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-ivory px-2.5 py-1 font-mono text-[7px] uppercase tracking-[0.1em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            Ready
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage font-display text-[13px] text-forest">AD</span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold text-ink">Ananya’s file</p>
            <p className="mt-0.5 truncate text-[9px] text-muted">B.Tech · Third year · Maharashtra</p>
          </div>
          <span className="ml-auto shrink-0 font-mono text-[7px] uppercase tracking-[0.08em] text-ok">3 papers ready</span>
        </div>

        <p className="mt-5 font-mono text-[7px] uppercase tracking-[0.14em] text-muted">Worth opening first</p>
        <div className="mt-2 divide-y divide-line/80">
          {heroMatches.map((match) => (
            <div key={match.name} className="flex items-center gap-3 py-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-ivory font-display text-[10px] text-forest">
                {match.score}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[9.5px] font-semibold text-ink">{match.name}</p>
                <p className="mt-0.5 text-[8px] text-muted">{match.meta}</p>
              </div>
              <Icon name="chevron-right" size={11} className="shrink-0 text-muted" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] border border-line bg-ivory px-3 py-2.5">
          <span className="flex items-center gap-2 text-[8.5px] font-medium text-ink-soft">
            <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-forest text-ivory">
              <Icon name="puzzle" size={10} />
            </span>
            Companion found 9 form fields
          </span>
          <span className="whitespace-nowrap font-mono text-[6.5px] uppercase tracking-[0.08em] text-muted">Waits for you</span>
        </div>
      </article>

      <div className="relative z-10 mt-4 ml-3 w-[204px] rotate-[-3deg] rounded-[17px] border border-[#e1c98f] bg-honey-soft px-4 py-3 shadow-[0_20px_40px_-24px_rgba(0,0,0,.42)]">
        <p className="font-mono text-[6.5px] uppercase tracking-[0.14em] text-[#8a6c2f]">Your call</p>
        <p className="mt-1 font-display text-[15px] leading-[1.25] tracking-[-0.015em] text-[#4d3b18]">
          Nothing sends without you.
        </p>
      </div>
    </div>
  )
}

export default function Landing() {
  const { session } = useAuth()
  const deskPath = session ? '/dashboard' : '/login'

  return (
    <div className="min-h-screen overflow-x-clip bg-canvas">
      <section className="relative overflow-hidden bg-forest text-ivory">
        <div className="auth-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[620px] w-[620px] rounded-full border border-ivory/[0.06]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-10 h-[360px] w-[360px] rounded-full border border-ivory/[0.045]" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-28 left-[42%] h-2 w-2 rounded-full bg-clay" aria-hidden="true" />

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16">
          <header className="flex items-center justify-between gap-5 py-5 lg:py-7">
            <Link to="/" aria-label="ScholarAgent home">
              <Brand onDark />
            </Link>

            <nav className="hidden items-center gap-8 md:flex" aria-label="Front desk navigation">
              <a href="#how-it-works" className="text-[11px] font-medium text-ivory/60 transition-colors hover:text-ivory">
                How it works
              </a>
              <a href="#your-call" className="text-[11px] font-medium text-ivory/60 transition-colors hover:text-ivory">
                Your control
              </a>
            </nav>

            <Link
              to={deskPath}
              className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-ivory/20 bg-ivory/[0.06] px-4 text-[11px] font-semibold text-ivory transition-colors hover:border-ivory/35 hover:bg-ivory/10"
            >
              {session ? 'Open my desk' : 'Sign in'}
              <Icon name="arrow-up-right" size={12} />
            </Link>
          </header>

          <div className="grid gap-14 pb-20 pt-12 sm:pb-24 sm:pt-16 lg:grid-cols-[minmax(0,1.02fr)_minmax(390px,0.78fr)] lg:items-center lg:gap-12 lg:pb-28 lg:pt-20 xl:gap-20">
            <div className="max-w-[690px]">
              <p className="eyebrow eyebrow-dark flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-honey" />
                For the ones figuring it out
              </p>
              <h1 className="mt-5 font-display text-[46px] font-normal leading-[0.96] tracking-[-0.045em] text-ivory sm:text-[64px] lg:text-[70px] xl:text-[78px]">
                The scholarship hunt,
                <br />
                gathered into <em className="italic text-honey">one clear path.</em>
              </h1>
              <p className="mt-6 max-w-[505px] text-[14px] leading-[1.8] text-ivory/60 sm:text-[15px]">
                ScholarAgent finds the schemes that fit your life, reads the fine print, and keeps the paperwork
                ready. You stay the one in charge.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to={deskPath} className="btn btn-cream btn-lg">
                  {session ? 'Back to my desk' : 'Open your desk'}
                  <Icon name="arrow-right" size={15} />
                </Link>
                <a
                  href={EXTENSION_DOWNLOAD_URL}
                  download={EXTENSION_DOWNLOAD_FILENAME}
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-ivory/20 bg-ivory/[0.06] px-5 text-[12px] font-semibold text-ivory transition-colors hover:border-ivory/35 hover:bg-ivory/10"
                >
                  <Icon name="download" size={14} className="text-honey" />
                  Download companion
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-[52px] items-center gap-2 px-1 text-[12px] font-semibold text-ivory/65 transition-colors hover:text-ivory"
                >
                  See the path
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-ivory/20">
                    <Icon name="chevron-down" size={11} />
                  </span>
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[9.5px] text-ivory/40">
                <span className="flex items-center gap-1.5">
                  <Icon name="shield" size={11} className="text-honey/80" />
                  You approve every submission
                </span>
                <span className="hidden h-3 w-px bg-ivory/15 sm:block" aria-hidden="true" />
                <span className="flex items-center gap-1.5">
                  <Icon name="lock" size={11} />
                  Demo data stays on your device
                </span>
              </div>
            </div>

            <HeroDossier />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative scroll-mt-4 overflow-hidden px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="pointer-events-none absolute left-[8%] top-16 h-2 w-2 rounded-full bg-clay" aria-hidden="true" />
        <div className="mx-auto max-w-[1250px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[650px]">
              <p className="eyebrow flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-clay" />
                The path · from search to signature
              </p>
              <h2 className="mt-4 font-display text-[38px] leading-[1.01] tracking-[-0.04em] text-ink sm:text-[50px] lg:text-[56px]">
                Four quiet steps.
                <br />
                <span className="italic text-moss">One less thing on your mind.</span>
              </h2>
            </div>
            <p className="max-w-[345px] text-[12.5px] leading-[1.8] text-muted lg:pb-2">
              The work moves forward without the tab-hopping. You step in at the moments that matter, with the fine
              print already in plain sight.
            </p>
          </div>

          <div className="relative mt-14 grid gap-8 lg:grid-cols-4 lg:gap-0">
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-[21px] hidden border-t border-dashed border-line-strong lg:block" aria-hidden="true" />
            {flow.map((step, index) => (
              <article key={step.number} className="relative lg:px-5 lg:first:pl-0 lg:last:pr-0">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 flex h-[43px] w-[43px] items-center justify-center rounded-full border border-line-strong bg-paper font-display text-[13px] italic text-clay shadow-[0_0_0_7px_var(--color-canvas)]">
                    {step.number}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-moss">
                    <Icon name={step.icon} size={13} />
                  </span>
                </div>
                <h3 className="mt-5 font-display text-[23px] leading-[1.15] tracking-[-0.025em] text-ink">{step.title}</h3>
                <p className="mt-2 min-h-[66px] text-[11px] leading-[1.75] text-muted">{step.copy}</p>
                <div className="mt-4">
                  <FlowVisual type={step.visual} />
                </div>
                {index < flow.length - 1 && (
                  <span className="mt-8 flex items-center gap-2 font-mono text-[7px] uppercase tracking-[0.12em] text-line-strong lg:hidden">
                    <span className="h-px flex-1 bg-line" />
                    Then
                  </span>
                )}
              </article>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-y border-line py-5 sm:flex-row sm:items-center">
            <p className="flex items-center gap-2.5 text-[11px] font-medium text-ink-soft">
              <Icon name="lock" size={13} className="text-moss" />
              The assistant can stop anywhere. The final step is always yours.
            </p>
            <Link to={deskPath} className="link-arrow text-[11px]">
              {session ? 'Return to your desk' : 'Try the demo desk'}
              <Icon name="arrow-right" size={12} />
            </Link>
          </div>
        </div>
      </section>

      <section id="your-call" className="scroll-mt-4 px-5 pb-20 sm:px-8 lg:px-12 lg:pb-28">
        <div className="relative mx-auto max-w-[1250px] overflow-hidden rounded-[32px] bg-forest px-6 py-9 text-ivory sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="auth-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-12 -top-16 h-60 w-60 rounded-full border border-ivory/[0.08]" aria-hidden="true" />
          <div className="pointer-events-none absolute right-24 top-20 h-2 w-2 rounded-full bg-clay" aria-hidden="true" />

          <div className="relative grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow eyebrow-dark flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-honey" />
                A human checkpoint, not a handoff
              </p>
              <h2 className="mt-4 font-display text-[36px] leading-[1.02] tracking-[-0.04em] text-ivory sm:text-[46px]">
                Help with the paperwork.
                <br />
                <span className="italic text-honey">Not a hand on the final button.</span>
              </h2>
              <p className="mt-5 max-w-[420px] text-[12.5px] leading-[1.8] text-ivory/55">
                ScholarAgent is built to get you to a clear, finished application without ever taking the decision
                away from you.
              </p>
              <span className="mt-7 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border border-dashed border-honey/50 px-4 py-2 font-mono text-[7.5px] uppercase tracking-[0.16em] text-honey">
                <Icon name="lock" size={10} />
                Human review required
              </span>
            </div>

            <div className="divide-y divide-ivory/10 border-y border-ivory/10">
              {guardrails.map((item, index) => (
                <div key={item.title} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0 sm:gap-5">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ivory/15 text-honey">
                    <Icon name={item.icon} size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[7px] uppercase tracking-[0.12em] text-ivory/30">0{index + 1}</span>
                      <h3 className="text-[12px] font-semibold text-ivory">{item.title}</h3>
                    </div>
                    <p className="mt-1.5 text-[10.5px] leading-[1.7] text-ivory/50">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line bg-canvas px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1250px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Brand compact />
            <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
            <span className="hidden font-mono text-[7.5px] uppercase tracking-[0.14em] text-muted sm:block">
              A calmer scholarship desk
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-medium text-muted">
            <a href="#how-it-works" className="transition-colors hover:text-ink">
              How it works
            </a>
            <Link to="/login" className="transition-colors hover:text-ink">
              Sign in
            </Link>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-muted/70">© 2026 ScholarAgent</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
