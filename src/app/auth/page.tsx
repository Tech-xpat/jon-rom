'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { Mail, Lock, User, MapPin, Phone, Globe, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isBotChecked, setIsBotChecked] = useState(true)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const router = useRouter()

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (!auth || !db) throw new Error('Firebase not initialized')
      if (!isBotChecked) {
        throw new Error('Please verify you are not a robot')
      }

      if (!signupData.fullName || !signupData.email || !signupData.password || !signupData.phone || !signupData.country) {
        throw new Error('Please fill all required fields')
      }

      // Create Firebase Auth user
      const result = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password)
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        fullName: signupData.fullName,
        email: signupData.email,
        phone: signupData.phone,
        location: signupData.location || 'Not provided',
        country: signupData.country,
        createdAt: new Date().toISOString(),
        status: 'pending',
        approved: false,
        whitelisted: false,
        cardLevel: 'basic',
        cardNumber: '',
        paymentStatus: 'unpaid',
        membershipLevel: 'basic',
        cardsGenerated: 0,
        maxCards: 1,
        fanStatus: 'pending',
        profile: {
          verified: false,
        },
      })

      setMessage('Account created successfully! Redirecting to dashboard...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      const errorMsg = 
        err.code === 'auth/email-already-in-use' ? 'Email already registered' :
        err.code === 'auth/weak-password' ? 'Password must be at least 6 characters' :
        err.code === 'auth/invalid-email' ? 'Invalid email address' :
        err.message || 'Signup failed'
      setError(errorMsg)
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
      if (!isBotChecked) {
        throw new Error('Please verify you are not a robot')
      }

      const result = await signInWithEmailAndPassword(auth, loginData.email, loginData.password)
      
      // Get user data to show status
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      const userData = userDoc.data()

      setMessage(`Welcome back, ${userData?.fullName}! Redirecting to dashboard...`)
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (!auth) throw new Error('Firebase not initialized')
      await sendPasswordResetEmail(auth, forgotPasswordEmail)
      setMessage('Password reset email sent! Check your inbox.')
      setForgotPasswordEmail('')
      setTimeout(() => {
        setShowForgotPassword(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-black tracking-widest">JONATHAN ROUMIE WORLD</h1>
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>
      </header>

      <main className="pt-20 pb-16 px-4">
        <div className="max-w-md mx-auto">
          {showForgotPassword ? (
            // Forgot Password Form
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black tracking-widest mb-2">RESET PASSWORD</h2>
                <p className="text-gray-400 text-sm">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleForgotPassword} className="bg-white/3 border border-white/10 rounded-2xl p-8 space-y-4">
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

                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  required
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Email'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full text-gray-400 hover:text-white py-2 transition-colors"
                >
                  Back to Login
                </button>
              </form>
            </motion.div>
          ) : (
            // Signup/Login Forms
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => { setIsSignup(false); setError(''); setMessage('') }}
                  className={`flex-1 py-2 rounded font-semibold transition-colors ${
                    !isSignup ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsSignup(true); setError(''); setMessage('') }}
                  className={`flex-1 py-2 rounded font-semibold transition-colors ${
                    isSignup ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Signup
                </button>
              </div>

              <form onSubmit={isSignup ? handleSignup : handleLogin} className="bg-white/3 border border-white/10 rounded-2xl p-8 space-y-4">
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

                {isSignup && (
                  <>
                    <div>
                      <label className="text-gray-400 text-xs tracking-widest block mb-2">FULL NAME</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                          type="text"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                          placeholder="Your Full Name"
                          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs tracking-widest block mb-2">PHONE NUMBER</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                          type="tel"
                          value={signupData.phone}
                          onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                          placeholder="+1 (555) 123-4567"
                          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs tracking-widest block mb-2">LOCATION</label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                          type="text"
                          value={signupData.location}
                          onChange={(e) => setSignupData({...signupData, location: e.target.value})}
                          placeholder="City, State (Optional)"
                          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-xs tracking-widest block mb-2">COUNTRY</label>
                      <div className="relative">
                        <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                          type="text"
                          value={signupData.country}
                          onChange={(e) => setSignupData({...signupData, country: e.target.value})}
                          placeholder="Your Country"
                          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="text-gray-400 text-xs tracking-widest block mb-2">EMAIL ADDRESS</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type="email"
                      value={isSignup ? signupData.email : loginData.email}
                      onChange={(e) => isSignup 
                        ? setSignupData({...signupData, email: e.target.value})
                        : setLoginData({...loginData, email: e.target.value})
                      }
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs tracking-widest block mb-2">PASSWORD</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={isSignup ? signupData.password : loginData.password}
                      onChange={(e) => isSignup 
                        ? setSignupData({...signupData, password: e.target.value})
                        : setLoginData({...loginData, password: e.target.value})
                      }
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
                  <input
                    type="checkbox"
                    checked={isBotChecked}
                    onChange={(e) => setIsBotChecked(e.target.checked)}
                    className="w-5 h-5 rounded cursor-pointer"
                    id="robot-check"
                  />
                  <label htmlFor="robot-check" className="text-sm text-gray-400 cursor-pointer">
                    I&apos;m not a robot
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isBotChecked}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    isSignup ? 'CREATE ACCOUNT' : 'SIGN IN'
                  )}
                </button>

                {!isSignup && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-blue-400 hover:text-blue-300 py-2 text-sm transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
