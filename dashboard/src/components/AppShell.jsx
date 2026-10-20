import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWorkspace } from '../context/DataContext'
import { DOCUMENT_TYPES } from '../services/storage/seed'
import { profileCompletion } from '../services/profileMeta'
import { formatToday, initials } from '../utils/format'
import { Brand, BrandMark } from './Brand'
import { Icon } from './Icon'
import { ProgressBar } from './Feedback'

const mainLinks = [
  { to: '/dashboard', label: 'Overview', icon: 'home', end: true },
  { to: '/discover', label: 'Find aid', icon: 'sparkles' },
  { to: '/opportunities', label: 'Opportunities', icon: 'bookmark', countKey: 'opportunities' },
]

const fileLinks = [
  { to: '/documents', label: 'Documents', icon: 'folder', countKey: 'documents' },
  { to: '/profile', label: 'Profile', icon: 'user-round' },
]

const companionLinks = [{ to: '/extension', label: 'Connect extension', icon: 'puzzle' }]

function SidebarContent({ onNavigate }) {
  const { session, logout } = useAuth()
  const { profile, documents, opportunities, lastDiscovery } = useWorkspace()
  const navigate = useNavigate()

  const readyDocuments = documents.filter((document) => document.status === 'verified').length
  const requiredCount = DOCUMENT_TYPES.filter((type) => type.required).length
  const completion = profileCompletion(profile)
  const counts = {
    opportunities: opportunities.length,
    documents: documents.length,
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute -right-24 -top-16 h-56 w-56 rounded-full border border-ivory/[0.06]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 top-4 h-32 w-32 rounded-full border border-ivory/[0.05]" aria-hidden="true" />

      <div className="relative flex items-center justify-between px-1">
        <Link to="/dashboard" onClick={onNavigate} aria-label="ScholarAgent dashboard">
          <Brand onDark />
        </Link>
      </div>

      <nav className="scrollbar-none relative mt-11 min-h-0 flex-1 overflow-y-auto pb-2" aria-label="Main navigation">
        <p className="eyebrow eyebrow-dark mb-3 px-3.5 text-[9px]">Your desk</p>
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onNavigate}
              className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}
            >
              <Icon name={link.icon} size={17} />
              <span>{link.label}</span>
              {link.countKey && counts[link.countKey] > 0 && (
                <span className="nav-count">{counts[link.countKey]}</span>
              )}
            </NavLink>
          ))}
        </div>

        <p className="eyebrow eyebrow-dark mb-3 mt-9 px-3.5 text-[9px]">Your file</p>
        <div className="space-y-1">
          {fileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}
            >
              <Icon name={link.icon} size={17} />
              <span>{link.label}</span>
              {link.countKey && counts[link.countKey] > 0 && (
                <span className="nav-count">{counts[link.countKey]}</span>
              )}
            </NavLink>
          ))}
        </div>

        <p className="eyebrow eyebrow-dark mb-3 mt-8 px-3.5 text-[9px]">In your browser</p>
        <div className="space-y-1">
          {companionLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) => `side-link ${isActive ? 'side-link-active' : ''}`}
            >
              <Icon name={link.icon} size={17} />
              <span>{link.label}</span>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-honey/80" aria-hidden="true" />
            </NavLink>
          ))}
        </div>

        <div className="mx-1 mt-8 rounded-[20px] border border-ivory/[0.11] bg-ivory/[0.055] p-[18px]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.17em] text-ivory/55">Vault readiness</span>
            <Icon name="shield" size={14} className="text-honey" />
          </div>
          <p className="mt-2.5 font-display text-[19px] leading-tight text-ivory">
            {readyDocuments} of {requiredCount} papers ready
          </p>
          <ProgressBar value={(readyDocuments / requiredCount) * 100} tone="honey" height={4} className="mt-3.5 bg-ivory/15" />
          <Link
            to="/documents"
            onClick={onNavigate}
            className="mt-3.5 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-ivory/65 transition-colors hover:text-ivory"
          >
            Open the vault
            <Icon name="arrow-right" size={12} />
          </Link>
        </div>

        <div className="mx-1 mt-6 flex items-center gap-2 px-1 text-ivory/55">
          <span className="h-px flex-1 bg-ivory/10" />
          <span className="font-mono text-[8px] uppercase tracking-[0.16em]">
            {lastDiscovery ? 'Search saved' : 'Desk ready'}
          </span>
          <span className="h-px flex-1 bg-ivory/10" />
        </div>
      </nav>

      <div className="relative mt-6 border-t border-ivory/[0.11] pt-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-honey text-[12px] font-bold text-forest">
            {initials(profile?.fullName || session?.username || 'Student')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold text-ivory">
              {profile?.fullName || session?.username || 'Student'}
            </p>
            <p className="mt-0.5 truncate font-mono text-[8.5px] uppercase tracking-[0.13em] text-ivory/55">
              Demo workspace · {completion}%
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-ivory/55 transition-colors hover:bg-ivory/10 hover:text-ivory"
            aria-label="Sign out"
            title="Sign out"
          >
            <Icon name="logout" size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { error, loading, profile } = useWorkspace()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[276px] border-r border-forest-deep bg-forest px-5 py-6 lg:block">
        <div className="subtle-grid pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" aria-hidden="true" />
        <SidebarContent />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-forest-deep/60 backdrop-blur-[2px]"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          />
          <div className="page-in absolute inset-y-0 left-0 w-[292px] max-w-[86vw] border-r border-forest-deep bg-forest px-5 py-6">
            <div className="subtle-grid pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="absolute right-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/10 text-ivory"
              aria-label="Close menu"
            >
              <Icon name="x" size={17} />
            </button>
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:ml-[276px]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line/80 bg-canvas/90 px-5 py-3 backdrop-blur-md lg:hidden">
          <Link to="/dashboard" aria-label="ScholarAgent dashboard">
            <Brand compact />
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-paper/70 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-muted sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              Local vault
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink"
              aria-label="Open menu"
            >
              <Icon name="menu" size={18} />
            </button>
          </div>
        </header>

        <main className="mx-auto min-h-screen w-full max-w-[1440px] px-5 pb-20 pt-7 sm:px-8 lg:px-11 lg:pb-24 lg:pt-9 xl:px-16 xl:pt-10">
          <div className="mb-8 hidden items-center justify-between lg:flex">
            <p className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-clay" />
              {formatToday()}
              <span className="text-line-strong">/</span>
              2026–27 cycle
            </p>
            <div className="flex items-center gap-4">
              <span
                className="flex items-center gap-1.5 text-[10px] font-medium text-muted"
                title="Your profile and papers stay in this browser during the demo."
              >
                <Icon name="lock" size={12} />
                Saved on this device
              </span>
              <span className="h-3.5 w-px bg-line" aria-hidden="true" />
              <Link
                to="/profile"
                className="flex items-center gap-2 text-[10px] font-semibold text-ink-soft transition-colors hover:text-ink"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sage text-[8px] font-bold text-forest">
                  {initials(profile?.fullName || '')}
                </span>
                Your file
              </Link>
            </div>
          </div>

          {error ? (
            <div className="card mx-auto mt-16 max-w-xl p-8 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger">
                <Icon name="alert" size={24} />
              </span>
              <h1 className="mt-5 font-display text-[28px] tracking-[-0.02em]">Your file didn’t open.</h1>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{error}</p>
              <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-6">
                Try again
              </button>
            </div>
          ) : loading ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="flex items-center gap-3 text-muted">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-forest border-t-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]">Opening your desk</span>
              </div>
            </div>
          ) : (
            <div key={location.pathname} className="page-in">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export function AppFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <div className="flex flex-col items-center gap-4">
        <BrandMark size={48} />
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-forest border-t-transparent" />
      </div>
    </div>
  )
}
