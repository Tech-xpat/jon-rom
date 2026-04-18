'use client'

import { useState } from 'react'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  variant?: 'main' | 'shop'
}

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'SHOP', path: '/shop' },
  { name: 'REWARDS', path: '/rewards' },
  { name: 'FAN CARD', path: '/fan-card' },
  { name: 'CONTACT', path: '/contact' },
]

export default function Header({ variant = 'main' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex flex-col">
            {variant === 'main' ? (
              <>
                <span className="text-white text-xl font-bold tracking-wider">
                  JONATHAN <span className="font-normal">ROUMIE</span>
                </span>
                <span className="text-jcvd-gray text-xs tracking-wide">
                  Official Website Jonathan Roumie &copy; 2026
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-white text-2xl font-bold tracking-widest">
                  JONATHAN<span className="mx-1 text-lg">SHOP</span>
                </span>
              </div>
            )}
          </Link>

          <div className="flex items-center gap-4">
            {variant === 'shop' && (
              <button className="text-white p-2" aria-label="Cart">
                <ShoppingCart size={24} />
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="border border-white/30 p-2 hover:bg-white/10 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} className="text-white" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-black z-50 flex flex-col border-l border-white/10"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="border border-white/30 p-2 hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>
              <nav className="flex flex-col items-center justify-center flex-1 gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-white text-lg tracking-[0.4em] hover:text-jcvd-red transition-colors ${
                      pathname === link.path ? 'text-jcvd-red' : ''
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
