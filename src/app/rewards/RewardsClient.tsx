'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Star, TrendingUp, Lock, CheckCircle, Zap } from 'lucide-react'
import Image from 'next/image'
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
  const [userPoints, setUserPoints] = useState(420)
  const [isPremium, setIsPremium] = useState(false)

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
      icon: '🎫',
    },
    {
      activity: 'Watch a Video',
      points: 10,
      frequency: 'Per video',
      icon: '🎬',
    },
    {
      activity: 'Subscribe to Newsletter',
      points: 75,
      frequency: 'One-time',
      icon: '📧',
    },
  ]

  const premiumBenefits: PremiumBenefit[] = [
    {
      name: '2x Reward Points',
      description: 'Earn double points on all activities',
      icon: <Star className="text-jcvd-red" size={20} />,
      available: isPremium,
    },
    {
      name: 'Exclusive Discord Channel',
      description: 'Join our VIP community',
      icon: <Lock className="text-jcvd-teal" size={20} />,
      available: isPremium,
    },
    {
      name: 'Early Access to Merch',
      description: 'Shop new items 48 hours early',
      icon: <TrendingUp className="text-jcvd-red" size={20} />,
      available: isPremium,
    },
    {
      name: 'Special Discount Code',
      description: '20% off all purchases',
      icon: <Gift className="text-jcvd-teal" size={20} />,
      available: isPremium,
    },
    {
      name: 'Birthday Bonus',
      description: '500 bonus points on your birthday',
      icon: <Zap className="text-jcvd-red" size={20} />,
      available: isPremium,
    },
    {
      name: 'Priority Support',
      description: '24/7 customer support',
      icon: <CheckCircle className="text-jcvd-teal" size={20} />,
      available: isPremium,
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-jcvd-red/10 to-transparent" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-widest mb-4">
              <span className="text-jcvd-red">REWARDS</span> PROGRAM
            </h1>
            <p className="text-jcvd-gray text-lg tracking-wide mb-8">Earn points for every engagement and unlock exclusive benefits</p>

            {/* Current Points Display */}
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }} className="inline-block">
              <div className="bg-gradient-to-r from-jcvd-red/20 to-jcvd-teal/20 border border-jcvd-red/50 rounded-xl p-8 backdrop-blur-sm">
                <p className="text-jcvd-gray text-sm tracking-widest mb-2">YOUR POINTS</p>
                <h2 className="text-5xl font-bold text-white mb-4">{userPoints.toLocaleString()}</h2>
                <div className="w-48 h-2 bg-jcvd-input rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-jcvd-red to-jcvd-teal" style={{ width: `${Math.min((userPoints / 5000) * 100, 100)}%` }} />
                </div>
                <p className="text-jcvd-gray text-xs tracking-wide">{5000 - userPoints} points until Platinum</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Reward Tiers */}
        <section className="py-16 px-4">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-3xl font-bold tracking-widest text-center mb-12">
            TIER LEVELS
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {rewardTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-6 rounded-xl border transition-all ${userPoints >= tier.points ? 'border-jcvd-red bg-jcvd-red/10 scale-105' : 'border-jcvd-border bg-jcvd-dark/50'}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br ${tier.color}`}>
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                <p className="text-jcvd-teal font-bold text-sm mb-3">{tier.points.toLocaleString()} pts</p>
                <p className="text-jcvd-gray text-xs leading-relaxed">{tier.description}</p>
                {userPoints >= tier.points && <div className="absolute top-2 right-2 text-jcvd-red">✓</div>}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Engagement Rewards */}
        <section className="py-16 px-4 bg-jcvd-dark/30">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-3xl font-bold tracking-widest text-center mb-12">
            EARN POINTS
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {engagementRewards.map((reward, index) => (
              <motion.div
                key={reward.activity}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-6 bg-black/50 border border-jcvd-border rounded-lg hover:border-jcvd-red/50 hover:bg-jcvd-red/5 transition-all"
              >
                <span className="text-4xl flex-shrink-0">{reward.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold tracking-wide mb-1">{reward.activity}</h3>
                  <p className="text-jcvd-gray text-sm mb-2">{reward.frequency}</p>
                  <p className="text-jcvd-teal font-bold">{reward.points} points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Premium Membership Section */}
        <section className="py-16 px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-jcvd-red/20 to-jcvd-teal/20 border-2 border-jcvd-red/50 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold tracking-widest mb-2">
                  <span className="text-jcvd-red">PREMIUM</span> MEMBERSHIP
                </h2>
                <p className="text-jcvd-gray tracking-wide">Unlock exclusive perks and earn rewards faster</p>
              </div>

              {!isPremium ? (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-6">
                    <span className="text-5xl font-bold">$9.99</span>
                    <span className="text-jcvd-gray">/month</span>
                  </div>
                  <button
                    onClick={() => setIsPremium(true)}
                    className="bg-jcvd-red hover:bg-red-700 text-white font-bold text-lg px-12 py-3 tracking-widest transition-colors"
                  >
                    UPGRADE NOW
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="text-center mb-8">
                  <p className="text-jcvd-teal text-xl font-bold mb-4">✓ PREMIUM MEMBER</p>
                  <button
                    onClick={() => setIsPremium(false)}
                    className="bg-jcvd-teal hover:bg-opacity-70 text-black font-bold text-lg px-12 py-3 tracking-widest transition-colors"
                  >
                    MANAGE SUBSCRIPTION
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Premium Benefits Grid */}
        <section className="py-16 px-4 bg-jcvd-dark/30">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-3xl font-bold tracking-widest text-center mb-12">
            VIP BENEFITS
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {premiumBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border transition-all ${
                  isPremium ? 'border-jcvd-red/50 bg-jcvd-red/5 hover:bg-jcvd-red/10' : 'border-jcvd-border/30 bg-black/50 opacity-70'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-black/50 rounded-lg">{benefit.icon}</div>
                  <h3 className="font-bold tracking-wide">{benefit.name}</h3>
                </div>
                <p className="text-jcvd-gray text-sm">{benefit.description}</p>
                {!isPremium && <p className="text-jcvd-gray text-xs mt-3">Unlock with Premium →</p>}
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-3xl font-bold tracking-widest text-center mb-12">
            HOW IT WORKS
          </motion.h2>
          <div className="max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Engage', desc: 'Participate in activities to earn points' },
              { step: '02', title: 'Accumulate', desc: 'Build up your points to reach tiers' },
              { step: '03', title: 'Unlock', desc: 'Access exclusive perks at each tier' },
              { step: '04', title: 'Enjoy', desc: 'Redeem rewards and exclusive benefits' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 mb-8 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-jcvd-red to-jcvd-teal">
                    <span className="text-white font-black text-xl tracking-wider">{item.step}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold tracking-wide mb-2">{item.title}</h3>
                  <p className="text-jcvd-gray">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-t from-jcvd-red/10 to-transparent">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-widest mb-6">READY TO EARN?</h2>
            <p className="text-jcvd-gray text-lg mb-8 tracking-wide">Start engaging with the community and unlock amazing rewards today!</p>
            <button className="bg-jcvd-red hover:bg-red-700 text-white font-bold text-lg px-12 py-4 tracking-widest transition-colors mb-6">
              CLAIM YOUR FIRST REWARD
            </button>
            <p className="text-jcvd-gray text-sm">Questions? <a href="/contact" className="text-jcvd-teal hover:text-white transition-colors">Contact us</a></p>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
