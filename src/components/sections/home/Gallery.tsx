'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const galleryImages = [
  { id: 1, src: '/images/gallery/gallery-1.jpg', alt: 'Jonathan Roumie on stage' },
  { id: 2, src: '/images/gallery/gallery-2.jpg', alt: 'Jonathan Roumie art' },
  { id: 3, src: '/images/gallery/gallery-3.jpg', alt: 'Jonathan Roumie at gym' },
  { id: 4, src: '/images/gallery/gallery-4.jpg', alt: 'Jonathan Roumie training' },
  { id: 5, src: '/images/gallery/gallery-5.jpg', alt: 'Jonathan Roumie with fans' },
  { id: 6, src: '/images/gallery/gallery-6.jpg', alt: 'Jonathan Roumie interview' },
  { id: 7, src: '/images/gallery/gallery-7.jpg', alt: 'Jonathan Roumie collectible' },
  { id: 8, src: '/images/gallery/gallery-8.jpg', alt: 'Jonathan Roumie dramatic pose' },
]

export default function Gallery() {
  return (
    <section className="bg-black py-8 px-4">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-white text-center text-lg tracking-[0.4em] mb-8">
        @JONATHAN ROUMIE GALLERY
      </motion.h2>
      <div className="grid grid-cols-2 gap-1 max-w-2xl mx-auto">
        {galleryImages.map((image, index) => (
          <motion.div key={image.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }} viewport={{ once: true }} className="relative group cursor-pointer overflow-hidden aspect-square">
            <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">JONATHAN <span className="font-normal">ROUMIE</span></span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }} className="flex justify-center mt-8">
        <button className="border border-white/50 text-white px-12 py-3 tracking-[0.4em] hover:bg-white hover:text-black transition-colors">SEE MORE</button>
      </motion.div>
    </section>
  )
}
