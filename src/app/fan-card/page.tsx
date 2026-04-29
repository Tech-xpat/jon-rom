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

      <main className="pt-20 sm:pt-24 pb-12">
        <section className="px-4 sm:px-6 py-12 sm:py-16 md:py-20 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-black tracking-widest mb-4">
              CREATE YOUR FAN CARD
            </h1>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 max-w-2xl mx-auto">
              Personalize your own Jonathan Roumie fan card. Watch your name appear on the card in real-time as you type.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <label className="text-white font-bold text-sm tracking-widest block mb-3">
                  ENTER YOUR NAME
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="TYPE YOUR NAME HERE"
                  maxLength={30}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                  autoFocus
                />
                <p className="text-gray-500 text-xs mt-2">
                  {cardName.length}/30 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyName}
                  disabled={!cardName}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check size={20} />
                      NAME COPIED!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      COPY NAME
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadCard}
                  disabled={!cardName}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm sm:text-base disabled:opacity-50"
                >
                  <Download size={20} />
                  DOWNLOAD CARD
                </motion.button>
              </div>

              {/* Price Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/50 rounded-lg p-4 sm:p-6"
              >
                <p className="text-gray-400 text-xs tracking-widest mb-2">FAN CARD PRICE</p>
                {loading ? (
                  <p className="text-white text-2xl font-black animate-pulse">LOADING...</p>
                ) : (
                  <p className="text-blue-400 text-3xl sm:text-4xl font-black">${fanCardPrice.toFixed(2)}</p>
                )}
                <p className="text-gray-500 text-xs mt-3">Real-time pricing updates every 5 seconds</p>
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-800/50 rounded-lg p-4 sm:p-6 space-y-4"
              >
                <p className="text-white font-bold text-sm tracking-widest">PAYMENT METHODS</p>
                <div className="space-y-3 text-xs sm:text-sm">
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
              </motion.div>
            </motion.div>

            {/* Right: Card Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="flex items-center justify-center">
                <div className="w-full max-w-sm">
                  {/* Card Container */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 p-1 shadow-2xl"
                  >
                    <div className="relative bg-black rounded-2xl p-6 sm:p-8 space-y-6 min-h-96">
                      {/* Card Header */}
                      <div className="space-y-2">
                        <h2 className="text-white text-xl sm:text-2xl font-black tracking-widest">
                          JONATHAN ROUMIE
                        </h2>
                        <p className="text-blue-300 text-sm tracking-widest font-bold">
                          OFFICIAL FAN CARD
                        </p>
                      </div>

                      {/* Name Display - Main Focus with Animation */}
                      <motion.div
                        key={cardName}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                        className="bg-gradient-to-r from-yellow-400 via-pink-500 to-red-600 rounded-xl p-4 sm:p-6 text-center min-h-24 sm:min-h-28 flex items-center justify-center"
                      >
                        <p className="text-black font-black text-2xl sm:text-3xl md:text-4xl tracking-widest break-words text-pretty">
                          {cardName || 'YOUR NAME'}
                        </p>
                      </motion.div>

                      {/* Card Details */}
                      <div className="space-y-3 text-sm text-gray-300">
                        <div className="flex justify-between items-center py-3 border-t border-white/10">
                          <span className="text-gray-400 text-xs">MEMBER ID</span>
                          <span className="text-white font-bold text-sm">JR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-t border-white/10">
                          <span className="text-gray-400 text-xs">STATUS</span>
                          <span className="text-green-400 font-black text-lg">✓ VERIFIED</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Preview Hint */}
                  <p className="text-center text-gray-500 text-xs mt-4">
                    Your name updates in real-time
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
