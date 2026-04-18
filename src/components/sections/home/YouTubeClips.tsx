'use client'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import Image from 'next/image'

const clips = [
  { id: 1, image: '/images/clips/wedieyoung-clip.jpg', title: 'WE DIE YOUNG' },
  { id: 2, image: '/images/clips/bloodsport-clip.jpg', title: 'Bloodsport' },
]

export default function YouTubeClips() {
  return (
    <section className="bg-white py-8 px-4">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="text-black text-center text-lg tracking-widest mb-6">
        @JONATHAN ROUMIE YOUTUBE - TRAILERS &amp; CLIPS
      </motion.h2>
      <div className="space-y-4 max-w-2xl mx-auto">
        {clips.map((clip, index) => (
          <motion.div key={clip.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }} className="relative group cursor-pointer overflow-hidden">
            <div className="relative aspect-video">
              <Image src={clip.image} alt={clip.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse-slow">
                    <Play size={32} className="text-white ml-1" fill="white" />
                  </div>
                  <span className="text-white text-lg tracking-wide">play clip</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                {clip.title === 'Bloodsport' ? (
                  <span className="text-jcvd-red text-3xl font-bold italic" style={{ fontFamily: 'cursive' }}>{clip.title}</span>
                ) : (
                  <span className="text-white text-2xl font-bold tracking-widest">{clip.title}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="text-black text-center text-sm mt-6 max-w-md mx-auto leading-relaxed">
        To see classic scenes, trailers, music videos and more, visit my <span className="font-semibold">OFFICIAL</span> YouTube channel Jonathan Roumie and subscribe.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }} className="flex justify-center mt-4">
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 hover:opacity-90 transition-opacity">
          <Image src="/images/jvcd-avatar.jpg" alt="Jonathan Roumie" width={32} height={32} className="rounded-full mr-2 object-cover" />
          <span className="font-semibold tracking-wide">SUBSCRIBE</span>
          <span className="ml-1">&gt;</span>
        </a>
      </motion.div>
    </section>
  )
}
