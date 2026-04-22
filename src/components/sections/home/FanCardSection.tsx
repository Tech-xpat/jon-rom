'use client'

import { useEffect, useState } from 'react'
import { useUserAuth } from '@/components/user/UserAuthProvider'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'

export default function FanCardSection() {
  const { user } = useUserAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsAuthenticated(!!user)
    setLoading(false)
  }, [user])

  if (loading) {
    return null
  }

  if (!isAuthenticated) {
    // Unauthenticated view: Show card preview + login/signup
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-red-900/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Card Preview on Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl space-y-4">
                {/* Card Image at Top */}
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src="https://i.ibb.co/m5Xz2Vy2/image.png"
                    alt="Card Banner"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-white text-sm font-bold tracking-widest">JONATHAN ROUMIE</h3>
                    <h3 className="text-white text-sm font-bold tracking-widest">FAN CARD</h3>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 space-y-4">
                    <p className="text-white/70 text-xs tracking-wide">SAMPLE CARD</p>
                    <p className="text-white text-3xl font-black tracking-wider">YOUR NAME HERE</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-bold tracking-widest">VERIFIED MEMBER</span>
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
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
              className="order-1 lg:order-2 space-y-8"
            >
              <div>
                <h2 className="text-white text-4xl md:text-5xl font-black mb-4 tracking-widest">
                  GET YOUR FAN CARD
                </h2>
                <p className="text-gray-400 text-lg mb-4">
                  Own an official Jonathan Roumie Fan Card personalized with your name.
                </p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>✓ Personalized with your name</li>
                  <li>✓ Choose from Silver, Gold, or Diamond</li>
                  <li>✓ Download as PDF</li>
                  <li>✓ Share on social media</li>
                </ul>
              </div>

              {/* Login Required Message */}
              <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Lock size={20} className="text-yellow-400" />
                  <p className="text-yellow-300 font-bold">AUTHENTICATION REQUIRED</p>
                </div>
                <p className="text-yellow-200 text-sm">
                  You must sign in or create an account to apply for a fan card. Then you&apos;ll need to submit a payment and get approved by our admin team.
                </p>
              </div>

              {/* Auth Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold tracking-widest transition-colors flex items-center justify-center gap-3 group text-center"
                >
                  SIGN IN / CREATE ACCOUNT
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <p className="text-gray-500 text-sm text-center">
                Already have an account? Sign in to continue.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    )
  }

  // Authenticated view: Show apply button
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-transparent to-red-900/10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-2xl font-black mb-2 tracking-widest">
                READY TO GET YOUR FAN CARD?
              </h2>
              <p className="text-gray-400 text-sm">Apply now and start the approval process</p>
            </div>
            <Link
              href="/dashboard/card-personalize"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-2"
            >
              APPLY NOW
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
