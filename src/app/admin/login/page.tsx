'use client'

import { motion } from 'framer-motion'
import { Shield, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'

export default function AdminLoginPage() {
  const { login, loading, error, clearError } = useAdminAuth()

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center px-3 sm:px-4 py-4 sm:py-0"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a0000 0%, #000 60%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            animate={{ boxShadow: ['0 0 20px #ff000033', '0 0 40px #ff000055', '0 0 20px #ff000033'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-red-950/40 border border-red-800/40 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Shield size={28} className="text-red-500 sm:w-9 sm:h-9" />
          </motion.div>
          <h1 className="text-white text-2xl sm:text-3xl font-black tracking-[0.2em] sm:tracking-[0.3em]">ADMIN</h1>
          <p className="text-gray-500 text-xs tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2">JONATHAN ROUMIE CONTROL PANEL</p>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6">
          {error && (
            <div className="bg-red-950/40 border border-red-800/60 rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 w-5 h-5 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <p className="text-gray-400 text-sm leading-relaxed text-center">
            Sign in with your authorized Google account
          </p>

          <button
            onClick={() => {
              clearError()
              login()
            }}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 sm:py-3.5 rounded-xl font-bold tracking-wide hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 text-base sm:text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="flex-shrink-0">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          <p className="text-center text-gray-600 text-xs">
            Only authorized emails can access this panel.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
