'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Shield, Trash2, Edit, Check, X, AlertCircle, Loader2, Mail } from 'lucide-react'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import { useFirestoreListener } from '@/hooks/useFirestoreListener'
import { useFirestoreSync } from '@/hooks/useFirestoreSync'
import AdminHeader from '@/components/admin/AdminHeader'

interface AdminUser {
  id: string
  email: string
  role: 'super-admin' | 'admin' | 'moderator'
  verified: boolean
  createdAt: string
}

// Hardcoded super admin emails that cannot be removed
const PROTECTED_ADMINS = [
  'empiredigitalsworldwide@gmail.com',
  'empiredigitalsceo@gmail.com',
]

export default function AdminManagementPage() {
  const { adminRole } = useAdminAuth()
  
  // Real-time listener for admins
  const { data: firestoreAdmins, loading: adminsLoading } = useFirestoreListener<Record<string, AdminUser[]>>('pageSettings', 'adminsList')
  const { sync, isSyncing } = useFirestoreSync('pageSettings')

  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Sync Firestore data to local state
  useEffect(() => {
    if (firestoreAdmins && Array.isArray(firestoreAdmins)) {
      console.log('[Admin Management] Syncing Firestore admins:', firestoreAdmins)
      setAdmins(firestoreAdmins)
    }
  }, [firestoreAdmins])

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) {
      setError('Please enter an email address')
      return
    }

    // Validate email format
    if (!newAdminEmail.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    // Check if already exists
    if (admins.some(a => a.email.toLowerCase() === newAdminEmail.toLowerCase())) {
      setError('This admin email already exists')
      return
    }

    setAdding(true)
    setError(null)
    setSuccess(null)

    try {
      console.log('[Admin Management] Adding admin:', newAdminEmail)
      
      const newAdmin: AdminUser = {
        id: newAdminEmail.toLowerCase(),
        email: newAdminEmail.toLowerCase(),
        role: 'admin',
        verified: true,
        createdAt: new Date().toISOString(),
      }

      // Add to Firestore admins collection - this will be synced from the listener
      const updatedAdmins = [...admins, newAdmin]
      
      // Save to both locations for compatibility
      await sync('adminsList', updatedAdmins)

      // Also save directly to admins collection
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newAdmin.email, role: 'admin' })
      })

      if (response.ok) {
        setSuccess(`${newAdminEmail} added successfully! They can now login.`)
        setNewAdminEmail('')
        setShowAddForm(false)
        // Refresh admins list
        setAdmins(updatedAdmins)
      } else {
        const errData = await response.json()
        setError(errData.error || 'Failed to add admin')
      }
    } catch (err: any) {
      console.error('[Admin Management] Failed to add admin:', err)
      setError(err.message || 'Failed to add admin')
    }
    setAdding(false)
  }

  const deleteAdmin = async (adminId: string, email: string) => {
    if (PROTECTED_ADMINS.includes(email)) {
      setError('Cannot remove protected super admin accounts')
      return
    }

    if (!confirm(`Are you sure you want to remove ${email}?`)) return

    try {
      console.log('[Admin Management] Deleting admin:', email)
      
      const updatedAdmins = admins.filter(a => a.email !== email)
      await sync('adminsList', updatedAdmins)
      setAdmins(updatedAdmins)
      setSuccess(`${email} removed successfully`)
    } catch (err: any) {
      console.error('[Admin Management] Failed to delete admin:', err)
      setError(err.message || 'Failed to remove admin')
    }
  }

  const changeRole = async (email: string, newRole: 'super-admin' | 'admin' | 'moderator') => {
    if (PROTECTED_ADMINS.includes(email) && newRole !== 'super-admin') {
      setError('Cannot change role of protected super admin')
      return
    }

    try {
      console.log('[Admin Management] Changing admin role:', email, newRole)
      
      const updatedAdmins = admins.map(a => 
        a.email === email ? { ...a, role: newRole } : a
      )
      await sync('adminsList', updatedAdmins)
      setAdmins(updatedAdmins)
      setSuccess(`${email} role updated to ${newRole}`)
    } catch (err: any) {
      console.error('[Admin Management] Failed to update admin:', err)
      setError(err.message || 'Failed to update admin')
    }
  }

  if (adminRole !== 'super-admin') {
    return (
      <div className="min-h-screen bg-black">
        <AdminHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">You need Super Admin privileges to manage admin users.</p>
          </div>
        </div>
      </div>
    )
  }

  if (adminsLoading) {
    return (
      <div className="min-h-screen bg-black">
        <AdminHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 size={32} className="text-red-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-400">Loading admins...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-widest mb-2">ADMIN MANAGEMENT</h1>
              <p className="text-gray-400">Add and manage administrator accounts</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              <UserPlus size={20} />
              Add Admin
            </motion.button>
          </div>

          {/* Alerts */}
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

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 bg-green-900/20 border border-green-800/50 rounded-lg p-4"
            >
              <Check size={18} className="text-green-400" />
              <p className="text-green-300 text-sm">{success}</p>
            </motion.div>
          )}

          {/* Add Admin Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4"
            >
              <h3 className="text-white font-bold">Add New Admin</h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && addAdmin()}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addAdmin}
                  disabled={adding || isSyncing}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-700/60 text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {adding || isSyncing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Add
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddForm(false)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Admins List */}
          <div className="space-y-3">
            {admins.map((admin, idx) => (
              <motion.div
                key={admin.email}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-lg p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Mail size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-white font-bold">{admin.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        admin.role === 'super-admin' 
                          ? 'bg-red-900/50 text-red-300'
                          : admin.role === 'admin'
                          ? 'bg-blue-900/50 text-blue-300'
                          : 'bg-purple-900/50 text-purple-300'
                      }`}>
                        {admin.role.toUpperCase()}
                      </span>
                      {PROTECTED_ADMINS.includes(admin.email) && (
                        <span className="text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded-full">PROTECTED</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!PROTECTED_ADMINS.includes(admin.email) && (
                    <>
                      <select
                        value={admin.role}
                        onChange={(e) => changeRole(admin.email, e.target.value as any)}
                        className="bg-white/5 border border-white/20 rounded px-3 py-1 text-xs text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                      >
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                        <option value="super-admin">Super Admin</option>
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteAdmin(admin.id, admin.email)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Shield size={48} className="mx-auto mb-4 opacity-50" />
              <p>No admins found. Add one to get started!</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
        loadAdmins()
      } else {
        alert('Failed to change role')
      }
    } catch (error) {
      console.error('Failed to change role:', error)
      alert('Failed to change role')
    }
  }

  const removeAdmin = async (adminId: string, adminEmail: string) => {
    if (adminEmail === user?.email) {
      alert('You cannot remove yourself')
      return
    }

    if (PROTECTED_ADMINS.includes(adminEmail)) {
      alert(`Cannot remove ${adminEmail} - this is a protected super admin account`)
      return
    }

    if (!confirm(`Remove ${adminEmail} from admin access?`)) return

    const token = await getToken()
    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        loadAdmins()
      } else {
        alert('Failed to remove admin')
      }
    } catch (error) {
      console.error('Failed to remove admin:', error)
      alert('Failed to remove admin')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin': return 'text-red-400 bg-red-900/30'
      case 'admin': return 'text-blue-400 bg-blue-900/30'
      case 'moderator': return 'text-green-400 bg-green-900/30'
      default: return 'text-gray-400 bg-gray-900/30'
    }
  }

  useEffect(() => {
    loadAdmins()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">ADMIN MANAGEMENT</h1>
            <p className="text-gray-400">Manage admin users and their permissions</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <UserPlus size={16} />
            Add Admin
          </button>
        </div>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8"
        >
          <h3 className="text-white font-semibold mb-4">Add New Admin</h3>
          <div className="flex gap-4">
            <input
              type="email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="admin@example.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={addAdmin}
              disabled={adding || !newAdminEmail}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Admins List */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Current Admins</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No admins found</div>
        ) : (
          <div className="divide-y divide-white/10">
            {admins.map((admin) => (
              <div key={admin.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-red-900/30 border border-red-800/50 rounded-full flex items-center justify-center">
                    <Shield size={20} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{admin.email}</h3>
                      {PROTECTED_ADMINS.includes(admin.email) && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold">PROTECTED</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Added {new Date(admin.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={admin.role}
                      onChange={(e) => changeRole(admin.id, e.target.value as 'super-admin' | 'admin' | 'moderator')}
                      className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-red-500"
                    >
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {admin.verified ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <X size={16} className="text-red-400" />
                    )}

                    <button
                      onClick={() => removeAdmin(admin.id, admin.email)}
                      disabled={admin.email === user?.email || PROTECTED_ADMINS.includes(admin.email)}
                      className="text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed p-1 transition-colors"
                      title={PROTECTED_ADMINS.includes(admin.email) ? 'This is a protected super admin' : ''}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permissions Info */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Permission Levels</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-red-400 rounded-full mt-2"></div>
            <div>
              <h3 className="text-white font-semibold">Super Admin</h3>
              <p className="text-gray-400 text-sm">Full system access, can manage other admins, system settings</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full mt-2"></div>
            <div>
              <h3 className="text-white font-semibold">Admin</h3>
              <p className="text-gray-400 text-sm">Can manage content, users, orders, payments</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full mt-2"></div>
            <div>
              <h3 className="text-white font-semibold">Moderator</h3>
              <p className="text-gray-400 text-sm">Limited access to user management and content moderation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
