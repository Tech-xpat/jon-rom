'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  AuthError
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminRole = 'super-admin' | 'admin' | 'moderator' | null

interface AdminAuthCtx {
  user: any
  adminRole: AdminRole
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  getToken: () => Promise<string | null>
  isAdmin: boolean
}

const Ctx = createContext<AdminAuthCtx>({
  user: null, adminRole: null, loading: false, error: null,
  login: async () => {}, logout: async () => {}, clearError: () => {},
  getToken: async () => null, isAdmin: false,
})

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [adminRole, setAdminRole] = useState<AdminRole>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check admin role in Firestore
  const checkAdminRole = async (email: string): Promise<AdminRole> => {
    try {
      if (!db) {
        console.warn('[Admin Auth] Firestore not initialized')
        return null
      }

      const adminRef = doc(db, 'admins', email)
      const adminSnap = await getDoc(adminRef)

      if (adminSnap.exists()) {
        const data = adminSnap.data()
        console.log('[Admin Auth] Admin role verified:', data.role)
        return data.role as AdminRole
      }

      console.warn('[Admin Auth] Email not found in admins collection:', email)
      return null
    } catch (e: any) {
      console.error('[Admin Auth] Error checking admin role:', e.message)
      return null
    }
  }

  // Firebase auth state listener
  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && firebaseUser.email) {
          console.log('[Admin Auth] User logged in:', firebaseUser.email)
          
          // Check if user is admin
          const role = await checkAdminRole(firebaseUser.email)
          
          if (role) {
            setUser({ 
              uid: firebaseUser.uid,
              email: firebaseUser.email 
            })
            setAdminRole(role)
            setError(null)
          } else {
            // Not an admin, sign them out
            console.warn('[Admin Auth] User is not an admin, signing out')
            if (auth) {
              await signOut(auth)
            }
            setUser(null)
            setAdminRole(null)
            setError('Your email is not authorized for admin access')
          }
        } else {
          console.log('[Admin Auth] User signed out')
          setUser(null)
          setAdminRole(null)
          setError(null)
        }
      } catch (e: any) {
        console.error('[Admin Auth] Auth state error:', e.message)
        setError('Authentication error occurred')
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      if (!auth) {
        throw new Error('Firebase not initialized')
      }

      console.log('[Admin Auth] Firebase login attempt:', email)
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Role check will happen automatically via onAuthStateChanged
      console.log('[Admin Auth] Firebase login successful')
    } catch (e: any) {
      const errorMsg = getFirebaseErrorMessage(e)
      console.error('[Admin Auth] Login error:', errorMsg)
      setError(errorMsg)
      setUser(null)
      setAdminRole(null)
      throw e
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      if (auth) {
        await signOut(auth)
      }
      console.log('[Admin Auth] User logged out')
      setUser(null)
      setAdminRole(null)
      setError(null)
    } catch (e: any) {
      console.error('[Admin Auth] Logout error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const getToken = async () => {
    if (auth?.currentUser) {
      try {
        return await auth.currentUser.getIdToken()
      } catch (e) {
        console.error('[Admin Auth] Token error:', e)
        return null
      }
    }
    return null
  }

  return (
    <Ctx.Provider value={{
      user, adminRole, loading, error,
      login, logout, clearError: () => setError(null),
      getToken, isAdmin: adminRole !== null,
    }}>
      {children}
    </Ctx.Provider>
  )
}

// Helper function to convert Firebase errors to user-friendly messages
function getFirebaseErrorMessage(error: AuthError): string {
  const code = error.code
  
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-not-found':
      return 'Email not found'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/user-disabled':
      return 'This account has been disabled'
    case 'auth/too-many-requests':
      return 'Too many login attempts. Try again later'
    case 'auth/invalid-credential':
      return 'Invalid email or password'
    default:
      return error.message || 'Login failed'
  }
}

export const useAdminAuth = () => useContext(Ctx)
