'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Copy, Check } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function FanCardPage() {
  const [cardName, setCardName] = useState('')
  const [copied, setCopied] = useState(false)
  const [fanCardPrice, setFanCardPrice] = useState(25.00)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch fan card price from API
    const fetchPrice = async () => {
      try {
        const res = await fetch('/api/pricing?type=fancard')
        const data = await res.json()
        setFanCardPrice(data.price)
      } catch (error) {
        console.error('Failed to fetch fan card price:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPrice()

    // Poll for price updates every 5 seconds for real-time changes
    const interval = setInterval(fetchPrice, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleCopyName = () => {
    if (cardName) {
      navigator.clipboard.writeText(cardName)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadCard = () => {
    if (!cardName) {
      alert('Please enter your name first')
      return
    }
    alert(`Download feature for "${cardName}" card coming soon!`)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-20 sm:pt-24 pb-12 px-4">
        <section className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen">
            {/* Left: Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="ENTER YOUR NAME"
                maxLength={30}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-base"
                autoFocus
              />

              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyName}
                  disabled={!cardName}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check size={20} />
                      COPIED
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      COPY
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadCard}
                  disabled={!cardName}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Download size={20} />
                  DOWNLOAD
                </motion.button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-2">PRICE</p>
                <p className="text-blue-400 text-3xl font-black">
                  {loading ? '...' : `$${fanCardPrice.toFixed(2)}`}
                </p>
              </div>
            </motion.div>

            {/* Right: Card Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 p-1 shadow-2xl w-full max-w-sm"
              >
                <div className="relative bg-black rounded-2xl p-8 space-y-6">
                  <div>
                    <h2 className="text-white text-2xl font-black tracking-widest">
                      JONATHAN ROUMIE
                    </h2>
                    <p className="text-blue-300 text-sm tracking-widest">
                      OFFICIAL FAN CARD
                    </p>
                  </div>

                  <motion.div
                    key={cardName}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                    className="bg-gradient-to-r from-yellow-400 via-pink-500 to-red-600 rounded-xl p-6 min-h-32 flex items-center justify-center"
                  >
                    <p className="text-black font-black text-4xl tracking-widest text-center break-words">
                      {cardName || 'YOUR NAME'}
                    </p>
                  </motion.div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-t border-white/10">
                      <span className="text-gray-400 text-xs">ID</span>
                      <span className="text-white font-bold">JR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-white/10">
                      <span className="text-gray-400 text-xs">STATUS</span>
                      <span className="text-green-400 font-black">✓ VERIFIED</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
