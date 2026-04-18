'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const newsItems = [
  { id: 1, image: '/images/news/music-video.jpg', title: "I WON'T LOOK BACK", subtitle: 'MUSIC VIDEO', date: "11th MARCH '19" },
  { id: 2, image: '/images/news/birthday.jpg', title: 'CLAUDE GOETZ', subtitle: 'BIRTHDAY VIDEO', date: "10th MARCH '19" },
  { id: 3, image: '/images/news/interview.jpg', title: 'THR INTERVIEW', subtitle: 'SEE INTERVIEW', date: "2nd MARCH '19" },
]

export default function LatestNews() {
  return (
    <section className="bg-black py-8 px-4">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-white text-center text-lg tracking-[0.4em] mb-8">
        LATEST NEWS
      </motion.h2>
      <div className="space-y-8 max-w-2xl mx-auto">
        {newsItems.map((item, index) => (
          <motion.article key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="group cursor-pointer">
            <div className="relative overflow-hidden mb-4 aspect-video">
              <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute bottom-2 right-2 opacity-70">
                <span className="text-white text-xs tracking-widest">JONATHAN <span className="font-normal">ROUMIE</span></span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-jcvd-red text-lg tracking-wide font-medium mb-1">{item.title}</h3>
              <p className="text-white text-sm tracking-wide mb-1">{item.subtitle}</p>
              <p className="text-jcvd-gray text-sm tracking-wide">{item.date}</p>
            </div>
          </motion.article>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }} className="flex justify-center mt-8">
        <button className="border border-white/50 text-white px-12 py-3 tracking-[0.4em] hover:bg-white hover:text-black transition-colors">SEE MORE</button>
      </motion.div>
    </section>
  )
}
