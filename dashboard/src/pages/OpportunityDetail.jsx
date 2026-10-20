import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useWorkspace } from '../context/DataContext'
import { DOCUMENT_TYPES } from '../services/storage/seed'
import { useToast } from '../components/Toast'
import { daysUntil, deadlineLabel, formatCurrency, formatDate, timeAgo } from '../utils/format'
import { Icon } from '../components/Icon'
import { ProviderMark } from '../components/OpportunityCard'
import { ScoreRing } from '../components/ScoreRing'
import { StatusPill } from '../components/StatusPill'
import { Modal } from '../components/Modal'
import { ProgressBar } from '../components/Feedback'

function FinePrint({ opportunity }) {
  const quotes =
    opportunity.status === 'disqualified'
      ? opportunity.disqualifiers ?? []
      : (opportunity.matchRules ?? []).filter((rule) => rule.quote)

  if (!quotes.length) return null

  return (
    <section className="card mt-6 overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-7">
        <div>
          <p className="eyebrow">From the official document</p>
          <h2 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.025em]">The fine print</h2>
        </div>
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ivory text-moss">
          <Icon name="file-text" size={15} />
        </span>
      </div>

      <div className="divide-y divide-line/70 px-6 sm:px-7">
        {quotes.map((rule) => (
          <figure key={rule.citation + rule.label} className="py-5">
            <blockquote className="max-w-[700px] font-display text-[17px] italic leading-[1.55] tracking-[-0.012em] text-ink-soft sm:text-[18px]">
              “{rule.quote}”
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted">
              <span className="h-3 w-px bg-clay" />
              {rule.citation}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="flex items-start gap-2.5 border-t border-line bg-ivory/60 px-6 py-4 sm:px-7">
        <Icon name="info" size={13} className="mt-0.5 flex-none text-muted" />
        <p className="text-[10.5px] leading-[1.65] text-muted">
          Quotes are taken directly from the scheme’s published guidelines. If a portal changes its rules, the portal
          version wins.
        </p>
      </div>
    </section>
  )
}

function AttentionPanel({ opportunity, documents }) {
  if (!opportunity.attention?.length && !opportunity.disqualifiers?.length) return null

  const isDisqualified = opportunity.status === 'disqualified'
  const items = isDisqualified ? opportunity.disqualifiers : opportunity.attention
  const hasSample = opportunity.requiredDocuments?.some((type) =>
    documents.some((document) => document.type === type && document.isSample),
  )

  return (
    <section
      className={`mt-6 overflow-hidden rounded-[24px] border ${
        isDisqualified ? 'border-[#e7c3b7] bg-danger-soft/70' : 'border-[#e8d5a9] bg-honey-soft'
      }`}
    >
      <div className="flex items-start gap-4 p-5 sm:p-6">
        <span
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-full ${
            isDisqualified ? 'bg-paper/60 text-danger' : 'bg-paper/60 text-[#7c5a18]'
          }`}
        >
          <Icon name={isDisqualified ? 'x' : 'alert'} size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[8.5px]">{isDisqualified ? 'Why we set this aside' : 'What still needs you'}</p>
          <h2 className="mt-1 font-display text-[22px] leading-tight tracking-[-0.025em] text-[#3d321d]">
            {isDisqualified
              ? 'This one asks for something you don’t have.'
              : `${items.length} small ${items.length === 1 ? 'thing' : 'things'} before this is air-tight.`}
          </h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.label} className="rounded-[14px] border border-[#0000000d] bg-paper/50 p-3.5">
                <p className="text-[11.5px] font-bold text-ink">{item.label}</p>
                <p className="mt-1 text-[10.5px] leading-relaxed text-[#635d4d]">{item.detail}</p>
                <p className="mt-1.5 font-mono text-[7.5px] uppercase tracking-[0.1em] text-[#8b7b56]">{item.citation}</p>
              </div>
            ))}
          </div>
          {hasSample && !isDisqualified && (
            <p className="mt-3 text-[10px] leading-relaxed text-[#7d642f]">
              One of the papers in your vault is still a demo copy. Swap in the real document before you submit.
            </p>
          )}
          {!isDisqualified && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/documents" className="btn btn-secondary btn-sm bg-paper/70">
                Open my vault
                <Icon name="arrow-right" size={12} />
              </Link>
              <Link to="/profile" className="btn btn-ghost btn-sm text-[#6a5d42]">
                Check my profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function FormMap({ opportunity }) {
  if (!opportunity.formMap?.length) {
    return (
      <section className="card mt-6 p-6 sm:p-7">
        <p className="eyebrow">The application form</p>
        <h2 className="mt-1.5 font-display text-[24px] tracking-[-0.025em]">What it would ask</h2>
        <p className="mt-3 max-w-[500px] text-[12px] leading-relaxed text-muted">
          We didn’t map this form because the first condition already rules it out. If your living situation changes,
          this page will be ready.
        </p>
      </section>
    )
  }

  const mappedCount = opportunity.formMap.filter((field) => !field.needsYourInput).length

  return (
    <section className="card mt-6 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
        <div>
          <p className="eyebrow">The application form</p>
          <h2 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.025em]">What it will ask</h2>
          <p className="mt-1.5 max-w-[460px] text-[11px] leading-relaxed text-muted">
            These are the fields on the official form, matched to the answers already in your file.
          </p>
        </div>
        <span className="status-pill status-ok flex-none">
          <Icon name="check" size={10} strokeWidth={2.4} />
          {mappedCount} of {opportunity.formMap.length} filled
        </span>
      </div>

      <div className="px-6 sm:px-7">
        {opportunity.formMap.map((field, index) => (
          <div
            key={field.portalLabel}
            className={`grid items-center gap-1.5 py-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_auto] sm:gap-5 ${
              index === opportunity.formMap.length - 1 ? '' : 'border-b border-line/60'
            }`}
          >
            <p className="text-[10.5px] font-semibold text-muted">{field.portalLabel}</p>
            <p className={`text-[11.5px] ${field.needsYourInput ? 'italic text-muted' : 'font-medium text-ink'}`}>
              {field.value}
            </p>
            {field.needsYourInput ? (
              <span className="justify-self-start font-mono text-[7.5px] uppercase tracking-[0.1em] text-clay sm:justify-self-end">
                Your words
              </span>
            ) : (
              <span className="flex items-center gap-1 justify-self-start text-[9px] font-medium text-ok sm:justify-self-end">
                <Icon name="check-circle" size={12} />
                Matched
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-start gap-2.5 border-t border-line bg-ivory/60 px-6 py-4 sm:px-7">
        <Icon name="shield" size={13} className="mt-0.5 flex-none text-moss" />
        <p className="text-[10.5px] leading-[1.65] text-muted">
          Feel free to change any answer. Nothing is sent until you review the final page and press submit yourself.
        </p>
      </div>
    </section>
  )
}

function ApplicationModal({ opportunity, documents, open, onClose, onSave }) {
  const required = (opportunity.requiredDocuments ?? []).map((type) =>
    DOCUMENT_TYPES.find((documentType) => documentType.id === type),
  )
  const readyDocs = required.filter((type) => documents.some((document) => document.type === type?.id))
  const hasEverything = readyDocs.length === required.length
  const mappedFields = opportunity.formMap?.filter((field) => !field.needsYourInput) ?? []

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Let’s get this ready."
      description="We line up what we know. You keep the final say."
      size="md"
      footer={
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-[9.5px] text-muted">
            <Icon name="lock" size={11} />
            Nothing is submitted automatically. Ever.
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
              Not yet
            </button>
            <button type="button" onClick={onSave} className="btn btn-primary btn-sm">
              Save my place
              <Icon name="arrow-right" size={13} />
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="rounded-[16px] border border-line bg-ivory/70 p-4">
            <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-muted">Form answers</p>
            <p className="mt-1.5 font-display text-[23px] leading-none tracking-[-0.03em]">
              {mappedFields.length}
              <span className="ml-1 text-[13px] text-muted">ready</span>
            </p>
            <ProgressBar value={mappedFields.length ? 100 : 0} height={4} className="mt-3" />
          </div>
          <div className="rounded-[16px] border border-line bg-ivory/70 p-4">
            <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-muted">Papers</p>
            <p className="mt-1.5 font-display text-[23px] leading-none tracking-[-0.03em]">
              {readyDocs.length}/{required.length}
              <span className="ml-1 text-[13px] text-muted">ready</span>
            </p>
            <ProgressBar value={(readyDocs.length / Math.max(required.length, 1)) * 100} height={4} className="mt-3" />
          </div>
        </div>

        <div>
          <p className="eyebrow">What we’ll fill in</p>
          <div className="mt-3 rounded-[16px] border border-line bg-paper divide-y divide-line/60 overflow-hidden">
            {opportunity.formMap?.slice(0, 5).map((field) => (
              <div key={field.portalLabel} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <span className="min-w-0 flex-1 truncate text-[10.5px] text-muted">{field.portalLabel}</span>
                <span className="max-w-[55%] truncate text-[10.5px] font-medium text-ink">{field.value}</span>
              </div>
            ))}
            {(opportunity.formMap?.length ?? 0) > 5 && (
              <p className="px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.1em] text-muted">
                + {opportunity.formMap.length - 5} more fields already matched
              </p>
            )}
          </div>
        </div>

        {!hasEverything && (
          <div className="rounded-[16px] border border-[#e8d5a9] bg-honey-soft p-4">
            <p className="flex items-center gap-2 text-[11px] font-bold text-[#5e4518]">
              <Icon name="alert" size={14} />
              {required.length - readyDocs.length} paper{required.length - readyDocs.length === 1 ? '' : 's'} missing
            </p>
            <p className="mt-1.5 text-[10px] leading-relaxed text-[#7b6537]">
              You can save this plan now. Add the missing papers in your vault before the portal hand-off.
            </p>
          </div>
        )}

        <div className="rounded-[16px] border border-[#d5cab6] bg-ivory p-4">
          <p className="flex items-center gap-2 text-[11px] font-bold text-ink">
            <Icon name="shield" size={14} className="text-moss" />
            The final check stays with you
          </p>
          <p className="mt-1.5 text-[10px] leading-relaxed text-ink-soft">
            We pause before the last page. Check your details, enter any OTP yourself, and press submit when you’re
            ready.
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default function OpportunityDetail() {
  const { opportunityId } = useParams()
  const { opportunities, documents, saveOpportunity } = useWorkspace()
  const { showToast } = useToast()
  const [planOpen, setPlanOpen] = useState(false)
  const opportunity = opportunities.find((item) => item.id === opportunityId)

  if (!opportunity) {
    return (
      <div className="card mx-auto mt-10 max-w-xl p-10 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ivory text-muted">
          <Icon name="file" size={23} />
        </span>
        <h1 className="mt-5 font-display text-[29px] tracking-[-0.025em]">This page has moved on.</h1>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
          We couldn’t find that opportunity. It may have been closed or removed.
        </p>
        <Link to="/opportunities" className="btn btn-primary mt-6">
          Back to opportunities
        </Link>
      </div>
    )
  }

  const days = daysUntil(opportunity.deadline)
  const isDisqualified = opportunity.status === 'disqualified'
  const mappedCount = opportunity.formMap?.filter((field) => !field.needsYourInput).length ?? 0
  const requiredDocs = (opportunity.requiredDocuments ?? []).map((type) =>
    DOCUMENT_TYPES.find((documentType) => documentType.id === type),
  )
  const readyDocs = requiredDocs.filter((type) => documents.some((document) => document.type === type?.id))
  const hasSampleDocs = requiredDocs.some((type) =>
    documents.some((document) => document.type === type?.id && document.isSample),
  )

  const handleSavePlan = async () => {
    try {
      await saveOpportunity({ ...opportunity, planSavedAt: new Date().toISOString() })
      setPlanOpen(false)
      showToast({
        title: 'Your place is saved.',
        description: 'This application is waiting on your desk. Nothing has been sent.',
      })
    } catch {
      showToast({
        title: 'That didn’t save.',
        description: 'Try once more in a moment.',
        tone: 'warning',
      })
    }
  }

  return (
    <div>
      <Link to="/opportunities" className="inline-flex items-center gap-2 text-[10.5px] font-semibold text-muted transition-colors hover:text-ink">
        <Icon name="arrow-left" size={13} />
        All opportunities
      </Link>

      <div className="mt-6 flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-[760px]">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusPill status={opportunity.status} />
            <span className="font-mono text-[8.5px] uppercase tracking-[0.13em] text-muted">{opportunity.kind}</span>
            {opportunity.planSavedAt && (
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-moss">
                · Plan saved {timeAgo(opportunity.planSavedAt)}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-start gap-4 sm:gap-5">
            <div className="hidden sm:block">
              <ProviderMark opportunity={opportunity} size="lg" />
            </div>
            <div>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-muted">{opportunity.provider}</p>
              <h1 className="mt-2 font-display text-[37px] leading-[1.02] tracking-[-0.04em] text-ink sm:text-[44px] lg:text-[49px]">
                {opportunity.title}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-[640px] text-[13.5px] leading-[1.75] text-ink-soft">{opportunity.summary}</p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 text-[12px] font-semibold text-ink">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ivory text-moss">
                <Icon name="rupee" size={12} />
              </span>
              {formatCurrency(opportunity.amount)}
              <span className="font-normal text-muted">{opportunity.amountNote}</span>
            </span>
            <span className={`flex items-center gap-2 text-[11px] ${days <= 14 && !isDisqualified ? 'font-medium text-clay' : 'text-muted'}`}>
              <Icon name="calendar" size={13} />
              {deadlineLabel(opportunity.deadline)} · {formatDate(opportunity.deadline)}
            </span>
            <a
              href={opportunity.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[10.5px] font-semibold text-forest hover:underline"
            >
              Official page
              <Icon name="external" size={11} />
            </a>
          </div>
        </div>

        <div className="flex flex-none items-center gap-5 rounded-[20px] border border-line bg-paper px-5 py-4 shadow-card">
          <ScoreRing
            score={opportunity.score}
            size={78}
            stroke={5}
            tone={isDisqualified ? 'danger' : 'forest'}
            label="match"
          />
          <div>
            <p className="font-display text-[17px] leading-tight tracking-[-0.02em] text-ink">
              {isDisqualified ? 'Not the right fit' : opportunity.status === 'review' ? 'Almost there' : 'A strong fit'}
            </p>
            <p className="mt-1 max-w-[150px] text-[10px] leading-[1.55] text-muted">
              {mappedCount > 0 ? `${mappedCount} form answers already matched.` : 'Read against your profile today.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <AttentionPanel opportunity={opportunity} documents={documents} />

          {opportunity.matchRules?.length > 0 && (
            <section className="card mt-6 overflow-hidden">
              <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 sm:px-7">
                <div>
                  <p className="eyebrow">Checked against your file</p>
                  <h2 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.025em]">
                    Why this {isDisqualified ? 'still caught our eye' : 'fits you'}
                  </h2>
                </div>
                {!isDisqualified && (
                  <span className="status-pill status-ok flex-none">
                    <Icon name="check" size={10} strokeWidth={2.4} />
                    {opportunity.matchRules.length} checks passed
                  </span>
                )}
              </div>

              <div className="divide-y divide-line/70 px-6 sm:px-7">
                {opportunity.matchRules.map((rule) => (
                  <div key={rule.label} className="flex gap-3.5 py-4">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-ok-soft text-ok">
                      <Icon name="check" size={11} strokeWidth={2.3} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-ink">{rule.label}</p>
                      <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">{rule.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <FinePrint opportunity={opportunity} />
          <FormMap opportunity={opportunity} />

          <div className="mt-6 flex items-start gap-3 rounded-[20px] border border-dashed border-line bg-ivory/60 px-5 py-4">
            <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-sage text-forest">
              <Icon name="info" size={13} />
            </span>
            <p className="text-[10.5px] leading-[1.7] text-muted">
              {opportunity.note || 'Always open the official page to confirm the latest deadline and local instructions.'}
            </p>
          </div>
        </div>

        <aside className="order-first h-fit space-y-4 xl:order-none xl:sticky xl:top-7">
          <section className="card overflow-hidden">
            <div className="border-b border-line bg-ivory/50 px-5 py-4">
              <p className="eyebrow">Your next move</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-[27px] leading-none tracking-[-0.035em] text-ink">
                    {formatCurrency(opportunity.amount)}
                  </p>
                  <p className="mt-1 text-[9.5px] text-muted">{opportunity.amountNote}</p>
                </div>
                <StatusPill status={opportunity.status} dot={false} />
              </div>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10.5px] text-muted">Deadline</span>
                <span className={`text-[11px] font-semibold ${days <= 14 && !isDisqualified ? 'text-clay' : 'text-ink'}`}>
                  {deadlineLabel(opportunity.deadline)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10.5px] text-muted">Form answers</span>
                <span className="text-[11px] font-semibold text-ink">
                  {mappedCount > 0 ? `${mappedCount} mapped` : 'Not yet'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10.5px] text-muted">Papers ready</span>
                <span className="text-[11px] font-semibold text-ink">
                  {readyDocs.length} of {requiredDocs.length}
                </span>
              </div>

              <div className="h-px bg-line" />

              {isDisqualified ? (
                <>
                  <p className="text-[11px] leading-relaxed text-muted">{opportunity.nextStep}</p>
                  <Link to="/discover" className="btn btn-primary w-full">
                    Find a better fit
                    <Icon name="sparkles" size={14} />
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-[10.5px] leading-[1.7] text-ink-soft">{opportunity.nextStep}</p>
                  <button type="button" onClick={() => setPlanOpen(true)} className="btn btn-primary w-full">
                    {opportunity.planSavedAt ? 'Continue this plan' : 'Get my application ready'}
                    <Icon name="arrow-right" size={14} />
                  </button>
                  <p className="flex items-center justify-center gap-1.5 text-center text-[9px] text-muted">
                    <Icon name="shield" size={10} />
                    You approve the final submit
                  </p>
                </>
              )}
            </div>
          </section>

          <section className="card p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Papers it asks for</p>
              <Link to="/documents" className="text-[9.5px] font-semibold text-forest hover:underline">
                Open vault
              </Link>
            </div>
            <div className="mt-3 space-y-2.5">
              {requiredDocs.map((type) => {
                const document = documents.find((item) => item.type === type?.id)
                return (
                  <div key={type?.id} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${
                        document ? 'bg-ok-soft text-ok' : 'bg-honey-soft text-[#7b5a1c]'
                      }`}
                    >
                      <Icon name={document ? 'check' : 'alert'} size={10} strokeWidth={2.3} />
                    </span>
                    <span className="min-w-0 flex-1 text-[10.5px] text-ink-soft">{type?.label}</span>
                    <span className="text-[8px] font-semibold uppercase tracking-[0.08em] text-muted">
                      {document ? (document.isSample ? 'Sample' : 'Ready') : 'Missing'}
                    </span>
                  </div>
                )
              })}
              {requiredDocs.length === 0 && <p className="text-[10.5px] text-muted">No papers requested yet.</p>}
            </div>
            {hasSampleDocs && (
              <p className="mt-3.5 border-t border-line pt-3 text-[9px] leading-relaxed text-muted">
                Demo copies don’t count on a real portal. Replace them in the vault before submitting.
              </p>
            )}
          </section>

          <a
            href={opportunity.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between gap-4 rounded-[18px] border border-line bg-transparent px-5 py-4 transition-colors hover:bg-paper"
          >
            <span>
              <span className="block font-mono text-[7.5px] uppercase tracking-[0.12em] text-muted">Read it yourself</span>
              <span className="mt-1 block text-[11px] font-semibold text-ink">Official scheme page</span>
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <Icon name="arrow-up-right" size={13} />
            </span>
          </a>
        </aside>
      </div>

      <ApplicationModal
        opportunity={opportunity}
        documents={documents}
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        onSave={handleSavePlan}
      />
    </div>
  )
}
