'use client'

import { useEffect, useState } from 'react'
import { Save, Lock, Eye, EyeOff } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import type { SiteSettings } from '@/lib/firestore'

const DEFAULTS: SiteSettings = {
  announcementBar: 'Officially Licensed Jean-Claude Van Damme Merchandise',
  contactEmail: 'contact@jcvdworld.com',
  socialLinks: { facebook: '#', twitter: '#', instagram: '#', youtube: '#' },
}

export default function AdminSettingsPage() {
  const { getToken, changePassword, user } = useAdminAuth()
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

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

  async function handlePasswordChange() {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long')
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('New password must be different from current password')
      return
    }

    setChangingPassword(true)
    setPasswordError('')

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setPasswordChanged(true)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPasswordChanged(false), 3000)
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to change password')
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) return <div className="text-gray-500 text-sm">Loading...</div>

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-black tracking-widest">SITE SETTING</h1>
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

        {/* Password Change */}
        <section className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-white text-sm font-bold tracking-widest border-b border-white/5 pb-3">CHANGE PASSWORD</h2>

          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs tracking-widest block mb-2">CURRENT PASSWORD</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 pr-10 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs tracking-widest block mb-2">NEW PASSWORD</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 pr-10 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Enter new password (min 8 characters)"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-xs tracking-widest block mb-2">CONFIRM NEW PASSWORD</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 pr-10 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-800/50 rounded-lg p-3">
                {passwordError}
              </div>
            )}

            {passwordChanged && (
              <div className="text-green-400 text-sm bg-green-900/20 border border-green-800/50 rounded-lg p-3">
                ✓ Password changed successfully!
              </div>
            )}

            <button
              onClick={handlePasswordChange}
              disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold tracking-wide hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock size={16} />
              {changingPassword ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
