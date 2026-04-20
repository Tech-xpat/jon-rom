'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Download, CreditCard, Sparkles, CheckCircle, Copy, Check,
  Bitcoin, Clock, AlertCircle, ChevronDown, LogIn, Loader2,
} from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useUserAuth } from '@/components/user/UserAuthProvider'

// ─── 3D Fan Card ──────────────────────────────────────────────────────────────

function FanCard3D({
  name, memberId, cardRef,
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

  const [isVibrating, setIsVibrating] = useState(false)
  const prevName = useRef(name)
  useEffect(() => {
    if (name !== prevName.current) {
      setIsVibrating(true)
      const t = setTimeout(() => setIsVibrating(false), 300)
      prevName.current = name
      return () => clearTimeout(t)
    }
  }, [name])

  const displayName = name || 'YOUR NAME'
  const year = new Date().getFullYear()

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
        mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
      onContextMenu={(e) => e.preventDefault()}
      className="flex items-center justify-center p-8 select-none"
      style={{ perspective: '1000px', WebkitUserSelect: 'none' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={
          isVibrating
            ? { x: [-3, 3, -3, 3, 0], transition: { duration: 0.25, ease: 'easeOut' } }
            : {}
        }
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
            className="absolute inset-0 opacity-30 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-jcvd-red via-red-400 to-jcvd-red" />
          <div className="absolute top-5 left-5 w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 opacity-60">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-yellow-700 rounded-sm" />
              ))}
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
              initial={{ opacity: 0, y: 4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-white font-bold tracking-[0.15em] uppercase truncate"
              style={{
                fontSize: name.length > 20 ? '13px' : name.length > 12 ? '16px' : '20px',
                textShadow: '0 0 20px rgba(255,0,0,0.6), 0 1px 0 rgba(0,0,0,0.8)',
              }}
            >
              {displayName}
            </motion.p>
          </div>
          <div className="absolute bottom-3 left-5 right-5 flex justify-between items-center">
            <p className="text-white/40 text-[10px] tracking-widest font-mono">{memberId}</p>
            <p className="text-white/40 text-[10px] tracking-widest">{year}</p>
          </div>
          <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 340 210">
            <line x1="0" y1="100" x2="340" y2="100" stroke="white" strokeWidth="0.5" />
            <line x1="170" y1="0" x2="170" y2="210" stroke="white" strokeWidth="0.5" />
            <circle cx="170" cy="100" r="40" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="170" cy="100" r="70" stroke="white" strokeWidth="0.3" fill="none" />
          </svg>
        </div>
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ transform: 'translateZ(-4px)', background: '#0a0a1a', boxShadow: '0 30px 60px rgba(0,0,0,0.6)' }}
        />
      </motion.div>
    </div>
  )
}

// ─── Copy Address Button ───────────────────────────────────────────────────────

function CopyButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${copied
          ? 'bg-green-900/40 border border-green-600/50 text-green-400'
          : 'bg-white/8 border border-white/10 text-gray-300 hover:bg-white/15 hover:border-white/20'
        }`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
            <Check size={14} />
            Copied!
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
            <Copy size={14} />
            Copy Address
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

// ─── Payment Step ──────────────────────────────────────────────────────────────

type PayMethod = 'USDT' | 'BTC'

interface Wallets {
  btc?: { address: string }
  usdt?: { address: string }
}

function PaymentStep({
  wallets,
  price,
  onSubmit,
  submitting,
}: {
  wallets: Wallets
  price: number
  onSubmit: (currency: PayMethod) => void
  submitting: boolean
}) {
  const hasBtc = !!wallets.btc?.address
  const hasUsdt = !!wallets.usdt?.address
  const [method, setMethod] = useState<PayMethod>(hasUsdt ? 'USDT' : 'BTC')
  const address = method === 'BTC' ? wallets.btc?.address : wallets.usdt?.address

  if (!hasBtc && !hasUsdt) {
    return (
      <div className="text-center py-10 px-4">
        <AlertCircle size={32} className="text-yellow-500 mx-auto mb-3" />
        <p className="text-white font-semibold mb-1">Payment Not Yet Configured</p>
        <p className="text-gray-400 text-sm">The admin hasn't set up payment addresses yet. Please check back soon.</p>
      </div>
    )
  }

  const priceUsd = (price / 100).toFixed(2)

  return (
    <div className="space-y-6">
      {/* Price Summary */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
        <div>
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-0.5">Fan Card</p>
          <p className="text-white font-bold">Jonathan Roumie Official</p>
        </div>
        <p className="text-white text-2xl font-black">${priceUsd}</p>
      </div>

      {/* Method Tabs */}
      {hasBtc && hasUsdt && (
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
      )}

      {/* Wallet Address */}
      <AnimatePresence mode="wait">
        <motion.div
          key={method}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          <div className={`rounded-xl border p-5 space-y-4 ${method === 'USDT'
              ? 'bg-green-950/20 border-green-800/30'
              : 'bg-orange-950/20 border-orange-800/30'
            }`}>
            <div className="flex items-center gap-2">
              {method === 'BTC'
                ? <Bitcoin size={18} className="text-orange-400" />
                : <span className="text-green-400 font-black text-base">₮</span>
              }
              <p className="text-xs tracking-widest uppercase font-semibold text-white/60">
                {method === 'BTC' ? 'Bitcoin (BTC) Address' : 'USDT Address (ERC-20 / Ethereum)'}
              </p>
            </div>

            {/* Address Box */}
            <div className="bg-black/40 border border-white/10 rounded-lg px-4 py-3">
              <p className="font-mono text-sm text-white break-all leading-relaxed select-all">
                {address}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <CopyButton address={address!} />
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-widest">Amount to Send</p>
                <p className={`font-bold text-sm ${method === 'USDT' ? 'text-green-400' : 'text-orange-400'}`}>
                  {method === 'USDT' ? `${priceUsd} USDT` : `≈ $${priceUsd} USD in BTC`}
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-1.5">
            {[
              `Send exactly the amount shown to the address above`,
              method === 'USDT' ? 'Use the ERC-20 network (Ethereum) for USDT' : 'Double-check the BTC address before sending',
              'Once sent, click the button below to notify us',
              'Admin will verify and unlock your card within 24 hours',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-white/8 text-white/40 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-gray-400 text-xs leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Submit Button */}
      <button
        onClick={() => onSubmit(method)}
        disabled={submitting}
        className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-4 rounded-xl font-bold tracking-widest transition-all disabled:opacity-60 flex items-center justify-center gap-3"
      >
        {submitting ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <CheckCircle size={20} />
            I HAVE SENT PAYMENT
          </>
        )}
      </button>

      <p className="text-center text-gray-600 text-xs">
        Only click after you have actually sent the crypto. False submissions will be ignored.
      </p>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

type Step = 'idle' | 'payment' | 'pending' | 'confirmed'

export default function FanCardPage() {
  const { user, loading: authLoading, getToken } = useUserAuth()

  const [name, setName] = useState('')
  const [step, setStep] = useState<Step>('idle')
  const [wallets, setWallets] = useState<Wallets>({})
  const [price, setPrice] = useState(499) // cents
  const [walletsLoading, setWalletsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [exporting, setExporting] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const paymentSectionRef = useRef<HTMLDivElement>(null)

  const memberId = `JR-${Math.abs(
    name.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0x12345)
  ).toString().slice(0, 6).padStart(6, '0')}`

  // Load wallets + price
  useEffect(() => {
    const load = async () => {
      try {
        const [walletsRes, priceRes] = await Promise.all([
          fetch('/api/checkout/wallets'),
          fetch('/api/fan-card/price'),
        ])
        if (walletsRes.ok) setWallets(await walletsRes.json())
        if (priceRes.ok) {
          const p = await priceRes.json()
          setPrice(p.price || 499)
        }
      } catch {
        // silently fall back to defaults
      } finally {
        setWalletsLoading(false)
      }
    }
    load()
  }, [])

  // Check user's payment status on load
  useEffect(() => {
    if (!user || authLoading) return
    const checkStatus = async () => {
      try {
        const token = await getToken()
        if (!token) return
        const res = await fetch('/api/user/status', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const data = await res.json()
        if (data.paymentStatus === 'confirmed') setStep('confirmed')
        else if (data.paymentStatus === 'pending') setStep('pending')
      } catch { /* ignore */ }
    }
    checkStatus()
  }, [user, authLoading, getToken])

  const handleApply = () => {
    if (!name.trim()) return
    setStep('payment')
    setTimeout(() => {
      paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleSubmitPayment = async (currency: PayMethod) => {
    if (!user) return
    setSubmitting(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currency, amount: price / 100 }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to submit payment')
      }
      setStep('pending')
      setTimeout(() => {
        paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: any) {
      alert(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleExport = async () => {
    if (!name.trim()) { alert('Please enter your name before downloading.'); return }
    setExporting(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 53.98] })
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98)
      pdf.save(`JonathanRoumie-Fan-Card-${name.replace(/\s+/g, '-')}.pdf`)
    } catch (err) {
      console.error(err)
    } finally {
      setExporting(false)
    }
  }

  const priceUsd = (price / 100).toFixed(2)

  return (
    <div className="min-h-screen bg-black">
      <Header variant="main" />

      <main className="pt-20 pb-16">
        {/* Hero */}
        <section className="text-center px-4 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles size={16} className="text-jcvd-red" />
              <span className="text-jcvd-red text-xs tracking-[0.4em] uppercase">Exclusive</span>
              <Sparkles size={16} className="text-jcvd-red" />
            </div>
            <h1 className="text-white text-4xl md:text-6xl font-black tracking-widest mb-3">FAN CARD</h1>
            <p className="text-jcvd-gray text-sm tracking-widest max-w-sm mx-auto">
              Your name. Engraved in legend. Download your official Jonathan Roumie fan card.
            </p>
          </motion.div>
        </section>

        {/* 3D Card Preview */}
        <FanCard3D name={name} memberId={memberId} cardRef={cardRef} />

        {/* Name Input + CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="px-4 max-w-md mx-auto"
        >
          <label className="block text-jcvd-gray text-xs tracking-[0.4em] uppercase mb-2 text-center">
            Engrave Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 30))}
            placeholder="Enter your full name..."
            className="w-full bg-white/5 border border-white/10 text-white text-center text-xl tracking-widest px-4 py-4 rounded-xl focus:outline-none focus:border-jcvd-red transition-colors placeholder:text-white/20"
          />
          <p className="text-white/20 text-xs text-right mt-1">{name.length}/30</p>

          <div className="mt-6">
            {/* Already confirmed */}
            {step === 'confirmed' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                <div className="flex items-center justify-center gap-2 bg-green-900/20 border border-green-700/40 rounded-xl py-3 px-4">
                  <CheckCircle size={18} className="text-green-400" />
                  <span className="text-green-300 text-sm font-semibold tracking-wide">Payment confirmed — card unlocked!</span>
                </div>
                <button
                  onClick={handleExport}
                  disabled={exporting || !name.trim()}
                  className="w-full bg-jcvd-red text-white py-4 rounded-xl font-bold tracking-[0.3em] hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <Download size={20} />
                  {exporting ? 'GENERATING PDF...' : 'DOWNLOAD YOUR CARD'}
                </button>
              </motion.div>
            )}

            {/* Payment pending admin confirmation */}
            {step === 'pending' && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-5 text-center space-y-3"
              >
                <Clock size={28} className="text-yellow-400 mx-auto" />
                <div>
                  <p className="text-white font-bold tracking-wide">Payment Submitted</p>
                  <p className="text-yellow-300/80 text-sm mt-1">Awaiting admin verification — usually within 24 hours.</p>
                </div>
                <p className="text-gray-500 text-xs">
                  Once confirmed, your card download will unlock automatically. Check back here.
                </p>
              </motion.div>
            )}

            {/* Idle — show apply button */}
            {step === 'idle' && (
              authLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={22} className="text-gray-500 animate-spin" />
                </div>
              ) : !user ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center space-y-3">
                  <LogIn size={24} className="text-jcvd-red mx-auto" />
                  <p className="text-white font-semibold">Sign in to apply</p>
                  <p className="text-gray-400 text-sm">You need to be signed in to apply for a fan card.</p>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={!name.trim()}
                  className="w-full bg-jcvd-red text-white py-4 rounded-xl font-bold tracking-[0.3em] hover:bg-red-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-3"
                >
                  <CreditCard size={20} />
                  APPLY & PAY WITH CRYPTO — ${priceUsd}
                  <ChevronDown size={18} className="ml-1" />
                </button>
              )
            )}

            {/* Payment step — show button to re-open if collapsed */}
            {step === 'payment' && (
              <button
                onClick={() => {
                  paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="w-full bg-white/5 border border-white/10 text-gray-300 py-3 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronDown size={16} />
                Scroll to payment details
              </button>
            )}
          </div>
        </motion.section>

        {/* ── Inline Payment Section ── */}
        <AnimatePresence>
          {step === 'payment' && (
            <motion.div
              ref={paymentSectionRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mt-10 px-4 max-w-md mx-auto"
            >
              {/* Divider */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-jcvd-red text-xs tracking-[0.4em] uppercase font-semibold">Payment Details</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6">
                {walletsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={28} className="text-gray-500 animate-spin" />
                  </div>
                ) : (
                  <PaymentStep
                    wallets={wallets}
                    price={price}
                    onSubmit={handleSubmitPayment}
                    submitting={submitting}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
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
