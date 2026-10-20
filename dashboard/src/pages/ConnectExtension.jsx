import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../context/DataContext'
import { useToast } from '../components/Toast'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'
import { Spinner } from '../components/Feedback'
import { checkForExtension } from '../services/extensionBridge'
import { EXTENSION_DOWNLOAD_FILENAME, EXTENSION_DOWNLOAD_URL } from '../config/extension'

const PREVIEW_KEY = 'scholaragent_extension_preview'

const stepsList = [
  {
    number: '01',
    title: 'Add the companion',
    copy: 'Download the ZIP, unzip it, then load the folder from chrome://extensions with Developer mode on.',
    icon: 'browser',
  },
  {
    number: '02',
    title: 'Connect to this desk',
    copy: 'Open the companion once and connect it to your signed-in dashboard.',
    icon: 'puzzle',
  },
  {
    number: '03',
    title: 'Scan a scholarship page',
    copy: 'Open any official form and ask the companion to read the fields.',
    icon: 'search',
  },
]

const guardrails = [
  {
    icon: 'eye',
    title: 'One page at a time',
    copy: 'The companion only reads the page you deliberately scan. No background browsing, no wandering tabs.',
  },
  {
    icon: 'lock',
    title: 'It stops at the finish',
    copy: 'OTPs, CAPTCHAs, and the final Submit button always come back to you.',
  },
  {
    icon: 'shield',
    title: 'Your vault stays yours',
    copy: 'In this demo, profile details and papers remain in this browser. Nothing is sent to a real portal.',
  },
]

function readPreview() {
  try {
    return window.localStorage.getItem(PREVIEW_KEY) === '1'
  } catch {
    return false
  }
}

function BrowserPreview({ connected, profile }) {
  const fullName = connected ? profile?.fullName || 'Ananya Deshmukh' : 'Your name'
  const category = connected ? profile?.category || 'EWS' : 'Your category'
  const income = connected ? '₹1,80,000' : 'Your family income'

  return (
    <div className="relative overflow-hidden border-b border-line bg-[#e9e1d2] px-4 py-7 sm:px-7 sm:py-9">
      <div className="subtle-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-line-strong/50" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full border border-line-strong/35" aria-hidden="true" />

      <div className="relative mx-auto max-w-[620px]">
        <div className="overflow-hidden rounded-[18px] border border-line-strong/80 bg-paper shadow-[0_30px_70px_-35px_rgba(24,37,31,.55)]">
          <div className="flex items-center gap-3 border-b border-line bg-[#f5f0e5] px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-[#d2957f]" />
              <span className="h-2 w-2 rounded-full bg-[#e3c17e]" />
              <span className="h-2 w-2 rounded-full bg-[#9eb59f]" />
            </span>
            <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-[6px] border border-line bg-paper px-3 py-1 sm:w-[58%]">
              <Icon name="lock" size={8} className="flex-none text-ok" />
              <span className="truncate font-mono text-[7px] tracking-[0.025em] text-muted">
                scholarships.maharashtra.gov.in/apply
              </span>
            </div>
            <span className={`h-1.5 w-1.5 flex-none rounded-full ${connected ? 'bg-ok' : 'bg-line-strong'}`} />
          </div>

          <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_188px] sm:p-5">
            <div className="min-w-0">
              <p className="font-mono text-[6.5px] uppercase tracking-[0.15em] text-muted">Directorate of Technical Education</p>
              <h3 className="mt-1.5 font-display text-[21px] leading-[1.05] tracking-[-0.025em] text-ink sm:text-[24px]">
                Scholarship application
              </h3>
              <p className="mt-1 text-[8px] leading-relaxed text-muted">Part 1 of 3 · Applicant details</p>

              <div className="mt-4 space-y-2.5">
                <div>
                  <p className="font-mono text-[6.5px] uppercase tracking-[0.1em] text-muted">Full name</p>
                  <div className={`mt-1 flex h-8 items-center justify-between gap-2 rounded-[7px] border px-2.5 text-[8.5px] font-medium ${
                    connected ? 'border-[#b8d0bb] bg-ok-soft/45 text-ink' : 'border-line bg-white text-muted/70'
                  }`}>
                    <span className="truncate">{fullName}</span>
                    {connected && <Icon name="check" size={9} className="flex-none text-ok" />}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <p className="font-mono text-[6.5px] uppercase tracking-[0.1em] text-muted">Category</p>
                    <div className={`mt-1 flex h-8 items-center rounded-[7px] border px-2.5 text-[8.5px] font-medium ${
                      connected ? 'border-[#b8d0bb] bg-ok-soft/45 text-ink' : 'border-line bg-white text-muted/70'
                    }`}>
                      {category}
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-[6.5px] uppercase tracking-[0.1em] text-muted">Annual income</p>
                    <div className={`mt-1 flex h-8 items-center rounded-[7px] border px-2.5 text-[8.5px] font-medium ${
                      connected ? 'border-[#b8d0bb] bg-ok-soft/45 text-ink' : 'border-line bg-white text-muted/70'
                    }`}>
                      {income}
                    </div>
                  </div>
                </div>
                <div className="flex h-8 items-center justify-between rounded-[7px] border border-dashed border-line-strong/70 px-2.5 text-[8px] text-muted">
                  Domicile certificate
                  <span className="font-mono text-[6.5px] uppercase tracking-[0.09em]">From vault</span>
                </div>
              </div>
            </div>

            <div className={`relative self-start rounded-[13px] border p-3 shadow-[0_15px_35px_-24px_rgba(24,37,31,.55)] ${
              connected ? 'border-[#bfd0c0] bg-ivory' : 'border-line bg-ivory'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-forest text-ivory">
                    <Icon name="puzzle" size={9} />
                  </span>
                  <span className="text-[7.5px] font-bold text-ink">ScholarAgent</span>
                </div>
                <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-ok' : 'bg-line-strong'}`} />
              </div>
              <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.12em] text-muted">
                {connected ? 'Companion connected' : 'Not connected yet'}
              </p>
              <p className="mt-1 font-display text-[15px] leading-[1.2] tracking-[-0.02em] text-ink">
                {connected ? 'This form looks familiar.' : 'Ready when your desk is.'}
              </p>
              <div className="mt-2.5 space-y-1.5 border-t border-line pt-2.5">
                {[
                  [connected ? '9 fields found' : 'Waiting for a page', connected ? 'check-circle' : 'search'],
                  ['Profile ready to use', 'file-text'],
                  ['Stops before Submit', 'lock'],
                ].map(([label, icon]) => (
                  <div key={label} className="flex items-center gap-1.5 text-[7px] text-muted">
                    <Icon name={icon} size={8} className={connected && icon === 'check-circle' ? 'text-ok' : 'text-moss'} />
                    {label}
                  </div>
                ))}
              </div>
              <span className={`mt-3 flex h-7 items-center justify-center rounded-full text-[7.5px] font-bold ${
                connected ? 'bg-forest text-ivory' : 'border border-line bg-paper text-muted'
              }`}>
                {connected ? 'Fill with my file' : 'Connect to continue'}
              </span>
              <p className="mt-1.5 text-center font-mono text-[5.5px] uppercase tracking-[0.08em] text-muted">You review every field</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1">
          <span className="flex items-center gap-1.5 font-mono text-[6.5px] uppercase tracking-[0.12em] text-muted">
            <span className={`h-1 w-1 rounded-full ${connected ? 'bg-ok' : 'bg-line-strong'}`} />
            {connected ? 'Companion active · this tab' : 'Illustration · companion not connected'}
          </span>
          <span className="font-mono text-[6.5px] uppercase tracking-[0.1em] text-muted">No submit without you</span>
        </div>
      </div>
    </div>
  )
}

export default function ConnectExtension() {
  const { profile } = useWorkspace()
  const { showToast } = useToast()
  const [status, setStatus] = useState(() => (readPreview() ? 'preview' : 'idle'))

  const connected = status === 'connected' || status === 'preview'
  const checking = status === 'checking'
  const live = status === 'connected'
  const previewing = status === 'preview'

  useEffect(() => {
    if (readPreview()) return

    let cancelled = false
    checkForExtension(1600).then((found) => {
      if (!cancelled && found) setStatus('connected')
    })

    return () => {
      cancelled = true
    }
  }, [])

  const check = async () => {
    setStatus('checking')
    try {
      const found = await checkForExtension()
      if (found) {
        setStatus('connected')
        showToast({ title: 'Companion connected.', description: 'Your browser extension is ready to use.' })
      } else {
        setStatus('not-found')
      }
    } catch {
      setStatus('not-found')
    }
  }

  const preview = () => {
    try {
      window.localStorage.setItem(PREVIEW_KEY, '1')
    } catch {
      // A private browsing session can reject storage; the preview still works for this visit.
    }
    setStatus('preview')
  }

  const disconnect = () => {
    try {
      window.localStorage.removeItem(PREVIEW_KEY)
    } catch {
      // Keep disconnecting in the current view even if storage is unavailable.
    }
    setStatus('idle')
    showToast({ title: 'Preview disconnected.', description: 'You can connect again whenever you like.' })
  }

  const statusPill = connected ? (
    <span className="status-pill status-ok min-h-[36px] px-4 text-[10px]">
      <span className="status-dot" />
      {previewing ? 'Preview connected' : 'Connected'}
    </span>
  ) : (
    <span className="status-pill status-neutral min-h-[36px] px-4 text-[10px]">
      <span className="status-dot" />
      Not connected
    </span>
  )

  return (
    <div>
      <PageHeader
        eyebrow="Companion · Chrome extension"
        title="Your desk, beside the form."
        description="Bring ScholarAgent into the browser when you reach an official application. It reads the page, lines up your details, and stops before anything is sent."
        actions={statusPill}
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.65fr)]">
        <section className="card overflow-hidden">
          <BrowserPreview connected={connected} profile={profile} />

          <div className="p-6 sm:p-7">
            {connected ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="eyebrow">The companion is in</p>
                  <span className={`status-pill min-h-[23px] px-2.5 text-[8px] ${live ? 'status-ok' : 'status-info'}`}>
                    <span className="status-dot" />
                    {live ? 'Live companion' : 'Frontend preview'}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-[29px] leading-[1.08] tracking-[-0.03em] text-ink">
                  {live ? 'Connected, and keeping the last word yours.' : 'A quiet helper, right where you are.'}
                </h2>
                <p className="mt-2 max-w-[520px] text-[11.5px] leading-[1.75] text-muted">
                  {live
                    ? 'The Chrome companion is connected to this desk. Open it beside any scholarship form to read the page, check your papers, and fill only the fields you approve.'
                    : 'This preview shows how the companion appears once the Chrome extension is installed. Your profile details are mapped into the form, but the last review and submission stay with you.'}
                </p>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                  {[
                    ['Browser', 'Chrome · this device'],
                    ['Connection', live ? 'Live extension bridge' : 'Demo preview'],
                    ['Last checked', 'Just now'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[13px] border border-line bg-ivory/65 px-3.5 py-2.5">
                      <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-muted">{label}</p>
                      <p className="mt-1 text-[10px] font-semibold text-ink-soft">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {live ? (
                    <button type="button" onClick={check} disabled={checking} className="btn btn-secondary btn-sm">
                      {checking ? (
                        <>
                          <Spinner size={12} />
                          Checking
                        </>
                      ) : (
                        <>
                          <Icon name="refresh" size={12} />
                          Check again
                        </>
                      )}
                    </button>
                  ) : (
                    <button type="button" onClick={disconnect} className="btn btn-secondary btn-sm">
                      Disconnect preview
                    </button>
                  )}
                  <span className="flex items-center gap-1.5 text-[9.5px] text-muted">
                    <Icon name="lock" size={11} className="text-moss" />
                    {live ? 'Manage the connection from the companion’s Settings.' : 'Nothing is submitted from this page.'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <p className="eyebrow">A small addition to your browser</p>
                <h2 className="mt-2 font-display text-[29px] leading-[1.08] tracking-[-0.03em] text-ink">
                  {status === 'not-found' ? 'The companion hasn’t answered yet.' : 'Bring the desk to the form.'}
                </h2>
                <p className="mt-2 max-w-[520px] text-[11.5px] leading-[1.75] text-muted">
                  {status === 'not-found'
                    ? 'Make sure the ScholarAgent companion is loaded and enabled in Chrome, then try once more. You can still preview how the connected hand-off feels.'
                    : 'Load the ScholarAgent companion in Chrome, connect it to this signed-in desk, and it will be ready whenever a scholarship form appears.'}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={EXTENSION_DOWNLOAD_URL}
                    download={EXTENSION_DOWNLOAD_FILENAME}
                    className="btn btn-primary btn-sm"
                  >
                    <Icon name="download" size={13} />
                    Download extension
                  </a>
                  <button type="button" onClick={check} disabled={checking} className="btn btn-secondary btn-sm">
                    {checking ? (
                      <>
                        <Spinner size={12} />
                        Looking nearby
                      </>
                    ) : (
                      <>
                        <Icon name="puzzle" size={13} />
                        Connect extension
                      </>
                    )}
                  </button>
                  <button type="button" onClick={preview} disabled={checking} className="btn btn-ghost btn-sm text-muted">
                    Preview connected state
                    <Icon name="arrow-right" size={12} />
                  </button>
                </div>

                {status === 'not-found' && (
                  <div className="mt-5 flex items-start gap-2.5 rounded-[13px] border border-[#e7d2a2] bg-honey-soft/65 px-3.5 py-3">
                    <Icon name="info" size={13} className="mt-0.5 flex-none text-[#7b5a1c]" />
                    <p className="text-[10px] leading-[1.7] text-[#6e531f]">
                      No companion answered from this browser. Download and unzip the companion, open{' '}
                      <span className="font-mono text-[9px]">chrome://extensions</span>, turn on Developer mode, and
                      choose <span className="font-semibold">Load unpacked</span>. Then check again — or use the
                      preview to see the connected experience.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <aside className="h-fit space-y-5 xl:sticky xl:top-7">
          <section className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Setting it up</p>
                <h2 className="mt-1.5 font-display text-[22px] leading-tight tracking-[-0.025em] text-ink">Three quiet steps.</h2>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-moss">
                <Icon name="browser" size={15} />
              </span>
            </div>

            <div className="mt-4 space-y-0">
              {stepsList.map((step, index) => (
                <div key={step.number} className={`flex gap-3 py-3.5 ${index > 0 ? 'border-t border-line/70' : ''}`}>
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-line bg-ivory font-mono text-[7px] text-clay">
                    {step.number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-semibold text-ink">{step.title}</p>
                    <p className="mt-0.5 text-[9px] leading-relaxed text-muted">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-line bg-ivory/65 p-5">
            <div className="flex items-start gap-2.5">
              <Icon name="lock" size={13} className="mt-0.5 flex-none text-moss" />
              <div>
                <p className="text-[10.5px] font-semibold text-ink">A local demo, still.</p>
                <p className="mt-1 text-[9.5px] leading-[1.7] text-muted">
                  Your profile and papers are not shared with a real scholarship portal in this version.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
              <Link to="/documents" className="link-arrow text-[10px]">
                Open the vault
                <Icon name="arrow-right" size={11} />
              </Link>
              <span className="h-3 w-px bg-line" aria-hidden="true" />
              <Link to="/profile" className="link-arrow text-[10px]">
                Check your file
                <Icon name="arrow-right" size={11} />
              </Link>
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-9 border-y border-line py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[280px]">
            <p className="eyebrow">The companion’s promises</p>
            <p className="mt-2 font-display text-[22px] leading-tight tracking-[-0.025em] text-ink">
              Helpful, never in charge.
            </p>
          </div>
          <div className="grid flex-1 gap-5 sm:grid-cols-3 lg:max-w-[820px]">
            {guardrails.map((rule) => (
              <div key={rule.title}>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-moss">
                  <Icon name={rule.icon} size={12} />
                </span>
                <p className="mt-2.5 text-[10.5px] font-semibold text-ink">{rule.title}</p>
                <p className="mt-1 text-[9px] leading-[1.7] text-muted">{rule.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
