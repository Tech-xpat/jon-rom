'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const newsItems = [
  { id: 1, image: '/images/news/birthday.jpg', title: 'Birthday Celebration', date: 'April 15, 2024' },
  { id: 2, image: '/images/news/interview.jpg', title: 'Exclusive Interview', date: 'April 10, 2024' },
  { id: 3, image: '/images/news/movie.jpg', title: 'New Movie Project', date: 'April 5, 2024' },
]

export default function LatestNews() {
  return (
    <section className="bg-gradient-to-b from-black to-black/90 py-20 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          viewport={{ once: true }} 
          className="text-center mb-12"
        >
          <h2 className="text-white text-3xl md:text-4xl font-black tracking-widest mb-2">
            LATEST NEWS
          </h2>
          <p className="text-gray-400">Stay updated with the latest updates</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          className="flex justify-center mt-12"
        >
          <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-bold tracking-widest transition-colors">
            VIEW ALL NEWS
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
