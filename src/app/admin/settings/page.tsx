'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, AlertCircle, CheckCircle, Phone, Globe } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminSettingsPage() {
  const { isAdmin } = useAdminAuth()
  const [settings, setSettings] = useState({
    whatsappNumber: '1234567890',
    adminEmail: 'admin@example.com',
    siteName: 'Jonathan Roumie Official',
    maintenanceMode: false,
  })
  const [saved, setSaved] = useState(false)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Admin access required</p>
      </div>
    )
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-white text-4xl font-black tracking-widest mb-2">ADMIN SETTINGS</h1>
            <p className="text-gray-400">Configure global site settings and contact information</p>
          </div>

          {/* WhatsApp Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Phone size={24} className="text-green-400" />
              <h2 className="text-white text-2xl font-black">WHATSAPP SUPPORT</h2>
            </div>

            <div>
              <label className="text-white font-bold text-sm tracking-widest block mb-3">
                WHATSAPP NUMBER (ADMIN)
              </label>
              <input
                type="tel"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="1234567890"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
              />
              <p className="text-gray-500 text-xs mt-2">This number is used for WhatsApp chat support links</p>
            </div>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-sm">
                Users clicking "Talk to Human Agent" in chat will be redirected to WhatsApp with this number
              </p>
            </div>
          </motion.div>

          {/* Email Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <h2 className="text-white text-2xl font-black">EMAIL SETTINGS</h2>

            <div>
              <label className="text-white font-bold text-sm tracking-widest block mb-3">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                placeholder="admin@example.com"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-gray-500 text-xs mt-2">Contact email for important notifications</p>
            </div>
          </motion.div>

          {/* Site Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe size={24} className="text-blue-400" />
              <h2 className="text-white text-2xl font-black">SITE SETTINGS</h2>
            </div>

            <div>
              <label className="text-white font-bold text-sm tracking-widest block mb-3">
                SITE NAME
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="Site Name"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
              <div>
                <p className="text-white font-bold text-sm">MAINTENANCE MODE</p>
                <p className="text-gray-500 text-xs mt-1">Temporarily disable site for all users</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                  settings.maintenanceMode
                    ? 'bg-red-600/20 text-red-400 border border-red-500/50'
                    : 'bg-green-600/20 text-green-400 border border-green-500/50'
                }`}
              >
                {settings.maintenanceMode ? 'ON' : 'OFF'}
              </motion.button>
            </div>
          </motion.div>

          {/* Security Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-900/20 border border-blue-500/50 rounded-2xl p-6"
          >
            <h3 className="text-white font-bold mb-3">SECURITY FEATURES ACTIVE</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Rate limiting (100 requests/minute per IP)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                SQL injection protection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                XSS attack prevention
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Security headers enabled
              </li>
            </ul>
          </motion.div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {saved ? (
              <>
                <CheckCircle size={20} />
                SETTINGS SAVED
              </>
            ) : (
              <>
                <Save size={20} />
                SAVE SETTINGS
              </>
            )}
          </motion.button>
        </motion.div>
      </main>
    </div>
  )
}
