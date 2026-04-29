'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Download, Copy, Check, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

function FanCard3DPreview({
  name,
  onTap,
}: {
  name: string
  onTap: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 })

  const display = name || 'TAP TO CUSTOMIZE'

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
      onClick={onTap}
      className="flex items-center justify-center p-4 cursor-pointer"
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

export default function FanCardPage() {
  const [cardName, setCardName] = useState('')
  const [copied, setCopied] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)

  const handleCopyName = () => {
    if (cardName) {
      navigator.clipboard.writeText(cardName)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadCard = () => {
    if (!cardName) {
      setShowNameInput(true)
      return
    }
    alert(`Download feature for "${cardName}" card - Coming soon!`)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header variant="main" />
      
      <main className="flex-1 pt-20 sm:pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Card Preview - Left */}
            <div className="order-2 lg:order-1">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black tracking-widest text-gray-400">TAP THE CARD</h3>
                <FanCard3DPreview name={cardName} onTap={() => setShowNameInput(true)} />
                <p className="text-gray-500 text-xs sm:text-sm text-center">Click or tap to customize your name</p>
              </div>
            </div>

            {/* Content - Right */}
            <div className="order-1 lg:order-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 sm:space-y-8"
              >
                <div>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-widest mb-3 sm:mb-4">
                    YOUR FAN CARD
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
                    Create your personalized Jonathan Roumie fan card instantly. No signup required. Customize with your name and download to share with the world.
                  </p>
                  <ul className="space-y-2 text-gray-300 text-xs sm:text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>Personalized with your name</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>3D interactive card design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>Download as image</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      <span>Share on social media</span>
                    </li>
                  </ul>
                </div>

                {/* Customization Section */}
                <AnimatePresence>
                  {showNameInput && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4"
                    >
                      <h3 className="text-white font-bold text-sm sm:text-base tracking-widest">CUSTOMIZE NAME</h3>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                        placeholder="ENTER YOUR NAME"
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                        maxLength={25}
                      />
                      <p className="text-gray-500 text-xs">{cardName.length}/25 characters</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNameInput(!showNameInput)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 sm:py-4 rounded-lg font-bold tracking-widest transition-all text-sm sm:text-base"
                  >
                    <Sparkles className="inline mr-2" size={18} />
                    {showNameInput ? 'DONE' : 'CUSTOMIZE'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadCard}
                    disabled={!cardName}
                    className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-6 py-3 sm:py-4 rounded-lg font-bold tracking-widest transition-all text-sm sm:text-base"
                  >
                    <Download className="inline mr-2" size={18} />
                    DOWNLOAD
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopyName}
                    disabled={!cardName}
                    className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-6 py-3 sm:py-4 rounded-lg font-bold tracking-widest transition-all text-sm sm:text-base"
                  >
                    {copied ? (
                      <>
                        <Check className="inline mr-2" size={18} />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="inline mr-2" size={18} />
                        COPY
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Payment Methods */}
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-800/50 rounded-2xl p-4 sm:p-6 space-y-4">
                  <p className="text-white font-bold text-xs sm:text-sm tracking-widest">PAYMENT OPTIONS</p>
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-3">
                      <div className="text-yellow-400 font-bold text-lg min-w-fit">₿</div>
                      <div>
                        <p className="text-white font-bold">Crypto (BTC / USDT)</p>
                        <p className="text-gray-400">Secure blockchain payments</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-green-400 font-bold text-lg min-w-fit">💵</div>
                      <div>
                        <p className="text-white font-bold">Cash App: $tinabeingblessed</p>
                        <p className="text-gray-400">Quick mobile payment</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400 font-bold text-lg min-w-fit">Ⓥ</div>
                      <div>
                        <p className="text-white font-bold">Venmo: Tina-McGowan-17</p>
                        <p className="text-gray-400">Peer-to-peer payment</p>
                      </div>
                    </div>
                  </div>
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
