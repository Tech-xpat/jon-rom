'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Download, CreditCard, Sparkles, Lock, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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

  // Prevent screenshot and right-click on the card
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    },
    [mouseX, mouseY]
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Vibration animation when name changes
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
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
        {/* Card body */}
        <div
          ref={cardRef}
          className="absolute inset-0 rounded-2xl overflow-hidden select-none"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            boxShadow: '0 25px 60px rgba(255,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08)',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            userSelect: 'none',
          }}
        >
          {/* Holographic sheen */}
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none rounded-2xl"
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            }}
          />

          {/* Red stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-jcvd-red via-red-400 to-jcvd-red" />

          {/* Chip */}
          <div className="absolute top-5 left-5 w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 opacity-60">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-yellow-700 rounded-sm" />
              ))}
            </div>
          </div>

          {/* Jonathan Roumie avatar */}
          <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 border-jcvd-red/60">
            <Image src="/images/jvcd-avatar.jpg" alt="Jonathan Roumie" fill className="object-cover" />
          </div>

          {/* Brand */}
          <div className="absolute top-[52px] left-5">
            <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Official Member</p>
            <p className="text-white text-xs font-bold tracking-[0.25em]">JONATHAN ROUMIE</p>
          </div>

          {/* Engraved name */}
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
                letterSpacing: '0.1em',
              }}
            >
              {displayName}
            </motion.p>
          </div>

          {/* Member ID & Year */}
          <div className="absolute bottom-3 left-5 right-5 flex justify-between items-center">
            <p className="text-white/40 text-[10px] tracking-widest font-mono">{memberId}</p>
            <p className="text-white/40 text-[10px] tracking-widest">{year}</p>
          </div>

          {/* Circuit pattern decoration */}
          <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" viewBox="0 0 340 210">
            <line x1="0" y1="100" x2="340" y2="100" stroke="white" strokeWidth="0.5" />
            <line x1="170" y1="0" x2="170" y2="210" stroke="white" strokeWidth="0.5" />
            <circle cx="170" cy="100" r="40" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="170" cy="100" r="70" stroke="white" strokeWidth="0.3" fill="none" />
          </svg>
        </div>

        {/* Card edge depth */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            transform: 'translateZ(-4px)',
            background: '#0a0a1a',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          }}
        />
      </motion.div>
    </div>
  )
}

// ─── Stripe Payment Modal ──────────────────────────────────────────────────────

function PaymentModal({
  onClose,
  onSuccess,
  price,
}: {
  onClose: () => void
  onSuccess: () => void
  price: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'fan-card' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Failed to start checkout. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-jcvd-red/20 flex items-center justify-center">
            <Lock size={20} className="text-jcvd-red" />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-widest">UNLOCK YOUR CARD</h3>
            <p className="text-jcvd-gray text-xs tracking-wide">One-time purchase</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-jcvd-gray text-sm">Jonathan Roumie Fan Card PDF</span>
            <span className="text-white font-bold">${(price / 100).toFixed(2)}</span>
          </div>
          <ul className="space-y-1">
            {['High-res PDF download', 'Personalized with your name', 'Official Jonathan Roumie design', 'Lifetime access'].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-jcvd-gray">
                <CheckCircle size={12} className="text-jcvd-teal" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {error && <p className="text-jcvd-red text-sm mb-4 text-center">{error}</p>}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-jcvd-red text-white py-3 rounded-xl font-bold tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <CreditCard size={18} />
          {loading ? 'REDIRECTING...' : 'PAY & DOWNLOAD'}
        </button>

        <p className="text-center text-jcvd-gray text-xs mt-4">
          Powered by Stripe. Secure & encrypted.
        </p>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function FanCardPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string }
}) {
  const [name, setName] = useState('')
  const [showPaywall, setShowPaywall] = useState(false)
  const [paid, setPaid] = useState(false)
  const [exporting, setExporting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const fanCardPrice = 499 // cents – will come from admin settings in prod

  // Generate deterministic member ID
  const memberId = `JR-${Math.abs(
    name.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0x12345)
  )
    .toString()
    .slice(0, 6)
    .padStart(6, '0')}`

  useEffect(() => {
    if (searchParams.success === '1') setPaid(true)
  }, [searchParams.success])

  const handleExport = async () => {
    if (!name.trim()) {
      alert('Please enter your name before downloading.')
      return
    }
    if (!paid) {
      setShowPaywall(true)
      return
    }
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
            <h1 className="text-white text-4xl md:text-6xl font-black tracking-widest mb-3">
              FAN CARD
            </h1>
            <p className="text-jcvd-gray text-sm tracking-widest max-w-sm mx-auto">
              Your name. Engraved in legend. Download your official Jonathan Roumie fan card.
            </p>
          </motion.div>
        </section>

        {/* 3D Card Preview */}
        <FanCard3D name={name} memberId={memberId} cardRef={cardRef} />

        {/* Name Input */}
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

          {/* CTA */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full bg-jcvd-red text-white py-4 rounded-xl font-bold tracking-[0.3em] hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {paid ? (
                <>
                  <Download size={20} />
                  {exporting ? 'GENERATING PDF...' : 'DOWNLOAD PDF'}
                </>
              ) : (
                <>
                  <Lock size={20} />
                  UNLOCK & DOWNLOAD — ${(fanCardPrice / 100).toFixed(2)}
                </>
              )}
            </button>

            {paid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 text-jcvd-teal text-sm"
              >
                <CheckCircle size={16} />
                <span>Payment successful! Your card is unlocked.</span>
              </motion.div>
            )}

            {searchParams.canceled === '1' && !paid && (
              <p className="text-center text-jcvd-gray text-sm">Payment canceled. Try again when ready.</p>
            )}
          </div>
        </motion.section>

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

      {/* Paywall modal */}
      {showPaywall && (
        <PaymentModal
          onClose={() => setShowPaywall(false)}
          onSuccess={() => { setPaid(true); setShowPaywall(false) }}
          price={fanCardPrice}
        />
      )}
    </div>
  )
}
