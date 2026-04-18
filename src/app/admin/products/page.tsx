'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, Package } from 'lucide-react'
import Image from 'next/image'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'
import type { Product } from '@/lib/firestore'

const CATEGORIES = ['Hoodies', 'T-Shirts', 'Tanks', 'Beanies', 'Caps', 'Accessories']

const EMPTY: Omit<Product, 'id' | 'createdAt'> = {
  name: '', price: 2999, description: '', image: '', category: 'Hoodies', inStock: true,
}

export default function AdminProductsPage() {
  const { getToken } = useAdminAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function authHeaders() {
    const token = await getToken()
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  }

  async function load() {
    const h = await authHeaders()
    const res = await fetch('/api/admin/products', { headers: h })
    setProducts(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() { setForm(EMPTY); setEditId(null); setShowForm(true) }
  function openEdit(p: Product) { setForm({ name: p.name, price: p.price, description: p.description, image: p.image, category: p.category, inStock: p.inStock }); setEditId(p.id); setShowForm(true) }

  async function save() {
    setSaving(true)
    const h = await authHeaders()
    if (editId) {
      await fetch(`/api/admin/products?id=${editId}`, { method: 'PUT', headers: h, body: JSON.stringify(form) })
    } else {
      await fetch('/api/admin/products', { method: 'POST', headers: h, body: JSON.stringify(form) })
    }
    await load()
    setShowForm(false)
    setSaving(false)
  }

  async function remove(id: string) {
    if (!confirm('Delete this product?')) return
    setDeleting(id)
    const h = await authHeaders()
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE', headers: h })
    await load()
    setDeleting(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white text-2xl font-black tracking-widest">PRODUCTS</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} items in store</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide hover:bg-red-700 transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="bg-white/3 rounded-2xl h-64 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden">
              <div className="relative aspect-square bg-white/5">
                {p.image && <Image src={p.image} alt={p.name} fill className="object-cover" />}
                {!p.image && <div className="flex items-center justify-center h-full"><Package size={40} className="text-white/10" /></div>}
                <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${p.inStock ? 'bg-green-900/80 text-green-300' : 'bg-red-900/80 text-red-300'}`}>
                  {p.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-white text-sm font-bold tracking-wide line-clamp-1">{p.name}</h3>
                  <span className="text-red-400 font-bold text-sm ml-2">${(p.price / 100).toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-xs mb-1">{p.category}</p>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4">{p.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded-lg transition-colors">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => remove(p.id)} disabled={deleting === p.id} className="flex items-center justify-center gap-1 bg-red-950/40 hover:bg-red-900/40 text-red-400 text-xs px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-black tracking-widest">{editId ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Product Name', key: 'name', type: 'text' },
                  { label: 'Image URL (or /images/... path)', key: 'image', type: 'text' },
                  { label: 'Description', key: 'description', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-gray-400 text-xs tracking-widest block mb-1">{label.toUpperCase()}</label>
                    <input type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors" />
                  </div>
                ))}

                <div>
                  <label className="text-gray-400 text-xs tracking-widest block mb-1">PRICE (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" step="0.01" min="0" value={(form.price / 100).toFixed(2)}
                      onChange={(e) => setForm({ ...form, price: Math.round(parseFloat(e.target.value) * 100) })}
                      className="w-full bg-white/5 border border-white/10 text-white pl-7 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs tracking-widest block mb-1">CATEGORY</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-red-500 transition-colors">
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-black">{c}</option>)}
                  </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-10 h-5 rounded-full transition-colors ${form.inStock ? 'bg-green-600' : 'bg-white/10'} relative`}
                    onClick={() => setForm({ ...form, inStock: !form.inStock })}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.inStock ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <span className="text-white text-sm">In Stock</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 bg-white/5 text-white py-2.5 rounded-xl text-sm font-bold tracking-wide hover:bg-white/10 transition-colors">Cancel</button>
                  <button onClick={save} disabled={saving || !form.name} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold tracking-wide hover:bg-red-700 transition-colors disabled:opacity-50">
                    <Check size={14} /> {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
