'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function FanCardSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-transparent via-red-900/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Card Preview on Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
              {/* Card Image at Top */}
              <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src="/images/jvcd-avatar.jpg"
                  alt="Card Banner"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-white text-xs sm:text-sm font-bold tracking-widest">JONATHAN ROUMIE</h3>
                  <h3 className="text-white text-xs sm:text-sm font-bold tracking-widest">FAN CARD</h3>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <p className="text-white/70 text-xs tracking-wide">PERSONALIZED CARD</p>
                  <p className="text-white text-xl sm:text-2xl md:text-3xl font-black tracking-wider">YOUR NAME HERE</p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white text-xs font-bold tracking-widest">VERIFIED MEMBER</span>
                  <div className="w-10 h-8 sm:w-12 sm:h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content on Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-6 sm:space-y-8"
          >
            <div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 tracking-widest">
                GET YOUR FAN CARD
              </h2>
              <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed">
                Create your official Jonathan Roumie Fan Card instantly. Personalize it with your name, download, and share with friends!
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
                  <span>Download & share instantly</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">✓</span>
                  <span>No signup required</span>
                </li>
              </ul>
            </div>

            {/* Payment Methods */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-800/50 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
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

            {/* CTA Button */}
            <Link
              href="/fan-card"
              className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold tracking-widest transition-all text-sm sm:text-base group w-full sm:w-auto justify-center"
            >
              <Sparkles size={18} />
              CREATE YOUR CARD
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
