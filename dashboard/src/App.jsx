import { useEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { AppFallback, AppShell } from './components/AppShell'
import { Brand } from './components/Brand'
import { Icon } from './components/Icon'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Discover from './pages/Discover'
import Opportunities from './pages/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail'
import Documents from './pages/Documents'
import Profile from './pages/Profile'
import ConnectExtension from './pages/ConnectExtension'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function ProtectedLayout() {
  const { session, loading } = useAuth()

  if (loading) return <AppFallback />
  if (!session) return <Navigate to="/login" replace />

  return (
    <DataProvider userId={session.userId}>
      <AppShell />
    </DataProvider>
  )
}

function NotFound() {
  const { session } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
      <Brand />
      <p className="mt-12 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">Page 404 · a wrong turn</p>
      <h1 className="mt-3 font-display text-[46px] leading-none tracking-[-0.04em] text-ink sm:text-[60px]">
        This page isn’t here.
      </h1>
      <p className="mt-4 max-w-[380px] text-[12.5px] leading-relaxed text-muted">
        The link may be old, or the page may have packed up. Your desk is still exactly where you left it.
      </p>
      <Link to={session ? '/dashboard' : '/'} className="btn btn-primary mt-7">
        {session ? 'Back to my desk' : 'Back to the front desk'}
        <Icon name="arrow-right" size={14} />
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/:opportunityId" element={<OpportunityDetail />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/extension" element={<ConnectExtension />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
