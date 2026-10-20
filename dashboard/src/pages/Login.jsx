import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Brand, BrandMark } from '../components/Brand'
import { Icon } from '../components/Icon'
import { Spinner } from '../components/Feedback'

export default function Login() {
  const { login, session, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (!authLoading && session) {
    return <Navigate to="/dashboard" replace />
  }

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setFormError('')
  }

  const submit = async (event, demo = false) => {
    event?.preventDefault()
    const username = demo ? 'ananya.deshmukh' : values.username
    const password = demo ? 'scholar2026' : values.password

    const nextErrors = {}
    if (!username.trim()) nextErrors.username = 'Add a name to continue.'
    if (!password.trim()) nextErrors.password = 'Add a password to continue.'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      await login(username, password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setFormError(error?.message ?? 'We could not open the demo workspace.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-svh bg-canvas lg:grid lg:h-svh lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden flex-col overflow-hidden bg-forest px-10 py-9 text-ivory lg:flex xl:px-16 xl:py-12">
        <div className="auth-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-44 top-12 h-[450px] w-[450px] rounded-full border border-ivory/[0.07]" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 top-32 h-[270px] w-[270px] rounded-full border border-ivory/[0.055]" aria-hidden="true" />
        <div className="pointer-events-none absolute right-12 top-[48%] h-2.5 w-2.5 rounded-full bg-clay" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-28 right-32 h-1.5 w-1.5 rounded-full bg-honey" aria-hidden="true" />

        <div className="relative">
          <Link to="/" aria-label="Back to the ScholarAgent front desk">
            <Brand onDark />
          </Link>
        </div>

        <div className="relative my-auto max-w-[590px] py-10">
          <p className="eyebrow eyebrow-dark flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-honey" />
            Scholarships, without the scavenger hunt
          </p>
          <h1 className="mt-5 font-display text-[52px] font-normal leading-[0.98] tracking-[-0.04em] xl:text-[64px]">
            Less scrambling.
            <br />
            More of what’s <em className="italic text-honey">yours.</em>
          </h1>
          <p className="mt-6 max-w-[440px] text-[14px] leading-[1.8] text-ivory/58">
            One quiet place for the schemes you qualify for, the fine print that matters, and the paperwork you
            already have.
          </p>
        </div>

        <div className="relative flex items-center justify-between gap-6 border-t border-ivory/10 pt-4 text-ivory/45">
          <span className="font-mono text-[8px] uppercase tracking-[0.17em]">A desk for the ones figuring it out</span>
          <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.13em]">
            <Icon name="lock" size={10} />
            Nothing leaves this browser
          </span>
        </div>
      </section>

      <main className="relative flex min-h-svh flex-col justify-center overflow-hidden px-5 py-6 sm:px-8 lg:min-h-0 lg:px-12 lg:py-8 xl:px-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-honey-soft/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 left-8 hidden w-px bg-clay/15 xl:block" aria-hidden="true" />

        <div className="relative mx-auto flex w-full max-w-[398px] flex-1 flex-col justify-center py-5 lg:flex-none lg:py-0">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="lg:hidden" aria-label="Back to the ScholarAgent front desk">
              <BrandMark size={34} />
            </Link>
            <Link
              to="/"
              className="hidden items-center gap-1.5 text-[10.5px] font-semibold text-muted transition-colors hover:text-ink lg:inline-flex"
            >
              <Icon name="arrow-left" size={12} />
              Front desk
            </Link>
            <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.13em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              Demo workspace
            </span>
          </div>

          <div className="mt-9 lg:mt-7">
            <h1 className="font-display text-[40px] leading-[1.02] tracking-[-0.04em] text-ink sm:text-[44px]">
              Come on in.
              <br />
              <span className="italic text-moss">Your desk is ready.</span>
            </h1>
            <p className="mt-3 text-[12.5px] leading-[1.7] text-muted">
              Use any name and password for this demo. Nothing is checked or sent anywhere.
            </p>
          </div>

          <form onSubmit={(event) => submit(event)} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="field-label">
                Username
                <span className="font-mono text-[8px] font-normal uppercase tracking-[0.1em] text-muted">Any name</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className={`input ${errors.username ? 'input-error' : ''}`}
                placeholder="ananya.deshmukh"
                value={values.username}
                onChange={(event) => setField('username', event.target.value)}
                aria-invalid={Boolean(errors.username)}
                aria-describedby={errors.username ? 'username-error' : undefined}
              />
              {errors.username && (
                <p id="username-error" className="field-hint text-danger">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input pr-12 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Anything you’ll remember"
                  value={values.password}
                  onChange={(event) => setField('password', event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                  <Icon name="lock" size={15} />
                </span>
              </div>
              {errors.password && (
                <p id="password-error" className="field-hint text-danger">
                  {errors.password}
                </p>
              )}
            </div>

            {formError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-danger/20 bg-danger-soft/60 px-3.5 py-3 text-[12px] text-danger">
                <Icon name="alert" size={15} className="mt-0.5 flex-none" />
                {formError}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn btn-primary w-full">
              {submitting ? (
                <>
                  <Spinner size={15} />
                  Opening your desk
                </>
              ) : (
                <>
                  Step into your desk
                  <Icon name="arrow-right" size={16} />
                </>
              )}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted">or skip the typing</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={(event) => submit(event, true)}
            className="btn btn-secondary w-full justify-between px-4 text-left"
          >
            <span className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-honey-soft text-[#7b5a1c]">
                <Icon name="sparkles" size={12} />
              </span>
              Use the demo student
            </span>
            <Icon name="arrow-up-right" size={14} className="text-muted" />
          </button>

          <div className="mt-5 flex items-start gap-2.5 border-t border-line pt-4">
            <Icon name="shield" size={13} className="mt-0.5 flex-none text-moss" />
            <p className="text-[10px] leading-[1.65] text-muted">
              A local demo. Your profile and papers stay in this browser, and no real account is created.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
