import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  memo,
} from 'react'
// AuthContext.tsx
// Single global context for auth: holds the JWT + a light user profile.
// Token lives in memory (api client) and mirrors to sessionStorage (NOT localStorage)
// for a bit more security. Also handles the 5-minute inactivity auto-logout that the
// desktop reference app enforces.

import { setAuthToken } from '../api/client'
const STORAGE_KEY = 'vfms_token'
const PROFILE_KEY = 'vfms_profile'
const IDLE_MS = 5 * 60 * 1000 // 5 minutes
export interface UserProfile {
  email: string
  full_name: string
  role: string
  regional_office: string
  work_id?: string
  avatar?: string
}
interface AuthState {
  token: string | null
  user: UserProfile | null
  timedOut: boolean
  login: (token: string, user: UserProfile) => void
  logout: (opts?: { timedOut?: boolean }) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  clearTimedOut: () => void
}
const AuthContext = createContext<AuthState | undefined>(undefined)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem(STORAGE_KEY),
  )
  const [user, setUser] = useState<UserProfile | null>(() => {
    const raw = sessionStorage.getItem(PROFILE_KEY)
    return raw ? (JSON.parse(raw) as UserProfile) : null
  })
  const [timedOut, setTimedOut] = useState(false)
  const idleTimer = useRef<number | null>(null)
  // Keep the api client's in-memory token in sync on mount / change.
  useEffect(() => {
    setAuthToken(token)
  }, [token])
  const logout = useCallback((opts?: { timedOut?: boolean }) => {
    setToken(null)
    setUser(null)
    setAuthToken(null)
    sessionStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(PROFILE_KEY)
    if (opts?.timedOut) setTimedOut(true)
  }, [])
  const login = useCallback((newToken: string, newUser: UserProfile) => {
    setToken(newToken)
    setUser(newUser)
    setAuthToken(newToken)
    setTimedOut(false)
    sessionStorage.setItem(STORAGE_KEY, newToken)
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(newUser))
  }, [])
  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = {
        ...prev,
        ...patch,
      }
      sessionStorage.setItem(PROFILE_KEY, JSON.stringify(next))
      return next
    })
  }, [])
  const clearTimedOut = useCallback(() => setTimedOut(false), [])
  // Inactivity auto-logout: reset a timer on any user activity while logged in.
  useEffect(() => {
    if (!token) return
    const reset = () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(
        () =>
          logout({
            timedOut: true,
          }),
        IDLE_MS,
      )
    }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((e) =>
      window.addEventListener(e, reset, {
        passive: true,
      }),
    )
    reset()
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset))
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [token, logout])
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        timedOut,
        login,
        logout,
        updateProfile,
        clearTimedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
