'use client'
import { motion } from 'framer-motion'
import { Play, ExternalLink } from 'lucide-react'
import Image from 'next/image'

const clips = [
  { 
    id: 1, 
    image: 'https://img.youtube.com/vi/PL6OcLxQkXo/maxresdefault.jpg', 
    title: 'WE DIE YOUNG', 
    url: 'https://youtube.com/watch?v=PL6OcLxQkXo' 
  },
  { 
    id: 2, 
    image: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 
    title: 'BLOODSPORT SCENE', 
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' 
  },
]

export default function YouTubeClips() {
  return (
    <section className="bg-gradient-to-b from-black to-black/90 py-20 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          viewport={{ once: true }} 
          className="text-center mb-12"
        >
          <h2 className="text-white text-3xl md:text-4xl font-black tracking-widest mb-2">
            YOUTUBE CLIPS &amp; TRAILERS
          </h2>
          <p className="text-gray-400">Watch exclusive scenes and movie trailers</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {clips.map((clip, index) => (
            <motion.a
              key={clip.id}
              href={clip.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="relative aspect-video bg-black">
                <Image 
                  src={clip.image} 
                  alt={clip.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full border-3 border-white flex items-center justify-center bg-red-600/20 backdrop-blur-sm"
                  >
                    <Play size={28} className="text-white fill-white ml-1" />
                  </motion.div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <h3 className="text-white font-black text-lg md:text-xl tracking-widest">
                    {clip.title}
                  </h3>
                  <ExternalLink size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }} 
          viewport={{ once: true }} 
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Subscribe to the official Jonathan Roumie YouTube channel for exclusive content, behind-the-scenes videos, and more.
          </p>
          <a 
            href="https://www.youtube.com/@JonathanRoumie" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold tracking-widest transition-colors"
          >
            <span>VISIT CHANNEL</span>
            <ExternalLink size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
