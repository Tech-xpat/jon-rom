'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Download, CreditCard, Sparkles, CheckCircle, Copy, Check,
  Bitcoin, Clock, AlertCircle, Loader2, LogIn, Mail, User as UserIcon,
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useUserAuth } from '@/components/user/UserAuthProvider'

// ─── 3D Fan Card ──────────────────────────────────────────────────────────────

function FanCard3D({
  name,
  memberId,
  cardRef,
}: {
  name: string
  memberId: string
  cardRef: React.RefObject<HTMLDivElement>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 })
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const [vibrating, setVibrating] = useState(false)
  const prev = useRef(name)
  useEffect(() => {
    if (name !== prev.current) {
      setVibrating(true)
      const t = setTimeout(() => setVibrating(false), 300)
      prev.current = name
      return () => clearTimeout(t)
    }
  }, [name])

  const display = name || 'YOUR NAME'
  const year = new Date().getFullYear()

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
      onContextMenu={(e) => e.preventDefault()}
      className="flex items-center justify-center p-8 select-none"
      style={{ perspective: '1000px', WebkitUserSelect: 'none' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={vibrating ? { x: [-3, 3, -3, 3, 0], transition: { duration: 0.25 } } : {}}
        className="relative w-[340px] h-[210px] cursor-pointer"
      >
        <div
          ref={cardRef}
          className="absolute inset-0 rounded-2xl overflow-hidden select-none"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            boxShadow: '0 25px 60px rgba(255,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)',
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{ background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.4) 0%, transparent 60%)` }}
          />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-jcvd-red via-red-400 to-jcvd-red" />
          <div className="absolute top-5 left-5 w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 opacity-60">
              {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-yellow-700 rounded-sm" />)}
            </div>
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-jcvd-red/60">
            <Image src="/images/jvcd-avatar.jpg" alt="Jonathan Roumie" fill className="object-cover" />
          </div>
          <div className="absolute top-[52px] left-5">
            <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Official Member</p>
            <p className="text-white text-xs font-bold tracking-[0.25em]">JONATHAN ROUMIE</p>
          </div>
          <div className="absolute bottom-10 left-5 right-5">
            <motion.p
              key={name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-white font-bold tracking-[0.15em] uppercase truncate"
              style={{
                fontSize: name.length > 20 ? '13px' : name.length > 12 ? '16px' : '20px',
                textShadow: '0 0 20px rgba(255,0,0,0.6)',
              }}
            >
              {display}
            </motion.p>
          </div>
          <div className="absolute bottom-3 left-5 right-5 flex justify-between">
            <p className="text-white/40 text-[10px] tracking-widest font-mono">{memberId}</p>
            <p className="text-white/40 text-[10px] tracking-widest">{year}</p>
          </div>
          <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 340 210">
            <line x1="0" y1="100" x2="340" y2="100" stroke="white" strokeWidth="0.5" />
            <line x1="170" y1="0" x2="170" y2="210" stroke="white" strokeWidth="0.5" />
            <circle cx="170" cy="100" r="40" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ transform: 'translateZ(-4px)', background: '#0a0a1a', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }} />
      </motion.div>
    </div>
  )
}

// ─── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${copied
          ? 'bg-green-900/40 border border-green-600/50 text-green-300'
          : 'bg-white/8 border border-white/10 text-gray-300 hover:bg-white/15'
        }`}
    >
      <AnimatePresence mode="wait">
        {copied
          ? <motion.span key="y" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5"><Check size={14} />Copied!</motion.span>
          : <motion.span key="n" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5"><Copy size={14} />Copy Address</motion.span>
        }
      </AnimatePresence>
    </button>
  )
}

// ─── Wallet Display ────────────────────────────────────────────────────────────

type PayMethod = 'USDT' | 'BTC'

interface Wallets {
  btc?: { address: string }
  usdt?: { address: string }
}

function WalletDisplay({
  method, wallets, priceUsd,
}: {
  method: PayMethod
  wallets: Wallets
  priceUsd: string
}) {
  const address = method === 'BTC' ? wallets.btc?.address : wallets.usdt?.address
  if (!address) return null

  const isBtc = method === 'BTC'
  const color = isBtc ? 'orange' : 'green'
  const border = isBtc ? 'border-orange-800/30 bg-orange-950/20' : 'border-green-800/30 bg-green-950/20'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={method}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className={`rounded-xl border p-5 space-y-4 ${border}`}
      >
        <div className="flex items-center gap-2">
          {isBtc
            ? <Bitcoin size={16} className="text-orange-400" />
            : <span className="text-green-400 font-black text-sm">₮</span>
          }
          <p className="text-xs tracking-widest uppercase text-white/50 font-semibold">
            {isBtc ? 'Bitcoin (BTC) Address' : 'USDT — ERC-20 Ethereum'}
          </p>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-lg px-4 py-3">
          <p className="font-mono text-sm text-white break-all leading-relaxed select-all">{address}</p>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CopyButton address={address} />
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Send exactly</p>
            <p className={`font-bold text-sm ${isBtc ? 'text-orange-400' : 'text-green-400'}`}>
              {isBtc ? `≈ $${priceUsd} USD in BTC` : `${priceUsd} USDT`}
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {[
            isBtc ? 'Convert $' + priceUsd + ' to BTC at current market rate' : 'Send via ERC-20 network (Ethereum)',
            'Copy the address above — double-check before sending',
            'After sending, fill in your details below and submit',
          ].map((txt, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5 ${isBtc ? 'bg-orange-900/60 text-orange-300' : 'bg-green-900/60 text-green-300'
                }`}>{i + 1}</span>
              <p className="text-gray-400 text-xs leading-relaxed">{txt}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Application Form ──────────────────────────────────────────────────────────

function ApplicationForm({
  wallets,
  price,
  onSuccess,
  name,
  onNameChange,
}: {
  wallets: Wallets
  price: number
  onSuccess: (email: string) => void
  name: string
  onNameChange: (n: string) => void
}) {
  const hasBtc = !!wallets.btc?.address
  const hasUsdt = !!wallets.usdt?.address
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState<PayMethod>(hasUsdt ? 'USDT' : 'BTC')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const priceUsd = (price / 100).toFixed(2)

  const handleSubmit = async () => {
    setError(null)
    if (!name.trim()) { setError('Please enter the name to engrave on your card.'); return }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return }
    const addr = method === 'BTC' ? wallets.btc?.address : wallets.usdt?.address
    if (!addr) { setError('Payment method not available. Please try the other option.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), name: name.trim(), currency: method, amount: parseFloat(priceUsd) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      onSuccess(email.toLowerCase().trim())
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!hasBtc && !hasUsdt) {
    return (
      <div className="text-center py-10">
        <AlertCircle size={28} className="text-yellow-500 mx-auto mb-3" />
        <p className="text-white font-semibold">Payment Not Yet Configured</p>
        <p className="text-gray-400 text-sm mt-1">Please check back soon.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Price header */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
        <div>
          <p className="text-gray-500 text-xs tracking-widest uppercase mb-0.5">Jonathan Roumie</p>
          <p className="text-white font-bold">Official Fan Card</p>
        </div>
        <div className="text-right">
          <p className="text-white text-2xl font-black">${priceUsd}</p>
          <p className="text-gray-500 text-xs">one-time</p>
        </div>
      </div>

      {/* Payment method */}
      {hasBtc && hasUsdt && (
        <div>
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-2">Choose Payment Method</p>
          <div className="flex gap-2">
            {(['USDT', 'BTC'] as PayMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-widest transition-all ${method === m
                    ? m === 'USDT'
                      ? 'bg-green-900/40 border border-green-600/60 text-green-300'
                      : 'bg-orange-900/40 border border-orange-600/60 text-orange-300'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/8'
                  }`}
              >
                {m === 'BTC' ? '₿ BITCOIN' : '₮ USDT'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wallet address */}
      <WalletDisplay method={method} wallets={wallets} priceUsd={priceUsd} />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <p className="text-gray-600 text-xs tracking-widest">AFTER SENDING, FILL IN BELOW</p>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Name field */}
      <div>
        <label className="flex items-center gap-2 text-gray-400 text-xs tracking-widest uppercase mb-2">
          <UserIcon size={12} />
          Name to Engrave on Card
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value.slice(0, 30))}
          placeholder="Your Full Name"
          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-jcvd-red transition-colors placeholder:text-white/20 text-lg tracking-widest text-center"
        />
        <p className="text-right text-white/20 text-xs mt-1">{name.length}/30</p>
      </div>

      {/* Email field */}
      <div>
        <label className="flex items-center gap-2 text-gray-400 text-xs tracking-widest uppercase mb-2">
          <Mail size={12} />
          Your Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-jcvd-red transition-colors placeholder:text-white/20"
        />
        <p className="text-gray-600 text-xs mt-1.5">
          Used to link your payment. Sign in with this Google account later to download.
        </p>
      </div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3"
        >
          <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-jcvd-red hover:bg-red-700 active:bg-red-800 text-white py-4 rounded-xl font-bold tracking-widest transition-all disabled:opacity-60 flex items-center justify-center gap-3"
      >
        {submitting
          ? <><Loader2 size={20} className="animate-spin" />Submitting...</>
          : <><CheckCircle size={20} />I HAVE SENT PAYMENT</>
        }
      </button>

      <p className="text-center text-gray-600 text-xs">
        Only submit after you have actually sent the crypto. Admin verifies every payment manually.
      </p>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type PageState = 'loading' | 'apply' | 'submitted' | 'awaiting' | 'whitelisted'

export default function FanCardPage() {
  const { user, loading: authLoading, whitelisted, login, logout, getToken } = useUserAuth()

  const [pageState, setPageState] = useState<PageState>('loading')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [wallets, setWallets] = useState<Wallets>({})
  const [price, setPrice] = useState(499)
  const [walletsLoading, setWalletsLoading] = useState(true)
  const [cardName, setCardName] = useState('')
  const [exporting, setExporting] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)

  const memberId = `JR-${Math.abs(
    cardName.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0x12345)
  ).toString().slice(0, 6).padStart(6, '0')}`

  // Load wallets + price (public, no auth needed)
  useEffect(() => {
    Promise.all([
      fetch('/api/checkout/wallets').then(r => r.ok ? r.json() : {}),
      fetch('/api/fan-card/price').then(r => r.ok ? r.json() : { price: 499 }),
    ]).then(([w, p]) => {
      setWallets(w)
      setPrice(p.price || 499)
    }).finally(() => setWalletsLoading(false))
  }, [])

  // Determine page state based on auth + whitelist status
  useEffect(() => {
    if (authLoading) { setPageState('loading'); return }

    if (user) {
      // Signed in — check whitelisted field from UserAuthProvider
      if (whitelisted) {
        setPageState('whitelisted')
      } else {
        // Also check paymentStatus via API to distinguish apply vs awaiting
        const checkStatus = async () => {
          try {
            const token = await getToken()
            if (!token) { setPageState('apply'); return }
            const res = await fetch('/api/user/status', { headers: { Authorization: `Bearer ${token}` } })
            if (!res.ok) { setPageState('apply'); return }
            const data = await res.json()
            if (data.paymentStatus === 'pending' || data.paymentStatus === 'confirmed') {
              setPageState('awaiting')
            } else {
              setPageState('apply')
            }
          } catch { setPageState('apply') }
        }
        checkStatus()
              }
      } else {
      // Not signed in
      setPageState(pageState === 'submitted' ? 'submitted' : 'apply')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, whitelisted])

  const handlePaymentSuccess = (email: string) => {
    setSubmittedEmail(email)
    setPageState('submitted')
  }

  const handleGoogleSignIn = async () => {
    setLoginLoading(true)
    try {
      await login() // triggers Google redirect
    } catch { setLoginLoading(false) }
  }

  const handleExport = async () => {
    if (!cardName.trim()) { alert('Enter your name to engrave on the card first.'); return }
    setExporting(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 53.98] })
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98)
      pdf.save(`JonathanRoumie-Fan-Card-${cardName.replace(/\s+/g, '-')}.pdf`)
    } catch (err) { console.error(err) }
    finally { setExporting(false) }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header variant="main" />

      <main className="pt-20 pb-16">
        {/* ── Hero ── */}
        <section className="text-center px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles size={16} className="text-jcvd-red" />
              <span className="text-jcvd-red text-xs tracking-[0.4em] uppercase">Exclusive</span>
              <Sparkles size={16} className="text-jcvd-red" />
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black tracking-widest mb-3">FAN CARD</h1>
            <p className="text-jcvd-gray text-sm tracking-widest max-w-sm mx-auto">
              Official Jonathan Roumie fan membership card. Pay with crypto, get whitelisted, download.
            </p>
          </motion.div>
        </section>

        {/* ── 3D Card Preview ── */}
        <FanCard3D name={cardName} memberId={memberId} cardRef={cardRef} />

        {/* ── Main Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="px-4 max-w-md mx-auto mt-4"
        >
          <AnimatePresence mode="wait">

            {/* ── Loading ── */}
            {pageState === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center justify-center py-16"
              >
                <Loader2 size={28} className="text-gray-500 animate-spin" />
              </motion.div>
            )}

            {/* ── Apply: Payment Form (no auth needed) ── */}
            {pageState === 'apply' && (
              <motion.div key="apply" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-jcvd-red text-xs tracking-[0.4em] uppercase font-semibold">Apply for Fan Card</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {walletsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={24} className="text-gray-500 animate-spin" />
                  </div>
                ) : (
                  <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6">
                    <ApplicationForm wallets={wallets} price={price} onSuccess={handlePaymentSuccess} name={cardName} onNameChange={setCardName} />
                  </div>
                )}

                {/* Already signed in? */}
                {user && (
                  <div className="mt-4 bg-white/3 border border-white/8 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white text-sm font-semibold">{user.email}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Signed in — but not yet whitelisted</p>
                    </div>
                    <button onClick={logout} className="text-gray-500 hover:text-white text-xs transition-colors whitespace-nowrap">
                      Sign out
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Submitted: payment recorded, prompt Google sign-in ── */}
            {pageState === 'submitted' && (
              <motion.div key="submitted" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Success banner */}
                <div className="bg-green-950/40 border border-green-800/50 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-green-400" />
                  </div>
                  <h2 className="text-white text-xl font-black tracking-wide mb-2">Payment Submitted!</h2>
                  <p className="text-green-300/80 text-sm leading-relaxed">
                    Your payment has been recorded for <span className="font-semibold text-green-300">{submittedEmail}</span>.
                    Admin will verify it and whitelist you within 24 hours.
                  </p>
                </div>

                {/* What happens next */}
                <div className="bg-white/3 border border-white/8 rounded-2xl p-5 space-y-4">
                  <p className="text-white font-semibold text-sm tracking-widest">WHAT HAPPENS NEXT</p>
                  {[
                    { step: '1', text: 'Admin verifies your crypto payment on-chain', done: false },
                    { step: '2', text: 'Your email is whitelisted as an official fan', done: false },
                    { step: '3', text: 'Sign in with Google using this email to download your card', done: false },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-jcvd-red/20 border border-jcvd-red/40 text-jcvd-red text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {step}
                      </span>
                      <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>

                {/* Google sign-in CTA */}
                <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 text-center space-y-4">
                  <p className="text-gray-400 text-sm">
                    Already confirmed? Sign in with Google to check your whitelist status and download your card.
                  </p>
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loginLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {loginLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                      </>
                    )}
                  </button>
                  <p className="text-gray-600 text-xs">
                    Make sure to sign in with <span className="text-gray-400 font-mono">{submittedEmail}</span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Awaiting: payment submitted, not yet whitelisted ── */}
            {pageState === 'awaiting' && (
              <motion.div key="awaiting" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-yellow-950/30 border border-yellow-800/40 rounded-2xl p-7 text-center">
                  <div className="w-14 h-14 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock size={28} className="text-yellow-400" />
                  </div>
                  <h2 className="text-white text-xl font-black mb-2">Application Under Review</h2>
                  <p className="text-yellow-300/80 text-sm leading-relaxed">
                    Your payment is being verified by our admin team. Once confirmed, your card download will unlock automatically.
                  </p>
                  {user?.email && (
                    <p className="text-gray-500 text-xs mt-3 font-mono">{user.email}</p>
                  )}
                </div>

                <div className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center space-y-3">
                  <p className="text-gray-400 text-sm">Verification usually takes up to 24 hours. Check back here.</p>
                  <button onClick={logout} className="text-gray-500 hover:text-white text-xs transition-colors">
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Whitelisted: approved, ready to download ── */}
            {pageState === 'whitelisted' && (
              <motion.div key="whitelisted" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Status badge */}
                <div className="flex items-center justify-center gap-2 bg-green-900/20 border border-green-700/30 rounded-full py-2 px-5 mx-auto w-fit">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-green-300 text-sm font-semibold tracking-wide">Verified Fan — Card Unlocked</span>
                </div>

                {/* Name input */}
                <div>
                  <label className="block text-gray-400 text-xs tracking-[0.4em] uppercase mb-2 text-center">
                    Engrave Your Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.slice(0, 30))}
                    placeholder="Enter your full name..."
                    className="w-full bg-white/5 border border-white/10 text-white text-center text-xl tracking-widest px-4 py-4 rounded-xl focus:outline-none focus:border-jcvd-red transition-colors placeholder:text-white/20"
                  />
                  <p className="text-right text-white/20 text-xs mt-1">{cardName.length}/30</p>
                </div>

                {/* Download button */}
                <button
                  onClick={handleExport}
                  disabled={exporting || !cardName.trim()}
                  className="w-full bg-jcvd-red hover:bg-red-700 text-white py-4 rounded-xl font-bold tracking-[0.3em] transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Download size={20} />
                  {exporting ? 'GENERATING PDF...' : 'DOWNLOAD YOUR CARD'}
                </button>

                {/* User info + sign out */}
                {user && (
                  <div className="flex items-center justify-between bg-white/3 border border-white/8 rounded-xl px-5 py-3">
                    <p className="text-gray-400 text-sm font-mono truncate">{user.email}</p>
                    <button onClick={logout} className="text-gray-600 hover:text-white text-xs transition-colors ml-4 whitespace-nowrap">
                      Sign out
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {/* ── Sign in prompt for non-auth users on apply state ── */}
          {pageState === 'apply' && !user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white/3 border border-white/8 rounded-2xl px-5 py-5"
            >
              <p className="text-gray-400 text-sm text-center mb-4">
                Already applied and whitelisted? Sign in to download your card.
              </p>
              <button
                onClick={handleGoogleSignIn}
                disabled={loginLoading}
                className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 text-sm"
              >
                {loginLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                Sign in with Google
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
          className="mt-16 px-4 max-w-md mx-auto grid grid-cols-3 gap-4 text-center"
        >
          {[
            { icon: Sparkles, label: '3D Design', desc: 'Holographic finish' },
            { icon: CreditCard, label: 'Credit Card Size', desc: 'Print-ready PDF' },
            { icon: CheckCircle, label: 'Official', desc: 'Jonathan Roumie certified' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white/3 border border-white/5 rounded-xl p-4">
              <Icon size={20} className="text-jcvd-red mx-auto mb-2" />
              <p className="text-white text-xs font-bold tracking-wide">{label}</p>
              <p className="text-jcvd-gray text-[10px] mt-1">{desc}</p>
            </div>
          ))}
        </motion.section>
      </main>

      <Footer variant="main" />
    </div>
  )
              }
        
