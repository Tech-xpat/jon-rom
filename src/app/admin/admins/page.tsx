'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Shield, Trash2, Check, X, Edit2, KeyRound,
  Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ChevronDown,
} from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'

interface AdminUser {
  id: string
  email: string
  role: 'super-admin' | 'admin' | 'moderator'
  verified: boolean
  createdAt: string
}

const PROTECTED_ADMINS = [
  'empiredigitalsworldwide@gmail.com',
  'empiredigitalsceo@gmail.com',
]

// ─── Inline message helper ────────────────────────────────────────────────────
function Msg({ type, text, onDismiss }: { type: 'success' | 'error'; text: string; onDismiss?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm mb-4 ${
        type === 'success'
          ? 'bg-green-900/25 border border-green-700/40 text-green-300'
          : 'bg-red-900/25 border border-red-700/40 text-red-300'
      }`}
    >
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      <span className="flex-1">{text}</span>
      {onDismiss && <button onClick={onDismiss} className="opacity-50 hover:opacity-100"><X size={14} /></button>}
    </motion.div>
  )
}

export default function AdminManagementPage() {
  const { getToken, user, adminRole, changePassword } = useAdminAuth()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  // ── Add admin ──
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<'admin' | 'moderator'>('admin')
  const [adding, setAdding] = useState(false)
  const [addMsg, setAddMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // ── Edit email ──
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editEmail, setEditEmail] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editMsg, setEditMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // ── Change password ──
  const [showPwSection, setShowPwSection] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadAdmins = async () => {
    const token = await getToken()
    try {
      const res = await fetch('/api/admin/admins', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setAdmins(await res.json())
    } catch {
      // silent
    }
    setLoading(false)
  }

  useEffect(() => { loadAdmins() }, [])

  // ── Add admin ──────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setAddMsg({ type: 'error', text: 'Enter a valid email address.' })
      return
    }
    setAdding(true)
    setAddMsg(null)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: newEmail.trim().toLowerCase(), role: newRole }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add admin')
      setAddMsg({ type: 'success', text: `${newEmail.trim()} added as ${newRole}.` })
      setNewEmail('')
      loadAdmins()
      setTimeout(() => { setShowAddForm(false); setAddMsg(null) }, 2000)
    } catch (e: any) {
      setAddMsg({ type: 'error', text: e.message || 'Could not add admin.' })
    } finally {
      setAdding(false)
    }
  }

  // ── Edit email ─────────────────────────────────────────────────────────────
  const startEdit = (admin: AdminUser) => {
    setEditingId(admin.id)
    setEditEmail(admin.email)
    setEditMsg(null)
  }

  const handleEditSave = async (adminId: string) => {
    if (!editEmail.trim() || !editEmail.includes('@')) {
      setEditMsg({ type: 'error', text: 'Enter a valid email.' })
      return
    }
    setEditSaving(true)
    setEditMsg(null)
    try {
      const token = await getToken()
      const res = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: editEmail.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update email')
      setEditMsg({ type: 'success', text: 'Email updated.' })
      setEditingId(null)
      loadAdmins()
      setTimeout(() => setEditMsg(null), 2500)
    } catch (e: any) {
      setEditMsg({ type: 'error', text: e.message || 'Could not update email.' })
    } finally {
      setEditSaving(false)
    }
  }

  // ── Change role ────────────────────────────────────────────────────────────
  const handleRoleChange = async (adminId: string, role: 'super-admin' | 'admin' | 'moderator') => {
    const token = await getToken()
    try {
      await fetch(`/api/admin/admins/${adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      })
      loadAdmins()
    } catch {
      // silent
    }
  }

  // ── Remove admin ───────────────────────────────────────────────────────────
  const handleRemove = async (adminId: string, email: string) => {
    if (email === user?.email) return
    if (PROTECTED_ADMINS.includes(email)) return
    const token = await getToken()
    try {
      await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      loadAdmins()
    } catch {
      // silent
    }
  }

  // ── Change password ────────────────────────────────────────────────────────
  const handlePasswordChange = async () => {
    setPwMsg(null)
    if (!currentPw) { setPwMsg({ type: 'error', text: 'Enter your current password.' }); return }
    if (newPw.length < 6) { setPwMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return }
    if (newPw !== confirmPw) { setPwMsg({ type: 'error', text: 'New passwords do not match.' }); return }
    setPwSaving(true)
    try {
      await changePassword(currentPw, newPw)
      setPwMsg({ type: 'success', text: 'Password changed successfully.' })
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
      setTimeout(() => { setShowPwSection(false); setPwMsg(null) }, 2500)
    } catch (e: any) {
      // Map common errors to friendly messages, never show raw Firebase error codes
      const msg = e.message || ''
      if (msg.includes('wrong-password') || msg.includes('incorrect') || msg.includes('invalid-credential')) {
        setPwMsg({ type: 'error', text: 'Current password is incorrect.' })
      } else if (msg.includes('too-many-requests') || msg.includes('too many')) {
        setPwMsg({ type: 'error', text: 'Too many attempts. Please wait a few minutes and try again.' })
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setPwMsg({ type: 'error', text: 'Network error. Check your connection and try again.' })
      } else {
        setPwMsg({ type: 'error', text: 'Could not change password. Please try again.' })
      }
    } finally {
      setPwSaving(false)
    }
  }

  const getRolePill = (role: string) => {
  const map: Record<string, string> = {
    'super-admin': 'bg-red-900/30 text-red-400 border-red-800/40',
    'admin': 'bg-blue-900/30 text-blue-400 border-blue-800/40',
    'moderator': 'bg-green-900/30 text-green-400 border-green-800/40',
  }
  return map[role] || 'bg-gray-900/30 text-gray-400 border-gray-800/40'
}  // ✅ CLOSE FUNCTION

return (
  <div className="max-w-2xl space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-black tracking-widest">ADMIN MANAGEMENT</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, and manage admin accounts</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setAddMsg(null) }}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors"
        >
          <UserPlus size={15} />
          Add Admin
        </button>
      </div>

      {/* ── Add Admin Panel ── */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold text-sm tracking-widest">NEW ADMIN</h3>

              <AnimatePresence>{addMsg && <Msg type={addMsg.type} text={addMsg.text} onDismiss={() => setAddMsg(null)} />}</AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="admin@example.com"
                  className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 transition-colors placeholder:text-white/20 text-sm"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'admin' | 'moderator')}
                  className="bg-white/5 border border-white/10 text-white px-3 py-3 rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  {adding ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {adding ? 'Adding…' : 'Add Admin'}
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setAddMsg(null); setNewEmail('') }}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Admin List ── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
          <h2 className="text-white font-black text-sm tracking-widests">CURRENT ADMINS</h2>
          <span className="text-gray-500 text-xs">{admins.length} total</span>
        </div>

        <AnimatePresence>{editMsg && (
          <div className="px-6 pt-4">
            <Msg type={editMsg.type} text={editMsg.text} onDismiss={() => setEditMsg(null)} />
          </div>
        )}</AnimatePresence>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 size={24} className="text-gray-600 animate-spin mx-auto" />
          </div>
        ) : admins.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No admins found</div>
        ) : (
          <div className="divide-y divide-white/5">
            {admins.map((admin) => (
              <div key={admin.id} className="px-6 py-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-9 h-9 bg-red-900/20 border border-red-800/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield size={16} className="text-red-400" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    {editingId === admin.id ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEditSave(admin.id)}
                          className="flex-1 bg-white/8 border border-white/20 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <button
                          onClick={() => handleEditSave(admin.id)}
                          disabled={editSaving}
                          className="p-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg transition-colors"
                        >
                          {editSaving ? <Loader2 size={13} className="animate-spin text-white" /> : <Check size={13} className="text-white" />}
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditMsg(null) }}
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <X size={13} className="text-gray-400" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white font-semibold text-sm truncate">{admin.email}</span>
                        {PROTECTED_ADMINS.includes(admin.email) && (
                          <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">PROTECTED</span>
                        )}
                        {admin.email === user?.email && (
                          <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 py-0.5 rounded">You</span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold tracking-wide ${getRolePill(admin.role)}`}>
                        {admin.role.toUpperCase()}
                      </span>
                      <span className="text-gray-600 text-xs">
                        Added {new Date(admin.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Edit email */}
                    {!PROTECTED_ADMINS.includes(admin.email) && editingId !== admin.id && (
                      <button
                        onClick={() => startEdit(admin)}
                        className="p-2 text-gray-500 hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                        title="Edit email"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}

                    {/* Role select */}
                    {!PROTECTED_ADMINS.includes(admin.email) && (
                      <div className="relative">
                        <select
                          value={admin.role}
                          onChange={(e) => handleRoleChange(admin.id, e.target.value as any)}
                          className="appearance-none bg-white/5 border border-white/10 text-gray-300 pl-2 pr-6 py-1.5 rounded-lg text-xs focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                        >
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                          <option value="super-admin">Super Admin</option>
                        </select>
                        <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    )}

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(admin.id, admin.email)}
                      disabled={admin.email === user?.email || PROTECTED_ADMINS.includes(admin.email)}
                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-900/20 disabled:opacity-20 disabled:cursor-not-allowed rounded-lg transition-colors"
                      title={PROTECTED_ADMINS.includes(admin.email) ? 'Protected admin' : 'Remove admin'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Change Password ── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        <button
          onClick={() => { setShowPwSection(!showPwSection); setPwMsg(null) }}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/3 transition-colors"
        >
          <div className="flex items-center gap-3">
            <KeyRound size={18} className="text-gray-400" />
            <div className="text-left">
              <p className="text-white font-bold text-sm tracking-wide">CHANGE PASSWORD</p>
              <p className="text-gray-500 text-xs mt-0.5">Update your admin account password</p>
            </div>
          </div>
          <motion.div animate={{ rotate: showPwSection ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} className="text-gray-500" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showPwSection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 space-y-4 border-t border-white/8">

                <AnimatePresence>{pwMsg && <Msg type={pwMsg.type} text={pwMsg.text} onDismiss={() => setPwMsg(null)} />}</AnimatePresence>

                {/* Current password */}
                <div>
                  <label className="text-gray-400 text-xs tracking-widests block mb-2">CURRENT PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      plac
