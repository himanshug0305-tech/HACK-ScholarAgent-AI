import { useEffect, useMemo, useRef, useState } from 'react'
import { useWorkspace } from '../context/DataContext'
import { DOCUMENT_TYPES } from '../services/storage/seed'
import { useToast } from '../components/Toast'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'
import { Modal } from '../components/Modal'
import { ProgressBar } from '../components/Feedback'
import { formatDate, formatFileSize } from '../utils/format'

const ACCENTS = {
  income: { text: 'text-clay', bg: 'bg-blush', border: 'border-[#e9cdc1]', line: 'bg-[#e5c9bc]' },
  domicile: { text: 'text-forest', bg: 'bg-sage', border: 'border-[#c9d9c9]', line: 'bg-[#c8d9c8]' },
  marksheet: { text: 'text-blueink', bg: 'bg-sky', border: 'border-[#cadbe4]', line: 'bg-[#c9dce6]' },
  id: { text: 'text-[#8a621b]', bg: 'bg-honey-soft', border: 'border-[#ead8a8]', line: 'bg-[#e7d4a2]' },
  other: { text: 'text-moss', bg: 'bg-[#e9eee8]', border: 'border-[#d3ddd2]', line: 'bg-[#d2ddd1]' },
}

const typeFor = (id) => DOCUMENT_TYPES.find((type) => type.id === id) ?? DOCUMENT_TYPES[4]

function DocumentSheet({ document, className = '' }) {
  const type = typeFor(document.type)
  const accent = ACCENTS[document.type] ?? ACCENTS.other

  return (
    <div
      className={`relative flex h-[112px] w-[86px] flex-none flex-col overflow-hidden rounded-[7px] border border-line bg-[#fffdf7] p-2.5 shadow-[0_8px_20px_-12px_rgba(24,37,31,.4)] ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between">
        <span className={`h-2 w-2 rounded-full ${accent.bg}`} />
        <span className="font-mono text-[4.5px] uppercase tracking-[0.12em] text-[#a39a88]">Vault copy</span>
      </div>
      <div className="mt-3 space-y-[3px]">
        <div className="h-[2px] w-8 rounded-full bg-[#332f26]/50" />
        <div className={`h-[2px] w-11 rounded-full ${accent.line}`} />
        <div className={`h-[2px] w-9 rounded-full ${accent.line}`} />
      </div>
      <div className={`mt-auto flex h-7 w-7 items-center justify-center rounded-full border ${accent.border} ${accent.bg} ${accent.text}`}>
        <Icon name="file" size={11} />
      </div>
      <span className="absolute bottom-2.5 right-2 font-mono text-[4px] uppercase tracking-[0.08em] text-[#b3aa99]">2026</span>
      {document.isSample && (
        <span className="absolute right-[-18px] top-[22px] rotate-45 bg-honey px-5 py-[2px] text-center font-mono text-[4px] uppercase tracking-[0.1em] text-[#5e4410]">
          Sample
        </span>
      )}
    </div>
  )
}

function UploadZone({ onPick, className = '' }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)

  const handleFiles = (files) => {
    const file = files?.[0]
    if (file) onPick(file)
  }

  const openPicker = () => inputRef.current?.click()

  return (
    <section
      className={`relative flex min-h-[246px] flex-col justify-between overflow-hidden rounded-[26px] border-2 border-dashed p-6 transition-colors sm:p-7 ${
        dragging ? 'border-forest bg-sage/70' : 'border-[#cfc4b0] bg-ivory/60'
      } ${className}`}
      onDragEnter={(event) => {
        event.preventDefault()
        dragDepth.current += 1
        setDragging(true)
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault()
        dragDepth.current -= 1
        if (dragDepth.current <= 0) {
          dragDepth.current = 0
          setDragging(false)
        }
      }}
      onDrop={(event) => {
        event.preventDefault()
        dragDepth.current = 0
        setDragging(false)
        handleFiles(event.dataTransfer.files)
      }}
    >
      <div className="upload-pattern pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full border border-line/50" aria-hidden="true" />

      <div className="relative flex items-start justify-between gap-5">
        <div>
          <p className="eyebrow">Add to the vault</p>
          <h2 className="mt-2 max-w-[320px] font-display text-[27px] leading-[1.1] tracking-[-0.03em] text-ink">
            Have a paper to put away?
          </h2>
          <p className="mt-2 max-w-[330px] text-[11.5px] leading-[1.7] text-muted">
            Drop a clear photo or a PDF. We’ll read the name and dates, then keep it ready for every form.
          </p>
        </div>
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-line bg-paper text-forest shadow-sm">
          <Icon name="upload-cloud" size={18} />
        </span>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-3">
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              openPicker()
            }
          }}
          className="btn btn-primary"
        >
          <Icon name="paperclip" size={14} />
          Choose a file
        </div>
        <span className="text-[10px] text-muted">or drop it right here</span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
          aria-label="Choose a document to upload"
        />
      </div>

      <div className="relative mt-5 flex items-center gap-2 border-t border-line/70 pt-3.5">
        <Icon name="lock" size={11} className="text-moss" />
        <p className="text-[9px] text-muted">PDF, JPG, PNG · up to 10 MB · stays on this device</p>
      </div>
    </section>
  )
}

function ReadinessCard({ documents, onAdd, onPreview }) {
  const required = DOCUMENT_TYPES.filter((type) => type.required)
  const ready = required.filter((type) => documents.some((document) => document.type === type.id))
  const sampleCount = documents.filter((document) => document.isSample).length

  return (
    <section className="card flex flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Ready for forms</p>
          <p className="mt-2 font-display text-[30px] leading-none tracking-[-0.04em] text-ink">
            {ready.length}
            <span className="mx-1 text-[18px] text-muted">of</span>
            {required.length}
          </p>
          <p className="mt-1.5 text-[10.5px] text-muted">required papers in place</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-moss">
          <Icon name="shield" size={17} />
        </span>
      </div>

      <ProgressBar value={(ready.length / required.length) * 100} height={5} className="mt-5" />

      <div className="mt-5 divide-y divide-line/70">
        {required.map((type) => {
          const document = documents.find((item) => item.type === type.id)
          return (
            <div key={type.id} className="flex items-center gap-3 py-2.5">
              <span
                className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${
                  document ? 'bg-ok-soft text-ok' : 'border border-dashed border-line-strong text-muted'
                }`}
              >
                <Icon name={document ? 'check' : 'plus'} size={10} strokeWidth={2.3} />
              </span>
              <span className="min-w-0 flex-1 text-[10.5px] font-medium text-ink-soft">{type.label}</span>
              {document ? (
                <button
                  type="button"
                  onClick={() => onPreview(document)}
                  className="text-[9px] font-semibold text-moss transition-colors hover:text-forest"
                >
                  View
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onAdd(type.id)}
                  className="text-[9px] font-bold text-clay transition-colors hover:text-clay-deep"
                >
                  Add
                </button>
              )}
            </div>
          )
        })}
      </div>

      {sampleCount > 0 && (
        <div className="mt-auto flex items-start gap-2 border-t border-line pt-4">
          <Icon name="info" size={12} className="mt-0.5 flex-none text-muted" />
          <p className="text-[9px] leading-[1.6] text-muted">
            Some copies here are demo samples. Swap in the real documents before an actual submission.
          </p>
        </div>
      )}
    </section>
  )
}

function DocumentCard({ document, onPreview, onDelete }) {
  const type = typeFor(document.type)

  return (
    <article className="group flex gap-4 rounded-[22px] border border-line bg-paper p-4 transition-all duration-200 hover:border-line-strong hover:shadow-card">
      <button
        type="button"
        onClick={() => onPreview(document)}
        className="relative flex-none rounded-[8px] transition-transform duration-200 group-hover:-rotate-1"
        aria-label={`Preview ${type.label}`}
      >
        <DocumentSheet document={document} />
        <span className="absolute inset-0 flex items-center justify-center rounded-[7px] bg-forest/0 text-transparent transition-colors group-hover:bg-forest/45 group-hover:text-ivory">
          <Icon name="eye" size={17} />
        </span>
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="status-pill status-ok min-h-[23px] px-2 text-[8.5px]">
            <Icon name="check" size={9} strokeWidth={2.4} />
            Verified
          </span>
          {document.isSample && (
            <span className="status-pill status-review min-h-[23px] px-2 text-[8px]">Demo copy</span>
          )}
        </div>
        <button type="button" onClick={() => onPreview(document)} className="mt-2 text-left">
          <h3 className="font-display text-[18px] leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-forest">
            {type.label}
          </h3>
        </button>
        <p className="mt-1 truncate text-[9.5px] text-muted" title={document.fileName}>
          {document.fileName}
        </p>
        <p className="mt-0.5 text-[8.5px] text-muted">
          {formatFileSize(document.size)} · Added {formatDate(document.uploadedAt, { day: 'numeric', month: 'short' })}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <button
            type="button"
            onClick={() => onPreview(document)}
            className="inline-flex items-center gap-1.5 text-[9.5px] font-semibold text-forest hover:underline"
          >
            <Icon name="eye" size={11} />
            View paper
          </button>
          <button
            type="button"
            onClick={() => onDelete(document)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger-soft hover:text-danger"
            aria-label={`Remove ${type.label}`}
          >
            <Icon name="trash" size={13} />
          </button>
        </div>
      </div>
    </article>
  )
}

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration))

const inferType = (fileName = '') => {
  const value = fileName.toLowerCase()
  if (value.includes('income')) return 'income'
  if (value.includes('domicile')) return 'domicile'
  if (value.includes('mark') || value.includes('grade') || value.includes('semester')) return 'marksheet'
  if (value.includes('aadhaar') || value.includes('aadhar') || value.includes('passport') || value.includes('id')) return 'id'
  return 'other'
}

function UploadModal({ open, onClose, initialFile, initialType, onSaved }) {
  const { uploadDocument, profile } = useWorkspace()
  const [file, setFile] = useState(null)
  const [type, setType] = useState('other')
  const [error, setError] = useState('')
  const [stage, setStage] = useState(0)
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setFile(initialFile ?? null)
    setType(initialType || (initialFile ? inferType(initialFile.name) : 'other'))
    setError('')
    setStage(0)
    setSaving(false)
    setDragging(false)
  }, [open, initialFile, initialType])

  const chooseFile = (nextFile) => {
    if (!nextFile) return
    if (nextFile.size > 10 * 1024 * 1024) {
      setError('That file is a little large. Keep it under 10 MB.')
      return
    }
    if (!/\.(pdf|png|jpe?g|webp)$/i.test(nextFile.name)) {
      setError('A PDF or a clear photo works best.')
      return
    }
    setFile(nextFile)
    setError('')
    if (type === 'other') setType(inferType(nextFile.name))
  }

  const handleSave = async () => {
    if (!file) {
      setError('Choose a file first.')
      return
    }

    setSaving(true)
    setError('')

    try {
      setStage(1)
      await wait(520)
      setStage(2)
      await wait(620)
      setStage(3)
      await wait(500)

      const typeMeta = typeFor(type)
      await uploadDocument(
        {
          type,
          name: typeMeta.label,
          fileName: file.name,
          mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
          size: file.size,
          verificationNote: `Name and dates look clear. Checked against ${profile?.fullName ?? 'your profile'}.`,
        },
        file,
      )

      setStage(4)
      await wait(380)
      onSaved(typeMeta.label)
      onClose()
    } catch (saveError) {
      setError(saveError?.message ?? 'The file could not be saved. Try once more.')
      setSaving(false)
      setStage(0)
    }
  }

  const close = () => {
    if (!saving) onClose()
  }

  const stages = [
    { label: 'Saving your file', threshold: 1 },
    { label: 'Reading the name and dates', threshold: 2 },
    { label: 'Matching it to your profile', threshold: 3 },
    { label: 'Ready for your forms', threshold: 4 },
  ]

  return (
    <Modal
      open={open}
      onClose={close}
      hideClose={saving}
      title="Add a paper to the vault."
      description="A clear photo or PDF is enough. You can change or remove it later."
      size="md"
      footer={
        !saving && (
          <div className="flex items-center justify-end gap-2.5">
            <button type="button" onClick={close} className="btn btn-ghost btn-sm">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={!file} className="btn btn-primary btn-sm">
              Add to my vault
              <Icon name="arrow-right" size={13} />
            </button>
          </div>
        )
      }
    >
      {saving ? (
        <div className="py-2">
          <ProgressBar value={(stage / 4) * 100} height={6} showShimmer />
          <div className="mt-7 space-y-4">
            {stages.map((item) => {
              const done = stage > item.threshold
              const active = stage === item.threshold
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-full ${
                      done ? 'bg-ok-soft text-ok' : active ? 'bg-forest text-ivory' : 'border border-line text-muted'
                    }`}
                  >
                    {done ? (
                      <Icon name="check" size={12} strokeWidth={2.4} />
                    ) : active ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-ivory border-t-transparent" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
                    )}
                  </span>
                  <span className={`text-[12px] ${active || done ? 'font-semibold text-ink' : 'text-muted'}`}>
                    {item.label}
                  </span>
                  {done && <span className="ml-auto text-[9px] text-ok">Done</span>}
                </div>
              )
            })}
          </div>
          <p className="mt-8 text-center font-mono text-[8px] uppercase tracking-[0.13em] text-muted">
            This takes a moment · keep this window open
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <label htmlFor="document-type" className="field-label">
              What is this paper?
              <span className="font-mono text-[8px] font-normal uppercase tracking-[0.1em] text-muted">Required</span>
            </label>
            <select id="document-type" className="input" value={type} onChange={(event) => setType(event.target.value)}>
              {DOCUMENT_TYPES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="field-hint">{typeFor(type).description}</p>
          </div>

          {file ? (
            <div className="flex items-center gap-3 rounded-[16px] border border-line bg-ivory/70 p-3.5">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[10px] border border-line bg-paper text-forest">
                <Icon name="file-text" size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-semibold text-ink">{file.name}</p>
                <p className="mt-0.5 text-[9.5px] text-muted">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-[9.5px] font-semibold text-forest hover:underline"
              >
                Change
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  chooseFile(event.target.files?.[0])
                  event.target.value = ''
                }}
              />
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  inputRef.current?.click()
                }
              }}
              onDragEnter={(event) => {
                event.preventDefault()
                dragDepth.current += 1
                setDragging(true)
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={(event) => {
                event.preventDefault()
                dragDepth.current -= 1
                if (dragDepth.current <= 0) {
                  dragDepth.current = 0
                  setDragging(false)
                }
              }}
              onDrop={(event) => {
                event.preventDefault()
                dragDepth.current = 0
                setDragging(false)
                chooseFile(event.dataTransfer.files?.[0])
              }}
              className={`upload-pattern flex min-h-[148px] flex-col items-center justify-center rounded-[18px] border-2 border-dashed px-5 text-center transition-colors ${
                dragging
                  ? 'border-forest bg-sage/60'
                  : 'border-line-strong bg-ivory/50 hover:border-forest hover:bg-sage/40'
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-forest">
                <Icon name="upload" size={16} />
              </span>
              <p className="mt-3 text-[11.5px] font-semibold text-ink">Drop your file here, or choose one</p>
              <p className="mt-1 text-[9.5px] text-muted">PDF, JPG, PNG · up to 10 MB</p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  chooseFile(event.target.files?.[0])
                  event.target.value = ''
                }}
              />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-danger/20 bg-danger-soft/60 px-3.5 py-3 text-[11px] text-danger">
              <Icon name="alert" size={14} className="mt-0.5 flex-none" />
              {error}
            </div>
          )}

          <div className="flex items-start gap-2.5 rounded-[15px] border border-line bg-ivory/60 p-3.5">
            <Icon name="shield" size={14} className="mt-0.5 flex-none text-moss" />
            <p className="text-[9.5px] leading-[1.65] text-muted">
              We keep the original file untouched. It stays in this browser and is only used when you prepare an
              application.
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}

function SampleCertificate({ document, profile }) {
  const type = typeFor(document.type)
  const rows =
    document.type === 'income'
      ? [
          ['Applicant', profile?.fullName],
          ['Annual family income', '₹1,85,000'],
          ['Financial year', '2026–27'],
          ['Category', profile?.category],
        ]
      : document.type === 'domicile'
        ? [
            ['Applicant', profile?.fullName],
            ['Domicile state', profile?.domicile],
            ['Date of birth', '14 March 2005'],
            ['Valid through', 'March 2029'],
          ]
        : document.type === 'marksheet'
          ? [
              ['Student', profile?.fullName],
              ['Institution', profile?.institution],
              ['Course', profile?.course],
              ['Latest CGPA', `${profile?.cgpa} / 10`],
            ]
          : [
              ['Name', profile?.fullName],
              ['Document', type.label],
              ['Issued by', 'Competent authority'],
              ['Status', 'Sample copy'],
            ]

  return (
    <div className="relative mx-auto max-w-[620px] overflow-hidden rounded-[6px] border-[7px] border-double border-[#b8a98b] bg-[#fffaf0] px-7 py-8 shadow-[0_20px_60px_-30px_rgba(24,37,31,.5)] sm:px-10 sm:py-10">
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-md border-4 border-clay/20 px-6 py-2 font-mono text-[24px] font-bold uppercase tracking-[0.2em] text-clay/[0.13] sm:text-[38px]">
        Sample
      </span>
      <div className="relative text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#b8a98b] text-[#8a7760]">
          <Icon name="graduation" size={23} />
        </div>
        <p className="mt-3 font-mono text-[7px] uppercase tracking-[0.24em] text-[#988872]">Government of Maharashtra</p>
        <h3 className="mt-2 font-display text-[27px] leading-tight tracking-[-0.02em] text-[#3d352a] sm:text-[32px]">
          {type.label}
        </h3>
        <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.16em] text-[#a79984]">Demo representation · not a valid document</p>
      </div>

      <div className="relative mt-7 grid gap-x-8 gap-y-4 border-y border-dashed border-[#cfc1a9] py-6 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="font-mono text-[6.5px] uppercase tracking-[0.15em] text-[#a08f76]">{label}</p>
            <p className="mt-1 border-b border-[#d8ccb8] pb-1 font-display text-[14px] text-[#4c4233]">{value || '—'}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-7 flex items-end justify-between">
        <div className="text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b8a98b] text-[#8a7760]">
            <Icon name="shield" size={16} />
          </div>
          <p className="mt-2 font-mono text-[6px] uppercase tracking-[0.12em] text-[#a08f76]">Issuing authority</p>
        </div>
        <p className="rotate-[-4deg] font-display text-[20px] italic text-[#5b5142]">Registrar</p>
      </div>
    </div>
  )
}

function PreviewModal({ document, profile, open, onClose, onDelete, getDocumentBlob }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !document || document.isSample) {
      setUrl('')
      return undefined
    }

    let active = true
    let objectUrl = ''
    setLoading(true)
    setError('')

    getDocumentBlob(document.id).then((blob) => {
      if (!active) return
      if (!blob) {
        setError('The file preview could not be opened.')
        setLoading(false)
        return
      }
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
      setLoading(false)
    })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [open, document, getDocumentBlob])

  if (!document) return null

  const type = typeFor(document.type)
  const isPdf = (document.mimeType || '').includes('pdf')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={type.label}
      description={`${document.fileName} · ${formatFileSize(document.size)} · Added ${formatDate(document.uploadedAt)}`}
      size="xl"
      bodyClassName="bg-[#e9e3d7] px-4 py-6 sm:px-8 sm:py-8"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="status-pill status-ok min-h-[24px] px-2 text-[8.5px]">
              <Icon name="check" size={9} strokeWidth={2.4} />
              Verified
            </span>
            {document.isSample && <span className="status-pill status-review min-h-[24px] px-2 text-[8.5px]">Demo copy</span>}
          </div>
          <div className="flex items-center gap-2">
            {url && (
              <a href={url} download={document.fileName} className="btn btn-secondary btn-sm">
                <Icon name="download" size={13} />
                Download
              </a>
            )}
            <button type="button" onClick={() => onDelete(document)} className="btn btn-ghost btn-sm text-danger hover:bg-danger-soft hover:text-danger">
              <Icon name="trash" size={13} />
              Remove
            </button>
            <button type="button" onClick={onClose} className="btn btn-primary btn-sm">
              Done
            </button>
          </div>
        </div>
      }
    >
      {document.isSample ? (
        <div>
          <SampleCertificate document={document} profile={profile} />
          <p className="mx-auto mt-4 max-w-[620px] text-center text-[9.5px] leading-relaxed text-[#726a5b]">
            This is a demo representation so you can see how a verified paper appears in your vault. Upload your own
            document to replace it.
          </p>
        </div>
      ) : loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-forest border-t-transparent" />
          <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-muted">Opening your file</p>
        </div>
      ) : error ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-danger">
            <Icon name="alert" size={20} />
          </span>
          <p className="mt-4 font-display text-[20px] text-ink">We couldn’t open this preview.</p>
          <p className="mt-1 max-w-[300px] text-[11px] text-muted">{error} The file is still safely stored in your vault.</p>
        </div>
      ) : url && isPdf ? (
        <iframe title={`Preview of ${type.label}`} src={url} className="mx-auto h-[58vh] w-full max-w-[820px] rounded-[10px] border border-line bg-white shadow-card" />
      ) : url ? (
        <img
          src={url}
          alt={`Preview of ${type.label}`}
          className="mx-auto max-h-[58vh] w-auto max-w-full rounded-[10px] border border-line bg-white object-contain shadow-card"
        />
      ) : null}
    </Modal>
  )
}

export default function Documents() {
  const { documents, removeDocument, getDocumentBlob, profile } = useWorkspace()
  const { showToast } = useToast()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)
  const [pendingType, setPendingType] = useState(null)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [deleteDoc, setDeleteDoc] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const readyCount = useMemo(
    () => DOCUMENT_TYPES.filter((type) => type.required && documents.some((doc) => doc.type === type.id)).length,
    [documents],
  )

  const openUpload = (file = null, type = null) => {
    setPendingFile(file)
    setPendingType(type)
    setUploadOpen(true)
  }

  const closeUpload = () => {
    setUploadOpen(false)
    setPendingFile(null)
    setPendingType(null)
  }

  const handleSaved = (typeLabel) => {
    showToast({
      title: 'Added to your vault.',
      description: `${typeLabel} is checked and ready for your forms.`,
    })
  }

  const handleDelete = async () => {
    if (!deleteDoc) return
    setDeleting(true)
    try {
      await removeDocument(deleteDoc.id)
      showToast({
        title: 'Paper removed.',
        description: 'The file is no longer stored in your vault.',
      })
      setDeleteDoc(null)
      setPreviewDoc(null)
    } catch {
      showToast({ title: 'That didn’t work.', description: 'The file is still in your vault.', tone: 'warning' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Documents · your private vault"
        title="The vault."
        description="The papers that do the quiet work behind every application. Keep them here once, and stop hunting through old folders every time a form asks for one."
        actions={
          <button type="button" onClick={() => openUpload()} className="btn btn-primary">
            <Icon name="plus" size={15} />
            Add a paper
          </button>
        }
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <UploadZone onPick={(file) => openUpload(file)} />
        <ReadinessCard
          documents={documents}
          onAdd={(type) => openUpload(null, type)}
          onPreview={(document) => setPreviewDoc(document)}
        />
      </div>

      <section className="mt-9">
        <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">All papers</p>
            <h2 className="mt-1.5 font-display text-[27px] leading-tight tracking-[-0.03em]">In your file</h2>
          </div>
          <p className="text-[10.5px] text-muted">
            {readyCount} of 4 required papers ready · {documents.length} {documents.length === 1 ? 'file' : 'files'} total
          </p>
        </div>

        {documents.length > 0 ? (
          <div className="mt-5 grid gap-3.5 md:grid-cols-2">
            {documents.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onPreview={(item) => setPreviewDoc(item)}
                onDelete={(item) => setDeleteDoc(item)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-5 card p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ivory text-moss">
              <Icon name="folder" size={22} />
            </span>
            <h3 className="mt-4 font-display text-[24px] tracking-[-0.02em]">A very tidy vault.</h3>
            <p className="mt-1.5 text-[11.5px] text-muted">Add your first paper and we’ll keep it ready for every form.</p>
            <button type="button" onClick={() => openUpload()} className="btn btn-primary mt-5">
              Add a paper
            </button>
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[22px] border border-dashed border-line bg-ivory/50 px-5 py-5 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sage text-forest">
            <Icon name="lock" size={14} />
          </span>
          <div>
            <p className="text-[11.5px] font-semibold text-ink">Your papers don’t leave this browser.</p>
            <p className="mt-0.5 max-w-[520px] text-[10px] leading-relaxed text-muted">
              Files stay in a private vault on this device for the demo. In the full product, the same vault can sync
              securely across your devices without changing how any of this works.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.12em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" />
          On this device
        </span>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={closeUpload}
        initialFile={pendingFile}
        initialType={pendingType}
        onSaved={handleSaved}
      />

      <PreviewModal
        document={previewDoc}
        profile={profile}
        open={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        onDelete={(document) => {
          setPreviewDoc(null)
          setDeleteDoc(document)
        }}
        getDocumentBlob={getDocumentBlob}
      />

      <Modal
        open={Boolean(deleteDoc)}
        onClose={() => (deleting ? null : setDeleteDoc(null))}
        title="Remove this paper?"
        description="You can always add it again later."
        size="sm"
        footer={
          <div className="flex items-center justify-end gap-2.5">
            <button type="button" onClick={() => setDeleteDoc(null)} disabled={deleting} className="btn btn-ghost btn-sm">
              Keep it
            </button>
            <button type="button" onClick={handleDelete} disabled={deleting} className="btn btn-clay btn-sm">
              {deleting ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Removing
                </>
              ) : (
                'Remove paper'
              )}
            </button>
          </div>
        }
      >
        <div className="flex items-center gap-3 rounded-[16px] border border-line bg-ivory/70 p-4">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[10px] border border-line bg-paper text-danger">
            <Icon name="trash" size={17} />
          </span>
          <div>
            <p className="text-[11.5px] font-semibold text-ink">{deleteDoc ? typeFor(deleteDoc.type).label : 'Document'}</p>
            <p className="mt-0.5 text-[9.5px] text-muted">{deleteDoc?.fileName}</p>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          Applications that still need this paper will show it as missing until you add a new copy.
        </p>
      </Modal>
    </div>
  )
}
