'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, AlertCircle, CheckCircle, Phone, Globe, Loader2, Check, } from 'lucide-react'
import { useFirestoreListener } from '@/hooks/useFirestoreListener'
import { useFirestoreSync } from '@/hooks/useFirestoreSync'
import AdminHeader from '@/components/admin/AdminHeader'

interface SiteSettings {
  announcementBar: string
  contactEmail: string
  socialLinks: { facebook: string; twitter: string; instagram: string; youtube: string }
  whatsappNumber: string
  cashappHandle: string
  venmoHandle: string
}

export default function AdminSettingsPage() {
  // Real-time listeners
  const { data: firestoreSettings, loading } = useFirestoreListener<SiteSettings>('pageSettings', 'siteSettings')
  const { sync, isSyncing, error: syncError } = useFirestoreSync('pageSettings')

  const [settings, setSettings] = useState<SiteSettings>({
    announcementBar: 'Officially Licensed Jonathan Roumie Merchandise',
    contactEmail: 'contact@jonathanroumieworld.com',
    socialLinks: { facebook: '#', twitter: '#', instagram: '#', youtube: '#' },
    whatsappNumber: '',
    cashappHandle: '',
    venmoHandle: '',
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync Firestore data to local state
  useEffect(() => {
    if (firestoreSettings) {
      console.log('[Admin Settings] Syncing Firestore data:', firestoreSettings)
      setSettings(firestoreSettings)
      setError(null)
    }
  }, [firestoreSettings])

  const handleSave = async () => {
    try {
      setError(null)
      console.log('[Admin Settings] Saving settings:', settings)
      await sync('siteSettings', settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      console.error('[Admin Settings] Save failed:', err)
      setError(err.message || 'Failed to save settings')
      setTimeout(() => setError(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <AdminHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 size={32} className="text-red-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading settings...</p>
          </div>
        </div>
      </div>
    )
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

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 bg-red-900/20 border border-red-800/50 rounded-lg p-4"
            >
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Success Alert */}
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-green-900/20 border border-green-800/50 rounded-lg p-4"
            >
              <Check size={18} className="text-green-400" />
              <p className="text-green-300 text-sm font-medium">Settings saved successfully!</p>
            </motion.div>
          )}

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
                WHATSAPP NUMBER
              </label>
              <input
                type="tel"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="+1234567890"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors"
              />
              <p className="text-gray-500 text-xs mt-2">Full phone number with country code for WhatsApp support links</p>
            </div>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-sm">
                Users clicking "Talk to Human Agent" will be directed to WhatsApp with this number
              </p>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <h2 className="text-white text-2xl font-black">PAYMENT METHODS</h2>

            {/* CashApp */}
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <label className="text-white font-bold text-sm tracking-widest block">CASHAPP HANDLE</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-semibold">$</span>
                <input
                  type="text"
                  value={settings.cashappHandle}
                  onChange={(e) => setSettings({ ...settings, cashappHandle: e.target.value })}
                  placeholder="jonathanroumie"
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
              </div>
              <p className="text-gray-500 text-xs">CashApp handle without the $ symbol</p>
            </div>

            {/* Venmo */}
            <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
              <label className="text-white font-bold text-sm tracking-widest block">VENMO HANDLE</label>
              <input
                type="text"
                value={settings.venmoHandle}
                onChange={(e) => setSettings({ ...settings, venmoHandle: e.target.value })}
                placeholder="jonathan-roumie"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <p className="text-gray-500 text-xs">Venmo username or phone number</p>
            </div>
          </motion.div>

          {/* Email Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <h2 className="text-white text-2xl font-black">EMAIL SETTINGS</h2>

            <div>
              <label className="text-white font-bold text-sm tracking-widest block mb-3">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
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
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe size={24} className="text-blue-400" />
              <h2 className="text-white text-2xl font-black">SITE SETTINGS</h2>
            </div>

            <div>
              <label className="text-white font-bold text-sm tracking-widest block mb-3">
                ANNOUNCEMENT BAR
              </label>
              <input
                type="text"
                value={settings.announcementBar}
                onChange={(e) => setSettings({ ...settings, announcementBar: e.target.value })}
                placeholder="Announcement text"
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-gray-500 text-xs mt-2">Text displayed in announcement bar at top of site</p>
            </div>
          </motion.div>

          {/* Real-time Sync Status */}
          <div className="rounded-lg bg-white/5 border border-white/10 p-4">
            <p className="text-gray-400 text-xs">
              ✓ Real-time sync enabled. All changes save to Firestore and update across the site instantly.
            </p>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSyncing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isSyncing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                SAVING...
              </>
            ) : saved ? (
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
