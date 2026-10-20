import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkspace } from '../context/DataContext'
import { useToast } from '../components/Toast'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'
import { ProgressBar } from '../components/Feedback'
import {
  ACADEMIC_YEAR_OPTIONS,
  CATEGORY_OPTIONS,
  DOMICILE_OPTIONS,
  PROFILE_CHECKS,
  profileCompletion,
} from '../services/profileMeta'
import { formatCurrency, formatDate, initials } from '../utils/format'

const toForm = (profile) => ({
  fullName: profile?.fullName ?? '',
  dateOfBirth: profile?.dateOfBirth ?? '',
  email: profile?.email ?? '',
  phone: profile?.phone ?? '',
  academicYear: profile?.academicYear ?? '',
  institution: profile?.institution ?? '',
  course: profile?.course ?? '',
  cgpa: profile?.cgpa === undefined ? '' : String(profile.cgpa),
  category: profile?.category ?? '',
  annualIncome: profile?.annualIncome === undefined ? '' : String(profile.annualIncome),
  domicile: profile?.domicile ?? '',
  hosteller: Boolean(profile?.hosteller),
  gender: profile?.gender ?? '',
  firstGeneration: Boolean(profile?.firstGeneration),
})

const SECTION_FIELDS = {
  basics: ['fullName', 'dateOfBirth', 'gender', 'email', 'phone'],
  studies: ['institution', 'course', 'academicYear', 'cgpa'],
  eligibility: ['category', 'annualIncome', 'domicile'],
}

const FIELD_SECTION = Object.fromEntries(
  Object.entries(SECTION_FIELDS).flatMap(([section, fields]) => fields.map((field) => [field, section])),
)

function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="field-hint text-danger">
      {children}
    </p>
  )
}

function SectionHeading({ id, number, title, description, icon, open, onToggle, filled, total }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`${id}-content`}
      className={`group flex w-full items-start gap-4 px-6 py-5 text-left transition-colors hover:bg-ivory/55 sm:px-7 ${
        open ? 'border-b border-line' : ''
      }`}
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[11px] border border-line bg-ivory text-moss transition-colors group-hover:border-line-strong">
        <Icon name={icon} size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">{number}</span>
          <span className="h-px w-4 bg-line" />
        </span>
        <span className="mt-1 block font-display text-[23px] leading-tight tracking-[-0.025em] text-ink">{title}</span>
        <span className="mt-1 block text-[10.5px] leading-relaxed text-muted">{description}</span>
      </span>
      <span className="mt-1 flex flex-none items-center gap-3 self-start">
        <span className={`hidden font-mono text-[8px] uppercase tracking-[0.1em] sm:block ${filled === total ? 'text-ok' : 'text-muted'}`}>
          {filled === total ? 'Complete' : `${filled} of ${total}`}
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-paper text-muted transition-colors group-hover:border-line-strong group-hover:text-ink">
          <Icon name="chevron-down" size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </span>
      </span>
    </button>
  )
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-[15px] border border-line bg-[#fffdf8] px-4 py-3 text-left transition-colors hover:border-line-strong"
    >
      <span className="min-w-0">
        <span className="block text-[11.5px] font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block text-[9px] leading-relaxed text-muted">{description}</span>
      </span>
      <span
        className={`relative h-6 w-10 flex-none rounded-full border transition-colors ${
          checked ? 'border-forest bg-forest' : 'border-line-strong bg-[#ece7dc]'
        }`}
      >
        <span
          className={`absolute top-[3px] h-4 w-4 rounded-full bg-paper shadow-sm transition-transform ${
            checked ? 'translate-x-[19px]' : 'translate-x-[3px]'
          }`}
        />
      </span>
    </button>
  )
}

function ProfileSummary({ profile, form }) {
  const completion = profileCompletion(profile)
  const missing = PROFILE_CHECKS.filter((check) => {
    const value = profile?.[check.key]
    return value === undefined || value === null || String(value).trim() === ''
  })

  return (
    <div className="space-y-4">
      <section className="card overflow-hidden">
        <div className="relative overflow-hidden bg-forest px-6 py-7 text-ivory">
          <div className="auth-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border border-ivory/10" aria-hidden="true" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-honey font-display text-[19px] tracking-[-0.02em] text-forest">
              {initials(form.fullName || profile?.fullName)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[22px] leading-tight tracking-[-0.025em]">{form.fullName || 'Your name'}</p>
              <p className="mt-1 truncate text-[10px] text-ivory/55">{form.course || 'Your course'}</p>
              <p className="mt-0.5 truncate text-[9px] text-ivory/55">{form.institution || 'Your institution'}</p>
            </div>
          </div>
          <div className="relative mt-6">
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-mono uppercase tracking-[0.12em] text-ivory/55">Profile completeness</span>
              <span className="font-semibold text-ivory">{completion}%</span>
            </div>
            <ProgressBar value={completion} tone="honey" height={4} className="mt-2 bg-ivory/15" />
          </div>
        </div>

        <div className="px-5 py-5">
          <p className="eyebrow">The short version</p>
          <div className="mt-3 space-y-2.5">
            {[
              ['Category', form.category || 'Not set'],
              ['Annual income', form.annualIncome ? formatCurrency(form.annualIncome) : 'Not set'],
              ['Domicile', form.domicile || 'Not set'],
              ['Living', form.hosteller ? 'Hosteller' : 'Day scholar'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3">
                <span className="text-[9.5px] text-muted">{label}</span>
                <span className="text-[10px] font-semibold text-ink-soft">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <span className="text-[9px] text-muted">Last saved</span>
            <span className="text-[9px] font-medium text-ink-soft">{formatDate(profile?.updatedAt)}</span>
          </div>
        </div>
      </section>

      <section className="card-soft p-5">
        <div className="flex items-center gap-2.5">
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${missing.length ? 'bg-honey-soft text-[#7a5a1c]' : 'bg-ok-soft text-ok'}`}>
            <Icon name={missing.length ? 'alert' : 'check'} size={13} />
          </span>
          <p className="text-[11px] font-bold text-ink">
            {missing.length ? `${missing.length} details still open` : 'Your file is complete'}
          </p>
        </div>
        <div className="mt-3 space-y-1.5">
          {PROFILE_CHECKS.map((check) => {
            const value = profile?.[check.key]
            const filled = value !== undefined && value !== null && String(value).trim() !== ''
            return (
              <div key={check.key} className="flex items-center gap-2">
                <Icon name={filled ? 'check' : 'x'} size={10} className={filled ? 'text-ok' : 'text-muted'} />
                <span className={`text-[9.5px] ${filled ? 'text-ink-soft' : 'text-muted'}`}>{check.label}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-[22px] border border-line bg-transparent p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-line text-moss">
            <Icon name="info" size={14} />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-ink">Why these details matter</p>
            <p className="mt-1.5 text-[9.5px] leading-[1.75] text-muted">
              Income, category, domicile, and year decide most eligibility rules. Keeping them accurate means fewer
              surprises and far less retyping on official portals.
            </p>
          </div>
        </div>
      </section>

      <Link
        to="/documents"
        className="group flex items-center justify-between gap-3 rounded-[18px] border border-line bg-paper px-5 py-4 transition-colors hover:border-line-strong"
      >
        <span>
          <span className="block text-[10.5px] font-semibold text-ink">Keep your papers close</span>
          <span className="mt-0.5 block text-[9px] text-muted">Open the vault</span>
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-muted transition-transform group-hover:translate-x-0.5">
          <Icon name="arrow-right" size={12} />
        </span>
      </Link>
    </div>
  )
}

export default function Profile() {
  const { profile, saveProfile } = useWorkspace()
  const { showToast } = useToast()
  const initial = useMemo(() => toForm(profile), [profile?.updatedAt]) // eslint-disable-line react-hooks/exhaustive-deps
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [openSections, setOpenSections] = useState({ basics: true, studies: false, eligibility: false })

  useEffect(() => {
    setForm(initial)
    setErrors({})
  }, [initial])

  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  const allSectionsOpen = Object.values(openSections).every(Boolean)
  const sectionProgress = Object.fromEntries(
    Object.entries(SECTION_FIELDS).map(([section, fields]) => [
      section,
      fields.filter((field) => String(form[field] ?? '').trim() !== '').length,
    ]),
  )

  const toggleSection = (section) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }))
  }

  const toggleAllSections = () => {
    const next = !allSectionsOpen
    setOpenSections({ basics: next, studies: next, eligibility: next })
  }

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
    setShowSaved(false)
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Please add your full name.'
    if (!form.dateOfBirth) next.dateOfBirth = 'Please add your date of birth.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'That email looks incomplete.'
    if (!/^[+]?[\d\s-]{8,16}$/.test(form.phone.trim())) next.phone = 'Please add a valid phone number.'
    if (!form.institution.trim()) next.institution = 'Please add your institution.'
    if (!form.course.trim()) next.course = 'Please add your course.'
    if (!form.academicYear) next.academicYear = 'Please choose your academic year.'
    const cgpa = Number(form.cgpa)
    if (!form.cgpa || Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10) next.cgpa = 'Use a CGPA between 0 and 10.'
    if (!form.category) next.category = 'Please choose a category.'
    const income = Number(form.annualIncome)
    if (!form.annualIncome || Number.isNaN(income) || income <= 0) next.annualIncome = 'Enter your annual family income.'
    if (!form.domicile) next.domicile = 'Please choose your domicile state.'
    if (!form.gender) next.gender = 'Please choose an option.'
    return next
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate()

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      const firstKey = Object.keys(nextErrors)[0]
      const section = FIELD_SECTION[firstKey]
      if (section) {
        setOpenSections((current) => ({ ...current, [section]: true }))
      }
      window.setTimeout(() => document.getElementById(firstKey)?.focus(), 0)
      return
    }

    setSaving(true)
    try {
      await saveProfile({
        ...profile,
        ...form,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        institution: form.institution.trim(),
        course: form.course.trim(),
        cgpa: Number(form.cgpa),
        annualIncome: Number(form.annualIncome),
      })
      setShowSaved(true)
      showToast({ title: 'Profile saved.', description: 'Your matches will use the latest details from here on.' })
    } catch {
      showToast({ title: 'Your changes didn’t save.', description: 'Nothing was lost. Try once more.', tone: 'warning' })
    } finally {
      setSaving(false)
    }
  }

  const inputError = (key) => (errors[key] ? 'input-error' : '')
  const errorId = (key) => `${key}-error`

  return (
    <div>
      <PageHeader
        eyebrow="Profile · kept in one place"
        title="The person behind the paperwork."
        description="These are the details every scholarship asks for. Fill them once, keep them true, and we’ll do the matching from here."
        actions={
          dirty || saving ? (
            <button type="submit" form="profile-form" disabled={saving} className="btn btn-primary">
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ivory border-t-transparent" />
                  Saving
                </>
              ) : (
                <>
                  Save changes
                  <Icon name="check" size={14} />
                </>
              )}
            </button>
          ) : (
            <span className="status-pill status-ok min-h-[42px] px-5 text-[10px]">
              <Icon name="check-circle" size={13} />
              Everything is saved
            </span>
          )
        }
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)]">
        <form id="profile-form" onSubmit={handleSubmit} className="min-w-0 space-y-5" noValidate>
          <div className="flex items-center justify-between gap-4 px-1 pb-1">
            <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-muted">
              Three parts · open what you need
            </p>
            <button
              type="button"
              onClick={toggleAllSections}
              className="font-mono text-[8px] uppercase tracking-[0.1em] text-forest underline decoration-line-strong underline-offset-4 transition-colors hover:text-moss"
            >
              {allSectionsOpen ? 'Collapse all' : 'Open all'}
            </button>
          </div>

          <section className="card overflow-hidden">
            <SectionHeading
              id="basics"
              number="01"
              title="The basics"
              description="How institutions and portals will know you."
              icon="user-round"
              open={openSections.basics}
              onToggle={() => toggleSection('basics')}
              filled={sectionProgress.basics}
              total={SECTION_FIELDS.basics.length}
            />
            {openSections.basics && (
            <div id="basics-content" className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-7">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="field-label">
                  Full name
                  <span className="font-mono text-[8px] font-normal uppercase tracking-[0.1em] text-muted">As on ID</span>
                </label>
                <input
                  id="fullName"
                  className={`input ${inputError('fullName')}`}
                  value={form.fullName}
                  onChange={(event) => setField('fullName', event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? errorId('fullName') : undefined}
                />
                <FieldError id={errorId('fullName')}>{errors.fullName}</FieldError>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="field-label">Date of birth</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  className={`input ${inputError('dateOfBirth')}`}
                  value={form.dateOfBirth}
                  onChange={(event) => setField('dateOfBirth', event.target.value)}
                  autoComplete="bday"
                  aria-invalid={Boolean(errors.dateOfBirth)}
                  aria-describedby={errors.dateOfBirth ? errorId('dateOfBirth') : undefined}
                />
                <FieldError id={errorId('dateOfBirth')}>{errors.dateOfBirth}</FieldError>
              </div>

              <div>
                <label htmlFor="gender" className="field-label">Gender</label>
                <select
                  id="gender"
                  className={`input ${inputError('gender')}`}
                  value={form.gender}
                  onChange={(event) => setField('gender', event.target.value)}
                  aria-invalid={Boolean(errors.gender)}
                >
                  <option value="">Choose one</option>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
                <FieldError id={errorId('gender')}>{errors.gender}</FieldError>
              </div>

              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <input
                  id="email"
                  type="email"
                  className={`input ${inputError('email')}`}
                  value={form.email}
                  onChange={(event) => setField('email', event.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? errorId('email') : undefined}
                />
                <FieldError id={errorId('email')}>{errors.email}</FieldError>
              </div>

              <div>
                <label htmlFor="phone" className="field-label">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  className={`input ${inputError('phone')}`}
                  value={form.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? errorId('phone') : undefined}
                />
                <FieldError id={errorId('phone')}>{errors.phone}</FieldError>
              </div>
            </div>
            )}
          </section>

          <section className="card overflow-hidden">
            <SectionHeading
              id="studies"
              number="02"
              title="Your studies"
              description="The course details that decide whether a scheme is open to you."
              icon="graduation"
              open={openSections.studies}
              onToggle={() => toggleSection('studies')}
              filled={sectionProgress.studies}
              total={SECTION_FIELDS.studies.length}
            />
            {openSections.studies && (
            <div id="studies-content" className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-7">
              <div className="sm:col-span-2">
                <label htmlFor="institution" className="field-label">Institution</label>
                <input
                  id="institution"
                  className={`input ${inputError('institution')}`}
                  value={form.institution}
                  onChange={(event) => setField('institution', event.target.value)}
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.institution)}
                  aria-describedby={errors.institution ? errorId('institution') : undefined}
                />
                <FieldError id={errorId('institution')}>{errors.institution}</FieldError>
              </div>

              <div>
                <label htmlFor="course" className="field-label">Course</label>
                <input
                  id="course"
                  className={`input ${inputError('course')}`}
                  value={form.course}
                  onChange={(event) => setField('course', event.target.value)}
                  aria-invalid={Boolean(errors.course)}
                  aria-describedby={errors.course ? errorId('course') : undefined}
                />
                <FieldError id={errorId('course')}>{errors.course}</FieldError>
              </div>

              <div>
                <label htmlFor="academicYear" className="field-label">Academic year</label>
                <select
                  id="academicYear"
                  className={`input ${inputError('academicYear')}`}
                  value={form.academicYear}
                  onChange={(event) => setField('academicYear', event.target.value)}
                  aria-invalid={Boolean(errors.academicYear)}
                >
                  <option value="">Choose one</option>
                  {ACADEMIC_YEAR_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <FieldError id={errorId('academicYear')}>{errors.academicYear}</FieldError>
              </div>

              <div>
                <label htmlFor="cgpa" className="field-label">
                  Current CGPA
                  <span className="font-mono text-[8px] font-normal uppercase tracking-[0.1em] text-muted">Out of 10</span>
                </label>
                <input
                  id="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  className={`input ${inputError('cgpa')}`}
                  value={form.cgpa}
                  onChange={(event) => setField('cgpa', event.target.value)}
                  aria-invalid={Boolean(errors.cgpa)}
                  aria-describedby={errors.cgpa ? errorId('cgpa') : undefined}
                />
                <FieldError id={errorId('cgpa')}>{errors.cgpa}</FieldError>
              </div>

              <div className="flex items-end">
                <div className="w-full rounded-[15px] border border-dashed border-line bg-ivory/60 px-4 py-3">
                  <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted">A quick check</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-ink-soft">
                    {Number(form.cgpa) >= 7.5
                      ? 'Your score clears the usual 7.5 cut-off for merit schemes.'
                      : 'Some merit schemes ask for a 7.5 CGPA. We’ll still show you the ones that don’t.'}
                  </p>
                </div>
              </div>
            </div>
            )}
          </section>

          <section className="card overflow-hidden">
            <SectionHeading
              id="eligibility"
              number="03"
              title="Eligibility details"
              description="Sensitive, but essential. These decide income and category-based schemes."
              icon="shield"
              open={openSections.eligibility}
              onToggle={() => toggleSection('eligibility')}
              filled={sectionProgress.eligibility}
              total={SECTION_FIELDS.eligibility.length}
            />
            {openSections.eligibility && (
            <div id="eligibility-content" className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-7">
              <div>
                <label htmlFor="category" className="field-label">Category</label>
                <select
                  id="category"
                  className={`input ${inputError('category')}`}
                  value={form.category}
                  onChange={(event) => setField('category', event.target.value)}
                  aria-invalid={Boolean(errors.category)}
                >
                  <option value="">Choose one</option>
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <FieldError id={errorId('category')}>{errors.category}</FieldError>
              </div>

              <div>
                <label htmlFor="annualIncome" className="field-label">Annual family income</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-muted">₹</span>
                  <input
                    id="annualIncome"
                    type="number"
                    min="0"
                    step="1000"
                    className={`input pl-8 ${inputError('annualIncome')}`}
                    value={form.annualIncome}
                    onChange={(event) => setField('annualIncome', event.target.value)}
                    aria-invalid={Boolean(errors.annualIncome)}
                    aria-describedby={errors.annualIncome ? errorId('annualIncome') : undefined}
                  />
                </div>
                {form.annualIncome ? (
                  <p className="field-hint">That’s {formatCurrency(Number(form.annualIncome) || 0)} a year.</p>
                ) : null}
                <FieldError id={errorId('annualIncome')}>{errors.annualIncome}</FieldError>
              </div>

              <div>
                <label htmlFor="domicile" className="field-label">Domicile state</label>
                <select
                  id="domicile"
                  className={`input ${inputError('domicile')}`}
                  value={form.domicile}
                  onChange={(event) => setField('domicile', event.target.value)}
                  aria-invalid={Boolean(errors.domicile)}
                >
                  <option value="">Choose one</option>
                  {DOMICILE_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <FieldError id={errorId('domicile')}>{errors.domicile}</FieldError>
              </div>

              <div>
                <span className="field-label">Where do you live during term?</span>
                <div className="grid grid-cols-2 gap-1 rounded-[15px] border border-line bg-ivory p-1">
                  {[
                    { value: false, label: 'Day scholar' },
                    { value: true, label: 'Hosteller' },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setField('hosteller', option.value)}
                      aria-pressed={form.hosteller === option.value}
                      className={`min-h-[40px] rounded-[11px] text-[10.5px] font-semibold transition-all ${
                        form.hosteller === option.value
                          ? 'border border-line bg-paper text-ink shadow-[0_1px_2px_rgba(24,37,31,.06)]'
                          : 'border border-transparent text-muted hover:text-ink'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="field-hint">Hostel-only schemes use this to check if you qualify.</p>
              </div>

              <div className="sm:col-span-2">
                <Toggle
                  checked={form.firstGeneration}
                  onChange={(value) => setField('firstGeneration', value)}
                  label="First-generation student"
                  description="Neither parent completed a college degree."
                />
              </div>
            </div>
            )}
          </section>

          <div className="flex flex-col items-start justify-between gap-4 rounded-[22px] border border-line bg-ivory/60 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-2.5">
              <Icon name="lock" size={13} className="mt-0.5 flex-none text-moss" />
              <p className="text-[9.5px] leading-relaxed text-muted">
                These details stay on this device in the demo. They are never shared without your say-so.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {showSaved && !dirty && (
                <span className="flex items-center gap-1 text-[9.5px] font-medium text-ok">
                  <Icon name="check" size={11} />
                  Saved
                </span>
              )}
              <button type="submit" disabled={!dirty || saving} className="btn btn-primary btn-sm">
                {saving ? 'Saving…' : dirty ? 'Save changes' : 'All saved'}
              </button>
            </div>
          </div>
        </form>

        <aside className="h-fit space-y-4 xl:sticky xl:top-7">
          <ProfileSummary profile={profile} form={form} />
        </aside>
      </div>
    </div>
  )
}
