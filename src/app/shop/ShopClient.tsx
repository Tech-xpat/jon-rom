'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const products = [
  { id: 1, image: '/images/shop/hoodie-black.jpg', name: 'Black Bloodsport Hoodie' },
  { id: 2, image: '/images/shop/hoodie-gray.jpg', name: 'Gray Bloodsport Hoodie' },
]

const categories = [
  { id: 1, image: '/images/shop/category-tanks.jpg', name: 'TANKS' },
  { id: 2, image: '/images/shop/category-tshirts.jpg', name: 'T-Shirts' },
  { id: 3, image: '/images/shop/category-hoodies.jpg', name: 'HOODIES' },
  { id: 4, image: '/images/shop/category-beanies.jpg', name: 'BEANIES' },
  { id: 5, image: '/images/shop/category-caps.jpg', name: 'CAPS' },
]

export default function ShopClient() {
  const [currentProduct, setCurrentProduct] = useState(0)

  const nextProduct = () => setCurrentProduct((prev) => (prev + 1) % products.length)
  const prevProduct = () => setCurrentProduct((prev) => (prev - 1 + products.length) % products.length)

  return (
    <div className="min-h-screen bg-black">
      {/* Announcement Bar */}
      <div className="bg-jcvd-teal text-white text-center py-2 text-sm">
        Officially Licensed Jonathan Roumie Merchandise
      </div>

      <Header variant="shop" />

      <main className="pt-16">
        {/* Shop Hero */}
        <section className="relative">
          <div className="relative w-full aspect-video">
            <Image
              src="/images/shop/shop-hero.jpg"
              alt="Bloodsport Collection"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h1
                className="text-jcvd-red text-4xl md:text-6xl font-bold italic"
                style={{ fontFamily: 'cursive', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
              >
                Bloodsport
              </h1>
              <p className="text-white text-lg tracking-widest">COLLECTION</p>
            </div>
          </div>
        </section>

        {/* Product Carousel */}
        <section className="bg-black py-8 px-4">
          <div className="relative max-w-md mx-auto">
            <motion.div
              key={currentProduct}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4"
            >
              <div className="relative aspect-square">
                <Image
                  src={products[currentProduct].image}
                  alt={products[currentProduct].name}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            <button
              onClick={prevProduct}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-white/70 hover:text-white"
              aria-label="Previous product"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={nextProduct}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-white/70 hover:text-white"
              aria-label="Next product"
            >
              <ChevronRight size={32} />
            </button>

            <div className="flex justify-center gap-2 mt-4">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProduct(index)}
                  aria-label={`Product ${index + 1}`}
                  className={`w-2 h-2 rounded-full ${
                    index === currentProduct ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <h2 className="text-white text-2xl mb-2">Bloodsport Collection</h2>
            <p className="text-jcvd-gray text-sm mb-4">
              NEW Officially Licensed Jonathan Roumie Collection featuring exclusive prints available from Jonathan Roumie Shop
            </p>
            <button className="bg-jcvd-teal text-white px-6 py-2 hover:bg-opacity-90 transition-colors">
              View Collection
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-black py-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative cursor-pointer group overflow-hidden"
            >
              <div className="aspect-[3/4] relative">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-3xl font-bold tracking-widest">{category.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Shop Info */}
        <section className="bg-black py-12 px-4 text-center">
          <h2 className="text-white text-2xl mb-4">Jonathan Roumie Shop</h2>
          <p className="text-jcvd-gray text-sm max-w-md mx-auto mb-2">
            Official Licensed Jonathan Roumie Merchandise. Choose from a wide selection of colors and prints.
          </p>
          <p className="text-jcvd-gray text-sm max-w-md mx-auto mb-2">Great quality with style.</p>
          <p className="text-jcvd-gray text-sm max-w-md mx-auto mb-6">
            Exclusively available from Jonathan Roumie Shop
          </p>
          <button className="bg-jcvd-teal text-white px-6 py-2 hover:bg-opacity-90 transition-colors">
            View Collections
          </button>
        </section>
      </main>

      <Footer variant="shop" />
    </div>
  )
}
