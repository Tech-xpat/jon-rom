'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { auth, userSignInWithGoogle, userSignOut, onAuthChange } from '@/lib/firebase'
import { getIdToken, getUserMetadata, isUserAuthenticated } from '@/lib/firebase-auth-utils'
import { useRouter } from 'next/navigation'

interface UserAuthCtx {
  user: User | null
  userMetadata: any | null
  loading: boolean
  whitelisted: boolean | null
  fanStatus: 'pending' | 'approved' | 'rejected' | null
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  getToken: () => Promise<string | null>
}

const Ctx = createContext<UserAuthCtx>({
  user: null,
  userMetadata: null,
  loading: true,
  whitelisted: null,
  fanStatus: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  getToken: async () => null,
})

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userMetadata, setUserMetadata] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [whitelisted, setWhitelisted] = useState<boolean | null>(null)
  const [fanStatus, setFanStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthChange(async (u: User | null) => {
      setUser(u)
      if (u) {
        try {
          // Get detailed user metadata
          const metadata = getUserMetadata(u)
          setUserMetadata(metadata)

          // Fetch user whitelist status and fan status
          const token = await getIdToken(u)
          if (token) {
            const res = await fetch('/api/user/status', {
              headers: { Authorization: `Bearer ${token}` },
            })
            if (res.ok) {
              const userData = await res.json()
              setWhitelisted(userData.whitelisted)
              setFanStatus(userData.fanStatus)
            }
          }
        } catch (err) {
          console.error('[UserAuthProvider] Failed to fetch user status:', err)
        }
      } else {
        setWhitelisted(null)
        setFanStatus(null)
        setUserMetadata(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    try {
      const result = await userSignInWithGoogle()
      const user = result.user
      const email = user.email || ''
      const uid = user.uid

      // Register or get user in Firestore
      const token = await getIdToken(user)
      if (!token) throw new Error('Failed to get authentication token')

      const res = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, googleId: uid }),
      })

      if (res.ok) {
        const userData = await res.json()
        setWhitelisted(userData.whitelisted)
        setFanStatus(userData.fanStatus)
        router.push('/dashboard')
      } else {
        throw new Error('Failed to register user')
      }
    } catch (err: any) {
      throw new Error(err.message || 'Login failed')
    }
  }

  const logout = async () => {
    try {
      await userSignOut()
      setWhitelisted(null)
      setFanStatus(null)
      setUserMetadata(null)
      router.push('/')
    } catch (err: any) {
      throw new Error(err.message || 'Logout failed')
    }
  }

  const getToken = async (): Promise<string | null> => {
    if (!user) return null
    return getIdToken(user)
  }

  const isAuthenticated = isUserAuthenticated(user)

  return (
    <Ctx.Provider
      value={{
        user,
        userMetadata,
        loading,
        whitelisted,
        fanStatus,
        isAuthenticated,
        login,
        logout,
        getToken,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export const useUserAuth = () => useContext(Ctx)
