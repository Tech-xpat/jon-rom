'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  text: string
  timestamp: Date
}

const quickReplies = [
  'How do I purchase?',
  'Where is my order?',
  'Payment methods?',
  'Fan card help',
  'General inquiry',
]

const botResponses: { [key: string]: string } = {
  'how do i purchase?': 'You can purchase items from our shop! Simply add items to your cart, provide your delivery details, and choose your payment method (Crypto, Cash App, or Venmo).',
  'where is my order?': 'Orders are confirmed via email after payment. You can track your order status in your confirmation email. Contact admin for specific order details.',
  'payment methods?': 'We accept: Bitcoin & USDT (Crypto), Cash App ($tinabeingblessed), and Venmo (Tina-McGowan-17).',
  'fan card help': 'Create your fan card instantly on the Fan Card page! Just tap the card, enter your name, and download your personalized card.',
  'general inquiry': 'How can we help you today? Feel free to ask any questions about our products, services, or anything else!',
  'default': 'Thank you for reaching out! Our admin team will review your message. For urgent inquiries, please specify your issue clearly. Have a great day!',
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hi there! How can we help you today?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Animate button based on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setIsVisible(window.scrollY < window.innerHeight * 2)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim()
    
    if (!messageText) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: messageText,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Simulate bot response after a delay
    setTimeout(() => {
      const lowerText = messageText.toLowerCase()
      const botResponse = Object.keys(botResponses).find((key) =>
        lowerText.includes(key)
      )

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: botResponse ? botResponses[botResponse] : botResponses['default'],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 600)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      {/* Chat Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          y: isVisible ? 0 : 20,
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        disabled={isOpen}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg flex items-center justify-center text-white disabled:opacity-0 transition-all"
        style={{
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : [0, 10, -10, 0] }}
          transition={{ repeat: isOpen ? 0 : Infinity, duration: 2 }}
        >
          <MessageCircle size={24} />
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50 w-full max-w-sm sm:max-w-md h-96 sm:h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl flex flex-col border border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base tracking-widest">SUPPORT</h3>
              <p className="text-blue-100 text-xs">We&apos;re here to help!</p>
            </div>
            <motion.button
              whileHover={{ rotate: 90 }}
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 bg-black/30">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 sm:px-6 py-3 space-y-2 border-t border-white/10 bg-black/20">
            <p className="text-gray-400 text-xs font-bold tracking-widest">QUICK OPTIONS:</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage(reply)}
                  className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors whitespace-nowrap"
                >
                  {reply}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 sm:px-6 py-3 border-t border-white/10 flex gap-2 bg-black/40">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type message..."
              className="flex-1 bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSendMessage()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
            >
              <Send size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
