'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, Zap } from 'lucide-react'
import { useFirestoreListener } from '@/hooks/useFirestoreListener'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import type { FanCardSettings } from '@/lib/firestore'

export default function AdminFanCardPage() {
  // Real-time listener on the CORRECT collection: settings/fanCard
  const { data: firestoreSettings, loading, error: listenerError } = useFirestoreListener<FanCardSettings>('settings', 'fanCard')
  const { getToken } = useAdminAuth()

  const [settings, setSettings] = useState<FanCardSettings>({
    price: 5000,
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    accentColor: '#FF0000',
    logoUrl: '/images/jvcd-avatar.jpg',
    footerText: 'OFFICIAL JONATHAN ROUMIE WORLD FAN CARD',
  })
  const [antiScreenshot, setAntiScreenshot] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  // Live preview name
  const [previewName, setPreviewName] = useState('YOUR NAME')

  // Sync Firestore real-time data to local state
  useEffect(() => {
    if (firestoreSettings) {
      setSettings(firestoreSettings)
    }
  }, [firestoreSettings])

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/settings/fan-card', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Save failed')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e: any) {
      setSaveError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Loader2 size={32} className="text-red-500 animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading fan card settings...</p>
      </div>
    </div>
  )

  const priceDisplay = (settings.price / 100).toFixed(2)

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-white text-2xl font-black tracking-widest">FAN CARD SETTINGS</h1>
          <div className="flex items-center gap-1.5 bg-green-900/30 border border-green-700/40 rounded-full px-2.5 py-1">
            <Zap size={10} className="text-green-400" />
            <span className="text-green-400 text-[10px] font-bold tracking-widest">LIVE</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm">Changes save to Firestore and reflect on the fan card page instantly</p>
      </div>

      {/* Live Card Preview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-gray-400 text-xs tracking-widest">LIVE CARD PREVIEW</p>
          <input
            type="text"
            value={previewName === 'YOUR NAME' ? '' : previewName}
            onChange={(e) => setPreviewName(e.target.value || 'YOUR NAME')}
            placeholder="Type a name to preview..."
            className="bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-red-500 transition-colors placeholder:text-white/20 w-48"
          />
        </div>
        <div
          className="w-[340px] h-[210px] rounded-2xl overflow-hidden relative border border-white/10 transition-all duration-300"
          style={{
            background: settings.background,
            boxShadow: `0 20px 40px ${settings.accentColor}33`,
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
            style={{ background: `linear-gradient(90deg, ${settings.accentColor}, ${settings.accentColor}88, ${settings.accentColor})` }}
          />
          {/* Chip */}
          <div className="absolute top-5 left-5 w-10 h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5 opacity-60">
              {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-yellow-700 rounded-sm" />)}
            </div>
          </div>
          {/* Avatar */}
          {settings.logoUrl && (
            <div className="absolute top-4 right-4 w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-300" style={{ borderColor: `${settings.accentColor}99` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
          )}
          {/* Title */}
          <div className="absolute top-[52px] left-5">
            <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase">Official Member</p>
            <p className="text-white text-xs font-bold tracking-[0.25em]">JONATHAN ROUMIE</p>
          </div>
          {/* Name — animates as you type */}
          <div className="absolute bottom-10 left-5 right-5">
            <p
              className="text-white font-bold tracking-[0.15em] uppercase truncate transition-all duration-200"
              style={{
                fontSize: previewName.length > 20 ? '13px' : previewName.length > 12 ? '16px' : '20px',
                textShadow: `0 0 20px ${settings.accentColor}99`,
              }}
            >
              {previewName}
            </p>
          </div>
          {/* Footer */}
          <div className="absolute bottom-3 left-5 right-5 flex justify-between">
            <p className="text-white/40 text-[10px] tracking-widest font-mono">JR-000000</p>
            <p className="text-white/40 text-[10px] tracking-widest">{new Date().getFullYear()}</p>
          </div>
          <p className="absolute bottom-[-2px] left-0 right-0 text-center text-[8px] tracking-widest text-white/20">{settings.footerText}</p>
        </div>
        <p className="text-gray-600 text-xs mt-2">Price shown to fans: <span className="text-white font-bold">${priceDisplay}</span></p>
      </div>

      <div className="space-y-5 bg-white/3 border border-white/5 rounded-2xl p-6">

        {/* Price */}
        <div>
          <label className="text-gray-400 text-xs tracking-widest block mb-2">PRICE (USD) — Controls what fans pay</label>
          <div className="relative w-44">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              min="0.99"
              value={(settings.price / 100).toFixed(2)}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                if (!isNaN(val) && val >= 0.99) {
                  setSettings({ ...settings, price: Math.round(val * 100) })
                }
              }}
              className="w-full bg-white/5 border border-white/10 text-white pl-7 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
          <p className="text-gray-600 text-xs mt-1">Saving updates the price fans see immediately — no page reload needed</p>
        </div>

        {/* Accent color */}
        <div>
          <label className="text-gray-400 text-xs tracking-widest block mb-2">ACCENT COLOR</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="w-12 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors w-32 font-mono"
            />
          </div>
        </div>

        {/* Background */}
        <div>
          <label className="text-gray-400 text-xs tracking-widest block mb-2">BACKGROUND (CSS gradient or color)</label>
          <textarea
            value={settings.background}
            onChange={(e) => setSettings({ ...settings, background: e.target.value })}
            rows={2}
            className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors resize-none font-mono"
          />
        </div>

        {/* Footer text */}
        <div>
          <label className="text-gray-400 text-xs tracking-widest block mb-2">FOOTER TEXT</label>
          <input
            type="text"
            value={settings.footerText}
            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="text-gray-400 text-xs tracking-widest block mb-2">LOGO IMAGE URL</label>
          <input
            type="text"
            value={settings.logoUrl}
            onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
            className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* Anti-screenshot */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={antiScreenshot}
              onChange={(e) => setAntiScreenshot(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-red-600"
            />
            <div>
              <p className="text-gray-300 text-sm font-medium">Anti-Screenshot Protection</p>
              <p className="text-gray-500 text-xs mt-0.5">Prevent right-click menu and selection on fan cards</p>
            </div>
          </label>
        </div>

        {/* Errors */}
        {(saveError || listenerError) && (
          <div className="bg-red-950/40 border border-red-800/60 rounded-lg p-3">
            <p className="text-red-400 text-sm">{saveError || listenerError}</p>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold tracking-wide hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 size={16} className="animate-spin" />Saving...</>
          ) : saved ? (
            <><Zap size={16} className="text-yellow-300" /><span>Saved &amp; Live!</span></>
          ) : (
            <><Save size={16} />Save Settings</>
          )}
        </button>
      </div>
    </div>
  )
}
