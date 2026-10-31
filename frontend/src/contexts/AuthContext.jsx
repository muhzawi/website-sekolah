import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)      // { id, email, role, fullName, phone }
  const [loading, setLoading] = useState(true) // initial session check
  const registering = useRef(false)

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile()
      } else {
        setLoading(false)
      }
    })

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (registering.current) {
        if (!session) {
          setUser(null)
          setLoading(false)
        }
        return
      }

      if (session) {
        fetchProfile()
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile() {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data)
      return data
    } catch {
      await supabase.auth.signOut()
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    const profile = await fetchProfile()
    if (!profile) throw new Error('Profil pengguna tidak ditemukan.')
    return profile
  }

  async function register(email, password) {
    registering.current = true
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw new Error(error.message)

      if (data.session) {
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) throw new Error(signOutError.message)
      }

      return data
    } finally {
      registering.current = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function sendPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, sendPasswordReset, refetchProfile: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
