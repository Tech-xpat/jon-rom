'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Star, TrendingUp, Lock, CheckCircle, Zap, Eye, EyeOff } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface RewardTier {
  name: string
  points: number
  color: string
  description: string
  icon: React.ReactNode
}

interface PremiumBenefit {
  name: string
  description: string
  icon: React.ReactNode
  available: boolean
}

export default function RewardsClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock user data
  const [userPoints, setUserPoints] = useState(420)
  const [isPremium, setIsPremium] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Mock authentication - in production, validate against backend
    if (email && password && password.length >= 6) {
      setTimeout(() => {
        setIsAuthenticated(true)
        setEmail('')
        setPassword('')
        setIsLoading(false)
      }, 500)
    } else {
      setError('Invalid email or password (min 6 characters)')
      setIsLoading(false)
    }
  }

  const rewardTiers: RewardTier[] = [
    {
      name: 'Bronze',
      points: 100,
      color: 'from-yellow-700 to-yellow-600',
      description: 'Get started with your first rewards',
      icon: <Gift size={24} />,
    },
    {
      name: 'Silver',
      points: 500,
      color: 'from-gray-400 to-gray-300',
      description: 'Unlock exclusive content',
      icon: <Star size={24} />,
    },
    {
      name: 'Gold',
      points: 1500,
      color: 'from-yellow-500 to-yellow-400',
      description: 'Premium member status',
      icon: <TrendingUp size={24} />,
    },
    {
      name: 'Platinum',
      points: 5000,
      color: 'from-slate-400 to-slate-300',
      description: 'VIP access & exclusive perks',
      icon: <Zap size={24} />,
    },
  ]

  const engagementRewards = [
    {
      activity: 'Share on Social Media',
      points: 50,
      frequency: 'Per share',
      icon: '📱',
    },
    {
      activity: 'Write a Review',
      points: 100,
      frequency: 'Per review',
      icon: '✍️',
    },
    {
      activity: 'Refer a Friend',
      points: 250,
      frequency: 'Per referral',
      icon: '👥',
    },
    {
      activity: 'Purchase Fan Card',
      points: 500,
      frequency: 'Per purchase',
      icon: '🎁',
    },
  ]

  const premiumBenefits: PremiumBenefit[] = [
    {
      name: 'Exclusive Content',
      description: 'Access behind-the-scenes videos and photos',
      icon: <CheckCircle size={20} />,
      available: isPremium,
    },
    {
      name: 'Early Access',
      description: 'Get new products before general release',
      icon: <Zap size={20} />,
      available: isPremium,
    },
    {
      name: 'VIP Support',
      description: 'Priority customer service via WhatsApp',
      icon: <Gift size={20} />,
      available: isPremium,
    },
    {
      name: 'Double Points',
      description: 'Earn double rewards on all purchases',
      icon: <TrendingUp size={20} />,
      available: isPremium,
    },
  ]

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        
        <main className="pt-20 sm:pt-24 pb-12">
          <section className="px-4 sm:px-6 py-12 sm:py-20 max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Heading */}
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <Lock size={48} className="text-blue-400" />
                </div>
                <h1 className="text-white text-3xl sm:text-4xl font-black tracking-widest">
                  REWARDS CENTER
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Sign in to access your rewards and exclusive benefits
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="text-white font-bold text-sm tracking-widest block mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="text-white font-bold text-sm tracking-widest block mb-2">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 rounded-lg transition-all text-sm sm:text-base disabled:opacity-50"
                >
                  {isLoading ? 'SIGNING IN...' : 'SIGN IN TO REWARDS'}
                </motion.button>
              </form>

              {/* Info Box */}
              <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 text-center text-gray-300 text-xs sm:text-sm">
                <p className="font-bold text-white mb-2">DEMO CREDENTIALS</p>
                <p>Use any email and password (min 6 chars)</p>
              </div>
            </motion.div>
          </section>
        </main>

        <Footer />
      </div>
    )
  }

  // Authenticated View - Rewards Dashboard
  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="pt-20 sm:pt-24 pb-12">
        {/* Welcome Section */}
        <section className="px-4 sm:px-6 py-12 sm:py-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-white text-3xl sm:text-4xl font-black tracking-widest mb-2">
                  YOUR REWARDS
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">Welcome back! Track your points and unlock exclusive benefits.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAuthenticated(false)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                SIGN OUT
              </motion.button>
            </div>

            {/* Points Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-2xl p-6 sm:p-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm tracking-widest mb-2">CURRENT POINTS</p>
                  <p className="text-white text-4xl sm:text-5xl font-black">{userPoints}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm tracking-widest mb-2">NEXT TIER</p>
                  <p className="text-blue-400 text-3xl font-bold">Silver</p>
                  <p className="text-gray-500 text-xs mt-1">{500 - userPoints} points to go</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm tracking-widest mb-2">STATUS</p>
                  <p className="text-yellow-400 text-2xl font-black">Bronze Member</p>
                </div>
              </div>
            </motion.div>

            {/* Reward Tiers */}
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-black tracking-widest mb-6">REWARD TIERS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {rewardTiers.map((tier, i) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-gradient-to-br ${tier.color} rounded-lg p-4 sm:p-6 text-black ${
                      userPoints >= tier.points ? 'ring-2 ring-white' : 'opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{tier.icon}</div>
                    <h3 className="font-black text-lg sm:text-xl tracking-widest mb-2">{tier.name}</h3>
                    <p className="text-xs sm:text-sm mb-3 opacity-80">{tier.description}</p>
                    <p className="font-bold text-sm">{tier.points} Points</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Engagement Rewards */}
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-black tracking-widest mb-6">EARN POINTS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {engagementRewards.map((reward, i) => (
                  <motion.div
                    key={reward.activity}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 flex items-start gap-4"
                  >
                    <div className="text-4xl">{reward.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-sm sm:text-base">{reward.activity}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">{reward.frequency}</p>
                      <p className="text-blue-400 font-bold text-sm mt-2">+{reward.points} PTS</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Premium Benefits */}
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-black tracking-widest mb-6">PREMIUM BENEFITS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {premiumBenefits.map((benefit, i) => (
                  <motion.div
                    key={benefit.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6"
                  >
                    <div className={`flex items-center gap-3 mb-3 ${benefit.available ? 'text-blue-400' : 'text-gray-600'}`}>
                      {benefit.icon}
                      <h3 className="text-white font-bold text-sm sm:text-base">{benefit.name}</h3>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
