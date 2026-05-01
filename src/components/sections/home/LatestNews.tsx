'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const newsItems = [
  { id: 1, image: '/images/news/hallows-lent-pray40.jfif', title: 'Lent Prayer Campaign', date: 'April 24, 2026' },
  { id: 2, image: '/images/news/rosie-roumie.jfif', title: 'Family Updates', date: 'April 22, 2026' },
  { id: 3, image: '/images/news/news-2.jfif', title: 'Latest Project News', date: 'April 20, 2026' },
  { id: 4, image: '/images/news/news-3.jfif', title: 'Exclusive Updates', date: 'April 18, 2026' },
  { id: 5, image: '/images/news/news-4.jfif', title: 'Recent Announcement', date: 'April 16, 2026' },
  { id: 6, image: '/images/news/special-message.jfif', title: 'Special Message', date: 'April 14, 2026' },
]

export default function LatestNews() {
  return (
    <section className="bg-gradient-to-b from-black to-black/90 py-12 sm:py-16 md:py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          viewport={{ once: true }} 
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black tracking-widest mb-2">
            LATEST NEWS
          </h2>
          <p className="text-gray-400">Stay updated with the latest updates</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {newsItems.map((item, index) => (
            <motion.article 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: index * 0.1 }} 
              viewport={{ once: true }} 
              className="group cursor-pointer bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
            >
              <div className="relative overflow-hidden aspect-video">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              <div className="p-4 space-y-2">
                <p className="text-gray-400 text-xs tracking-widest">{item.date}</p>
                <h3 className="text-white font-bold text-lg tracking-wide group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }} 
          viewport={{ once: true }} 
          className="flex justify-center mt-8 sm:mt-10 md:mt-12"
        >
          <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold tracking-widest transition-colors text-sm sm:text-base">
            VIEW ALL NEWS
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
