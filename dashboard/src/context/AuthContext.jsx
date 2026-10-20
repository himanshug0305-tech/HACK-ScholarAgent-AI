import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from '../services/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    storage
      .getSession()
      .then((storedSession) => {
        if (active) setSession(storedSession)
      })
      .catch(() => {
        if (active) setSession(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (username, password) => {
    const nextSession = await storage.loginDummyUser(username, password)
    setSession(nextSession)
    return nextSession
  }, [])

  const logout = useCallback(async () => {
    await storage.logout()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, loading, login, logout, isAuthenticated: Boolean(session) }),
    [session, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
