'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DollarSign, RefreshCw, Loader, Check, AlertCircle } from 'lucide-react'

interface ProductPrice {
  id: string
  name: string
  price: number
  category: string
  description: string
  updatedAt?: string
}

export default function AdminPricingPage() {
  const { user, isAdmin, loading, getToken } = useAdminAuth()
  const router = useRouter()
  const [products, setProducts] = useState<ProductPrice[]>([])
  const [fanCardPrice, setFanCardPrice] = useState('29.99')
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState<string>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [productPrices, setProductPrices] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, loading, router])

  useEffect(() => {
    if (isAdmin) {
      loadPrices()
    }
  }, [isAdmin])

  const loadPrices = async () => {
    try {
      setLoadingData(true)
      const token = await getToken()
      const res = await fetch('/api/admin/product-prices', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
        // Initialize product price states
        const pricesMap: Record<string, string> = {}
        data.forEach((product: ProductPrice) => {
          pricesMap[product.id] = (product.price / 100).toFixed(2)
        })
        setProductPrices(pricesMap)
      }
    } catch (err) {
      console.error('Failed to load prices:', err)
      setError('Failed to load prices')
    } finally {
      setLoadingData(false)
    }
  }

  const handleSavePrice = async (productId: string, price: string) => {
    setSaving(`product-${productId}`)
    setError('')
    try {
      const token = await getToken()
      const product = products.find(p => p.id === productId)
      const res = await fetch('/api/admin/product-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          price: parseFloat(price),
          name: product?.name,
          category: product?.category,
          description: product?.description,
        }),
      })

      if (res.ok) {
        setSuccess('Price updated!')
        setTimeout(() => setSuccess(''), 2000)
      } else {
        const err = await res.json()
        setError(err.error || 'Failed to save price')
      }
    } catch (err) {
      setError('Error saving price')
    } finally {
      setSaving('')
    }
  }

  const handleSaveFanCardPrice = async () => {
    setSaving('fancard')
    setError('')
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/product-prices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: parseFloat(fanCardPrice) }),
      })

      if (res.ok) {
        setSuccess('Fan card price updated!')
        setTimeout(() => setSuccess(''), 2000)
      } else {
        const err = await res.json()
        setError(err.error || 'Failed to save fan card price')
      }
    } catch (err) {
      setError('Error saving fan card price')
    } finally {
      setSaving('')
    }
  }

  if (loading || loadingData) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-black tracking-widest">PRICING MANAGEMENT</h1>
          <p className="text-gray-500 text-sm mt-1">Update real-time prices for products and fan cards</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadPrices}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </motion.button>
      </div>

      {/* Notifications */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 flex items-center gap-3"
        >
          <AlertCircle className="text-red-400" size={20} />
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/20 border border-green-800/50 rounded-lg p-4 flex items-center gap-3"
        >
          <Check className="text-green-400" size={20} />
          <p className="text-green-400">{success}</p>
        </motion.div>
      )}

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
            <p className="text-gray-500 text-sm">Set the price for fan card purchases</p>
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
            onClick={handleSaveFanCardPrice}
            disabled={saving === 'fancard'}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            {saving === 'fancard' ? (
              <>
                <Loader size={18} className="animate-spin" />
                SAVING...
              </>
            ) : (
              <>
                <Check size={18} />
                SAVE
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Products Section */}
      <div>
        <h2 className="text-white font-bold tracking-widest mb-4 flex items-center gap-2">
          <DollarSign size={20} />
          SHOP PRODUCTS ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="bg-white/3 border border-white/5 rounded-2xl p-8 text-center">
            <p className="text-gray-400">No products found. Create products to manage pricing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4 hover:bg-white/4 transition-colors"
              >
                <div>
                  <p className="text-gray-400 text-xs tracking-widest mb-2">PRODUCT ID: {product.id}</p>
                  <h3 className="text-white font-bold text-sm sm:text-base">{product.name}</h3>
                  {product.description && (
                    <p className="text-gray-500 text-xs mt-1">{product.description}</p>
                  )}
                </div>

                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="text-gray-400 text-xs tracking-widest block mb-2">PRICE ($)</label>
                    <input
                      type="number"
                      value={productPrices[product.id] || ''}
                      onChange={(e) => setProductPrices({
                        ...productPrices,
                        [product.id]: e.target.value,
                      })}
                      step="0.01"
                      min="0"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm sm:text-base focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSavePrice(product.id, productPrices[product.id])}
                    disabled={saving === `product-${product.id}`}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    {saving === `product-${product.id}` ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        SAVING
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        SAVE
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
