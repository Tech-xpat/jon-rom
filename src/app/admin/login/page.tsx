'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertCircle, Loader2 } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const { login, loginWithEmailPassword, loading, error, clearError, user, adminRole } = useAdminAuth()
  const router = useRouter()
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (user && adminRole) router.replace('/admin')
  }, [user, adminRole, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalLoading(true)
    try {
      await loginWithEmailPassword(email, password)
    } catch (e: any) {
      console.error('[Login] Email login failed:', e.message)
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a0000 0%, #000 60%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-950/40 border border-red-800/40 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ boxShadow: '0 0 40px #ff000040' }}>
            <Shield size={36} className="text-red-500" />
          </div>
          <h1 className="text-white text-3xl font-black tracking-[0.3em]">ADMIN</h1>
          <p className="text-gray-500 text-xs tracking-[0.3em] mt-1">JONATHAN ROUMIE CONTROL PANEL</p>
        </div>

        {/* Card */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-8 space-y-6">

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/40 border border-red-800/60 rounded-xl p-4 flex gap-3"
            >
              <AlertCircle className="text-red-400 flex-shrink-0 w-5 h-5 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-semibold mb-1">Auth Error</p>
                <p className="text-red-400/80 text-xs leading-relaxed font-mono">{error}</p>
                <button onClick={clearError} className="text-red-400 text-xs underline mt-2">Dismiss</button>
              </div>
            </motion.div>
          )}

          {/* Loading state */}
          {loading || localLoading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 size={28} className="text-red-500 animate-spin" />
              <p className="text-gray-400 text-sm text-center">
                Authenticating...<br />
                <span className="text-gray-600 text-xs">Please wait</span>
              </p>
            </div>
          ) : showEmailForm ? (
            <>
              {/* Email/Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs mb-2 tracking-wide">Admin Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/50"
                    disabled={loading || localLoading}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-2 tracking-wide">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-500/50"
                    disabled={loading || localLoading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || localLoading}
                  className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold tracking-wide hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  Sign In
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-600">or</span>
                </div>
              </div>

              <button
                onClick={() => { setShowEmailForm(false); clearError() }}
                className="w-full text-gray-400 text-sm hover:text-gray-300 transition"
              >
                Use Google Instead
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                Choose your authentication method
              </p>

              <button
                onClick={() => { clearError(); login() }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-xl font-bold tracking-wide hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => { setShowEmailForm(true); clearError() }}
                className="w-full bg-red-600/20 border border-red-600/40 text-red-400 py-3.5 rounded-xl font-bold tracking-wide hover:bg-red-600/30 active:scale-95 transition-all"
              >
                Use Email & Password
              </button>
            </>
          )}

          <p className="text-center text-gray-600 text-xs">
            Only authorized accounts can access this panel.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
