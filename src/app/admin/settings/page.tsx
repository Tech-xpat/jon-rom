'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import type { SiteSettings } from '@/lib/firestore'

const DEFAULTS: SiteSettings = {
  announcementBar: 'Officially Licensed Jean-Claude Van Damme Merchandise',
  contactEmail: 'contact@jcvdworld.com',
  socialLinks: { facebook: '#', twitter: '#', instagram: '#', youtube: '#' },
}

export default function AdminSettingsPage() {
  const { getToken } = useAdminAuth()
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function hdr() {
    const t = await getToken()
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }
  }

  useEffect(() => {
    async function load() {
      const h = await hdr()
      const res = await fetch('/api/admin/settings/site', { headers: h })
      if (res.ok) setSettings(await res.json())
      setLoading(false)
    }
    load()
  }, [])

  async function save() {
    setSaving(true)
    const h = await hdr()
    await fetch('/api/admin/settings/site', { method: 'PUT', headers: h, body: JSON.stringify(settings) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-black tracking-widest">SITE SETTINGS</h1>
        <p className="text-gray-500 text-sm mt-1">General configuration for the Jonathan Roumie website</p>
      </div>

      <div className="space-y-6">
        {/* General */}
        <section className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-white text-sm font-bold tracking-widest border-b border-white/5 pb-3">GENERAL</h2>

          <div>
            <label className="text-gray-400 text-xs tracking-widest block mb-2">ANNOUNCEMENT BAR TEXT</label>
            <input type="text" value={settings.announcementBar}
              onChange={(e) => setSettings({ ...settings, announcementBar: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors" />
          </div>

          <div>
            <label className="text-gray-400 text-xs tracking-widest block mb-2">CONTACT EMAIL</label>
            <input type="email" value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors" />
          </div>
        </section>

        {/* Social links */}
        <section className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-white text-sm font-bold tracking-widest border-b border-white/5 pb-3">SOCIAL LINKS</h2>
          {(['facebook', 'twitter', 'instagram', 'youtube'] as const).map((platform) => (
            <div key={platform}>
              <label className="text-gray-400 text-xs tracking-widest block mb-2">{platform.toUpperCase()}</label>
              <input type="url" value={settings.socialLinks[platform]}
                onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [platform]: e.target.value } })}
                placeholder={`https://${platform}.com/jcvdworld`}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors" />
            </div>
          ))}
        </section>

        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold tracking-wide hover:bg-red-700 transition-colors disabled:opacity-50">
          <Save size={16} />
          {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
