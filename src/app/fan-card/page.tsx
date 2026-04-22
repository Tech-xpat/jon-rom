'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Download, CreditCard, Sparkles, CheckCircle, Copy, Check, LogIn, Mail, Lock } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useUserAuth } from '@/components/user/UserAuthProvider'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { AlertCircle } from 'lucide-react'

// ─── 3D Fan Card Preview ──────────────────────────────────────────────────────────────

function FanCard3DPreview({
  name,
}: {
  name: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 })

  const display = name || 'YOUR NAME'

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        const r = containerRef.current?.getBoundingClientRect()
        if (!r) return
        mouseX.set((e.clientX - r.left) / r.width - 0.5)
        mouseY.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      className="flex items-center justify-center p-4"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full max-w-xs"
      >
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            boxShadow: '0 25px 60px rgba(255,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)',
            aspectRatio: '1.62 / 1',
          }}
        >
          <div className="relative w-full h-full flex flex-col p-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-400 to-red-600" />
            
            <div className="absolute top-4 left-4 w-8 h-6 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5 opacity-60">
                {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-1 bg-yellow-700 rounded-sm" />)}
              </div>
            </div>

            <div className="absolute top-3 right-3 w-10 h-10 rounded-full overflow-hidden border-2 border-red-600/60">
              <Image src="/images/jvcd-avatar.jpg" alt="Jonathan Roumie" fill className="object-cover" />
            </div>

            <div className="absolute top-16 left-4 text-xs">
              <p className="text-white/40 tracking-widest text-[8px]">Official Member</p>
              <p className="text-white text-xs font-bold tracking-widest">JONATHAN ROUMIE</p>
            </div>

            <div className="absolute bottom-6 left-4 right-4">
              <motion.p
                key={name}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-white font-bold tracking-widest uppercase"
                style={{
                  fontSize: name.length > 20 ? '13px' : name.length > 12 ? '14px' : '16px',
                  textShadow: '0 0 20px rgba(255,0,0,0.6)',
                }}
              >
                {display}
              </motion.p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-white/60 text-[8px] tracking-widest">VERIFIED</span>
                <span className="text-red-400 text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function FanCardPage() {
  const { user } = useUserAuth()
  const router = useRouter()
  const [isSignup, setIsSignup] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [cardName, setCardName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Signup state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    country: '',
  })

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (!auth || !db) throw new Error('Firebase not initialized')

      if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.phone || !signupData.country) {
        throw new Error('Please fill all required fields')
      }

      const result = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password)
      
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        fullName: signupData.fullName,
        email: signupData.email,
        phone: signupData.phone,
        location: signupData.location || '',
        country: signupData.country,
        createdAt: new Date().toISOString(),
        cardPreference: signupData.fullName,
      })

      setMessage('Account created! Redirecting to dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (!auth || !db) throw new Error('Firebase not initialized')

      const result = await signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      const userData = userDoc.data()

      setMessage(`Welcome back, ${userData?.fullName}! Redirecting...`)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      const errorMsg = 
        err.code === 'auth/user-not-found' ? 'Email not registered' :
        err.code === 'auth/wrong-password' ? 'Incorrect password' :
        err.code === 'auth/invalid-email' ? 'Invalid email address' :
        err.message || 'Login failed'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header variant="main" />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Card Preview - Left */}
            <div className="order-2 lg:order-1">
              <div className="space-y-4">
                <h3 className="text-lg font-black tracking-widest text-gray-400">YOUR CARD PREVIEW</h3>
                <FanCard3DPreview name={cardName} />
              </div>
            </div>

            {/* Auth Form - Right */}
            <div className="order-1 lg:order-2">
              <motion.div
                key={isSignup ? 'signup' : 'login'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-black tracking-widest mb-2">
                    {isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}
                  </h2>
                  <p className="text-gray-400">
                    {isSignup 
                      ? 'Sign up to create your Jonathan Roumie fan card' 
                      : 'Access your fan card and dashboard'}
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 rounded-lg p-4 text-red-300">
                    <AlertCircle size={18} />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {message && (
                  <div className="flex items-center gap-3 bg-green-900/20 border border-green-800/50 rounded-lg p-4 text-green-300">
                    <CheckCircle size={18} />
                    <span className="text-sm">{message}</span>
                  </div>
                )}

                <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
                  {isSignup ? (
                    <>
                      <div>
                        <label className="text-sm font-bold block mb-2">FULL NAME</label>
                        <input
                          type="text"
                          value={signupData.fullName}
                          onChange={(e) => {
                            setSignupData({ ...signupData, fullName: e.target.value })
                            setCardName(e.target.value)
                          }}
                          placeholder="Your name"
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold block mb-2">EMAIL</label>
                        <input
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold block mb-2">PASSWORD</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? '✕' : '◉'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-bold block mb-2">PHONE</label>
                          <input
                            type="tel"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-bold block mb-2">COUNTRY</label>
                          <input
                            type="text"
                            value={signupData.country}
                            onChange={(e) => setSignupData({ ...signupData, country: e.target.value })}
                            placeholder="USA"
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold block mb-2">LOCATION (OPTIONAL)</label>
                        <input
                          type="text"
                          value={signupData.location}
                          onChange={(e) => setSignupData({ ...signupData, location: e.target.value })}
                          placeholder="City, State"
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-bold block mb-2">EMAIL</label>
                        <input
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold block mb-2">PASSWORD</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showPassword ? '✕' : '◉'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-bold tracking-widest transition-colors flex items-center justify-center gap-2 mt-6"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} />
                        {isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    {isSignup ? 'Already have an account?' : "Don't have an account?"}
                    <button
                      onClick={() => {
                        setIsSignup(!isSignup)
                        setError('')
                        setMessage('')
                      }}
                      className="text-blue-400 hover:text-blue-300 ml-2 font-bold"
                    >
                      {isSignup ? 'LOGIN' : 'SIGN UP'}
                    </button>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer variant="main" />
    </div>
  )
}
