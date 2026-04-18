'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Bitcoin, Wallet, CreditCard, AlertCircle } from 'lucide-react'
import { useUserAuth } from '@/components/user/UserAuthProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

interface Wallets {
  btc?: { address: string }
  usdt?: { address: string }
}

export default function CheckoutPage() {
  const { user, loading, getToken } = useUserAuth()
  const [paymentMethod, setPaymentMethod] = useState<'BTC' | 'USDT' | 'PayPal' | 'Stripe'>('USDT')
  const [wallets, setWallets] = useState<Wallets>({})
  const [walletsLoading, setWalletsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [creating, setCreating] = useState(false)

  const fanCardPrice = 4.99 // USD equivalent

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const res = await fetch('/api/checkout/wallets')
        if (res.ok) {
          const data = await res.json()
          setWallets(data)
        }
      } catch (err) {
        console.error('Failed to load wallets:', err)
      } finally {
        setWalletsLoading(false)
      }
    }
    loadWallets()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm tracking-widest">LOADING...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header variant="main" />
        <main className="pt-24 pb-16 px-4 text-center max-w-sm mx-auto">
          <AlertCircle size={40} className="text-red-600 mx-auto mb-4" />
          <h1 className="text-white text-2xl font-black mb-2">Sign In Required</h1>
          <p className="text-gray-400 mb-6">Please sign in to proceed with checkout.</p>
          <Link
            href="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return Home
          </Link>
        </main>
        <Footer variant="main" />
      </div>
    )
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreatePayment = async () => {
    setCreating(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currency: paymentMethod,
          amount: fanCardPrice,
        }),
      })

      if (res.ok) {
        const { paymentId, qrCode } = await res.json()
        // Store payment ID for tracking
        sessionStorage.setItem('paymentId', paymentId)
        alert('Payment created! Wallet address displayed above.')
      } else {
        const err = await res.json()
        alert(err.error || 'Failed to create payment')
      }
    } catch (err) {
      alert('An error occurred')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header variant="main" />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-white text-3xl font-black tracking-widest mb-2">CHECKOUT</h1>
            <p className="text-gray-400">Jonathan Roumie Fan Card - ${fanCardPrice.toFixed(2)}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1">
              <h2 className="text-white font-bold tracking-widest text-sm mb-4">SELECT PAYMENT METHOD</h2>
              <div className="space-y-3">
                {(['USDT', 'BTC', 'PayPal', 'Stripe'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                      paymentMethod === method
                        ? 'bg-red-900/20 border-red-600/50 text-red-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {method === 'BTC' && <Bitcoin size={20} />}
                    {method === 'USDT' && <Wallet size={20} />}
                    {method === 'PayPal' && <CreditCard size={20} />}
                    {method === 'Stripe' && <CreditCard size={20} />}
                    <span className="font-semibold text-sm">{method}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={paymentMethod}
              className="md:col-span-2 bg-white/3 border border-white/5 rounded-2xl p-8 space-y-6"
            >
              {walletsLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : (
                <>
                  {paymentMethod === 'USDT' && wallets.usdt ? (
                    <>
                      <div>
                        <h3 className="text-white font-bold tracking-widest text-sm mb-3">SEND USDT TO</h3>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-gray-300 break-all mb-3">
                          {wallets.usdt.address}
                        </div>
                        <button
                          onClick={() => handleCopyAddress(wallets.usdt?.address || '')}
                          className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-2 rounded-lg transition-colors"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? 'Copied!' : 'Copy Address'}
                        </button>
                      </div>

                      <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 flex gap-3">
                        <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-300">
                          <p className="font-semibold mb-1">Send Instructions:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Amount: {fanCardPrice} USDT (ERC-20)</li>
                            <li>• Send to the address above</li>
                            <li>• Admin will confirm receipt within 24 hours</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : paymentMethod === 'BTC' && wallets.btc ? (
                    <>
                      <div>
                        <h3 className="text-white font-bold tracking-widest text-sm mb-3">SEND BTC TO</h3>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm text-gray-300 break-all mb-3">
                          {wallets.btc.address}
                        </div>
                        <button
                          onClick={() => handleCopyAddress(wallets.btc?.address || '')}
                          className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-2 rounded-lg transition-colors"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? 'Copied!' : 'Copy Address'}
                        </button>
                      </div>

                      <div className="bg-orange-900/20 border border-orange-800/50 rounded-lg p-4 flex gap-3">
                        <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-orange-300">
                          <p className="font-semibold mb-1">Send Instructions:</p>
                          <ul className="space-y-1 text-xs">
                            <li>• Amount: Check current BTC price</li>
                            <li>• Send to the address above</li>
                            <li>• Admin will confirm receipt within 24 hours</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : paymentMethod === 'PayPal' ? (
                    <>
                      <h3 className="text-white font-bold tracking-widest text-sm">PAYPAL PAYMENT</h3>
                      <p className="text-gray-400 text-sm">PayPal integration coming soon. Please use Bitcoin or USDT for now.</p>
                      <button
                        disabled={true}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </>
                  ) : paymentMethod === 'Stripe' ? (
                    <>
                      <h3 className="text-white font-bold tracking-widest text-sm">STRIPE PAYMENT</h3>
                      <p className="text-gray-400 text-sm">Stripe integration coming soon. Please use Bitcoin or USDT for now.</p>
                      <button
                        disabled={true}
                        className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-400">Wallet not configured. Please select a different payment method.</p>
                  )}

                  {(paymentMethod === 'USDT' || paymentMethod === 'BTC') && (
                    <button
                      onClick={handleCreatePayment}
                      disabled={creating || !wallets[paymentMethod.toLowerCase() as keyof Wallets]}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      {creating ? 'Creating Payment...' : 'I Have Sent Payment'}
                    </button>
                  )}
                </>
              )}

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-gray-400 text-xs">
                  Your payment will be verified by our admin team. Once confirmed, you&apos;ll have access to download your fan card.
                </p>
              </div>
            </motion.div>
          </div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 max-w-2xl mx-auto bg-white/3 border border-white/5 rounded-2xl p-8"
          >
            <h2 className="text-white font-bold tracking-widest text-sm mb-6">FAQ</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold text-sm mb-2">How long does verification take?</h3>
                <p className="text-gray-400 text-sm">Payments are usually verified within 24 hours. You&apos;ll see an update on your dashboard.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-2">Can I get a refund?</h3>
                <p className="text-gray-400 text-sm">Due to the nature of cryptocurrency, refunds are not available. Please double-check the wallet address.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-2">What if I sent the wrong amount?</h3>
                <p className="text-gray-400 text-sm">Contact our support team immediately with your transaction hash for assistance.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer variant="main" />
    </div>
  )
}
