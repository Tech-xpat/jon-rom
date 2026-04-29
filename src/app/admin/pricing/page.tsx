'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, RefreshCw, Check, Loader } from 'lucide-react'

interface Product {
  name: string
  price: number
}

interface PricingData {
  fanCard: { price: number; lastUpdated: string }
  products: { [key: string]: Product }
}

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fanCardPrice, setFanCardPrice] = useState('')
  const [productPrices, setProductPrices] = useState<{ [key: string]: string }>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)

  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      const res = await fetch('/api/pricing')
      const data = await res.json()
      setPricing(data)
      setFanCardPrice(data.fanCard.price.toString())
      const newProductPrices: { [key: string]: string } = {}
      Object.entries(data.products).forEach(([id, product]: [string, any]) => {
        newProductPrices[id] = product.price.toString()
      })
      setProductPrices(newProductPrices)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch pricing:', error)
      setLoading(false)
    }
  }

  const saveFanCardPrice = async () => {
    setSaving('fancard')
    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'fancard',
          price: parseFloat(fanCardPrice),
        }),
      })
      if (res.ok) {
        setSavedMsg('fancard')
        setTimeout(() => setSavedMsg(null), 2000)
      }
    } catch (error) {
      console.error('Failed to save fan card price:', error)
    }
    setSaving(null)
  }

  const saveProductPrice = async (productId: string) => {
    setSaving(`product-${productId}`)
    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'product',
          productId,
          price: parseFloat(productPrices[productId]),
        }),
      })
      if (res.ok) {
        setSavedMsg(`product-${productId}`)
        setTimeout(() => setSavedMsg(null), 2000)
      }
    } catch (error) {
      console.error(`Failed to save product ${productId} price:`, error)
    }
    setSaving(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-white text-2xl font-black tracking-widest">PRICING MANAGEMENT</h1>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/3 rounded-xl h-16 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-black tracking-widest">PRICING MANAGEMENT</h1>
          <p className="text-gray-500 text-sm mt-1">Update real-time prices for products and fan cards</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchPricing}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* Fan Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={24} className="text-blue-400" />
            <div>
              <h2 className="text-white font-bold tracking-widest">FAN CARD PRICE</h2>
              <p className="text-gray-500 text-sm">
                Last updated: {pricing?.fanCard.lastUpdated ? new Date(pricing.fanCard.lastUpdated).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-gray-400 text-xs tracking-widest block mb-2">PRICE ($)</label>
              <input
                type="number"
                value={fanCardPrice}
                onChange={(e) => setFanCardPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveFanCardPrice}
              disabled={saving === 'fancard'}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving === 'fancard' ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  SAVING...
                </>
              ) : savedMsg === 'fancard' ? (
                <>
                  <Check size={18} />
                  SAVED!
                </>
              ) : (
                'SAVE PRICE'
              )}
            </motion.button>
          </div>

          {/* Price change indicator */}
          {pricing?.fanCard && parseFloat(fanCardPrice) !== pricing.fanCard.price && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-3 text-yellow-400 text-sm"
            >
              Change pending: ${pricing.fanCard.price.toFixed(2)} → ${parseFloat(fanCardPrice).toFixed(2)}
            </motion.div>
          )}
        </motion.div>

        {/* Products Section */}
        <div>
          <h2 className="text-white font-bold tracking-widest mb-4 flex items-center gap-2">
            <DollarSign size={20} />
            SHOP PRODUCTS ({Object.keys(pricing?.products || {}).length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pricing?.products && Object.entries(pricing.products).map(([productId, product], idx) => (
              <motion.div
                key={productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4 hover:bg-white/4 transition-colors"
              >
                <div>
                  <p className="text-gray-400 text-xs tracking-widest mb-2">PRODUCT ID: {productId}</p>
                  <h3 className="text-white font-bold text-sm sm:text-base">{product.name}</h3>
                </div>

                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-gray-400 text-xs tracking-widest block mb-2">PRICE ($)</label>
                    <input
                      type="number"
                      value={productPrices[productId] || ''}
                      onChange={(e) => setProductPrices({
                        ...productPrices,
                        [productId]: e.target.value,
                      })}
                      step="0.01"
                      min="0"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => saveProductPrice(productId)}
                    disabled={saving === `product-${productId}`}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2 text-sm"
                  >
                    {saving === `product-${productId}` ? (
                      <Loader size={16} className="animate-spin" />
                    ) : savedMsg === `product-${productId}` ? (
                      <Check size={16} />
                    ) : null}
                  </motion.button>
                </div>

                {/* Price change indicator */}
                {productPrices[productId] && parseFloat(productPrices[productId]) !== product.price && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-2 text-yellow-400 text-xs"
                  >
                    ${product.price.toFixed(2)} → ${parseFloat(productPrices[productId]).toFixed(2)}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
