'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, X, Heart } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface Product {
  id: number
  image: string
  name: string
  price: number
  stock: number
  description: string
}

const products: Product[] = [
  { id: 1, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.27.jpeg', name: 'Premium T-Shirt Black', price: 29.99, stock: 45, description: 'Exclusive Jonathan Roumie Collection' },
  { id: 2, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.27 (1).jpeg', name: 'Premium T-Shirt White', price: 29.99, stock: 38, description: 'Classic Design' },
  { id: 3, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.28.jpeg', name: 'Signature Hoodie', price: 59.99, stock: 22, description: 'Comfortable & Premium Quality' },
  { id: 4, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.28 (1).jpeg', name: 'Signature Hoodie Alt', price: 59.99, stock: 19, description: 'Limited Edition' },
  { id: 5, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.29.jpeg', name: 'Exclusive Apparel', price: 34.99, stock: 51, description: 'Fan Favorite' },
  { id: 6, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.29 (1).jpeg', name: 'Premium Collection Item', price: 44.99, stock: 28, description: 'Collector\'s Edition' },
  { id: 7, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.29 (2).jpeg', name: 'Signature Series', price: 39.99, stock: 35, description: 'Official Merchandise' },
  { id: 8, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.29 (3).jpeg', name: 'Limited Apparel', price: 54.99, stock: 14, description: 'Rare & Exclusive' },
  { id: 9, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.29 (4).jpeg', name: 'Classic Design Tee', price: 26.99, stock: 62, description: 'Best Seller' },
  { id: 10, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.30.jpeg', name: 'Performance Hoodie', price: 64.99, stock: 17, description: 'Premium Comfort' },
  { id: 11, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.30 (1).jpeg', name: 'Exclusive Tee', price: 31.99, stock: 40, description: 'Limited Availability' },
  { id: 12, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.30 (2).jpeg', name: 'Premium Edition', price: 49.99, stock: 23, description: 'VIP Collection' },
  { id: 13, image: '/images/shop/WhatsApp Image 2026-04-23 at 19.13.30 (3).jpeg', name: 'Signature Hoodie Premium', price: 69.99, stock: 12, description: 'Luxury Line' },
]

interface CartItem extends Product {
  quantity: number
}

interface CheckoutModal {
  isOpen: boolean
  total: number
  items: CartItem[]
}

export default function ShopClient() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [checkout, setCheckout] = useState<CheckoutModal>({ isOpen: false, total: 0, items: [] })
  const [selectedQuantity, setSelectedQuantity] = useState<{ [key: number]: number }>({})

  const addToCart = (product: Product) => {
    const quantity = selectedQuantity[product.id] || 1
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, item.stock) }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
    setSelectedQuantity({ ...selectedQuantity, [product.id]: 1 })
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const product = cart.find(item => item.id === productId)
    if (product && quantity > 0 && quantity <= product.stock) {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const openCheckout = () => {
    setCheckout({ isOpen: true, total: totalPrice, items: cart })
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-black">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 text-xs sm:text-sm px-2">
        🎉 Officially Licensed Jonathan Roumie Merchandise - Shop Exclusive Items Now!
      </div>

      <Header variant="shop" />

      <main className="pt-20 sm:pt-24 pb-20">
        {/* Shop Hero */}
        <section className="relative mb-8 sm:mb-12">
          <div className="relative w-full h-48 sm:h-64 md:h-80">
            <img
              src="/images/shop/WhatsApp Image 2026-04-23 at 19.13.27.jpeg"
              alt="Shop Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
              <h1 className="text-white text-3xl sm:text-5xl font-bold tracking-widest mb-1 sm:mb-2">
                EXCLUSIVE SHOP
              </h1>
              <p className="text-gray-300 text-sm sm:text-base tracking-wider">Premium Jonathan Roumie Merchandise</p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-widest">ALL PRODUCTS</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCheckout}
              disabled={cart.length === 0}
              className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-40 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 sm:px-6 sm:py-4 rounded-full flex items-center gap-2 shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline font-bold">CART</span>
              {cartCount > 0 && (
                <span className="bg-red-600 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/30 transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-black">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Stock Badge */}
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                    product.stock > 20 ? 'bg-green-600' :
                    product.stock > 10 ? 'bg-yellow-600' :
                    'bg-red-600'
                  } text-white`}>
                    {product.stock} LEFT
                  </div>
                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 left-2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
                  >
                    <Heart
                      size={18}
                      className={wishlist.includes(product.id) ? 'fill-red-600 text-red-600' : 'text-gray-600'}
                    />
                  </motion.button>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-1">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-bold text-lg sm:text-xl">${product.price.toFixed(2)}</span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-1 bg-white/5 rounded p-1">
                    <button
                      onClick={() => setSelectedQuantity({
                        ...selectedQuantity,
                        [product.id]: Math.max(1, (selectedQuantity[product.id] || 1) - 1)
                      })}
                      className="text-white/60 hover:text-white px-2 py-1 text-sm"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={selectedQuantity[product.id] || 1}
                      onChange={(e) => {
                        const val = Math.min(parseInt(e.target.value) || 1, product.stock)
                        setSelectedQuantity({ ...selectedQuantity, [product.id]: Math.max(1, val) })
                      }}
                      className="flex-1 bg-transparent text-white text-center text-sm py-1 font-bold"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setSelectedQuantity({
                        ...selectedQuantity,
                        [product.id]: Math.min(product.stock, (selectedQuantity[product.id] || 1) + 1)
                      })}
                      className="text-white/60 hover:text-white px-2 py-1 text-sm"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-2 sm:py-3 font-bold text-sm sm:text-base rounded transition-all ${
                      product.stock === 0
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    }`}
                  >
                    {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Checkout Modal */}
      {checkout.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center p-4"
          onClick={() => setCheckout({ ...checkout, isOpen: false })}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-gradient-to-b from-gray-900 to-black w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 flex justify-between items-center">
              <h2 className="text-white font-bold text-lg sm:text-2xl tracking-widest">YOUR CART</h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setCheckout({ ...checkout, isOpen: false })}
                className="text-white hover:bg-white/20 p-2 rounded-full"
              >
                <X size={24} />
              </motion.button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 flex gap-3 sm:gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2">{item.name}</h3>
                        <p className="text-blue-400 font-bold text-sm sm:text-base">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-white/60 hover:text-white px-1 py-0.5"
                          >
                            −
                          </button>
                          <span className="text-white font-bold text-sm min-w-[30px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-white/60 hover:text-white px-1 py-0.5"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto text-red-500 hover:text-red-400 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-sm sm:text-base">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-white/10 pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4 sm:mb-6">
                      <span className="text-white text-lg sm:text-xl font-bold">TOTAL:</span>
                      <span className="text-blue-400 text-2xl sm:text-3xl font-bold">${totalPrice.toFixed(2)}</span>
                    </div>

                    {/* CashApp Payment Instructions */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-600/50 rounded-lg p-4 sm:p-6 mb-4"
                    >
                      <h3 className="text-white font-bold text-sm sm:text-base mb-3">💚 PAYMENT METHOD</h3>
                      <div className="bg-black/40 rounded p-3 sm:p-4 mb-4 text-center">
                        <p className="text-gray-300 text-xs sm:text-sm mb-2">Send payment to CashApp:</p>
                        <p className="text-green-400 font-bold text-base sm:text-lg tracking-widest break-all">
                          Coming Soon
                        </p>
                        <p className="text-gray-400 text-xs mt-2">Admin will add CashApp handle</p>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">
                        📧 Include order details in payment note for confirmation
                      </p>
                    </motion.div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 sm:py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm sm:text-base"
                    >
                      OPEN CASHAPP → Send Payment
                    </motion.button>

                    <p className="text-gray-400 text-xs sm:text-sm text-center mt-3">
                      Your order will be processed after payment is confirmed by admin.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <Footer variant="shop" />
    </div>
  )
}
