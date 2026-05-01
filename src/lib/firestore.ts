/**
 * Firestore-backed data layer.
 * Collections: products | gallery | settings (doc: fanCard, site)
 */
import { adminDb } from './firebase-admin'

export { adminDb }

// ✅ FIX: export this
export function getDb() {
  if (!adminDb) {
    throw new Error('Firebase admin is not initialized. Check FIREBASE_ADMIN_* environment variables.')
  }
  return adminDb
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  inStock: boolean
  createdAt: string
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
  createdAt: string
}

export interface FanCardSettings {
  price: number
  background: string
  accentColor: string
  logoUrl: string
  footerText: string
}

export interface SiteSettings {
  announcementBar: string
  contactEmail: string
  socialLinks: {
    facebook: string
    twitter: string
    instagram: string
    youtube: string
  }
}

/* ───────────────── PRODUCTS ───────────────── */

export async function getProducts(): Promise<Product[]> {
  const snap = await getDb().collection('products').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
}

export async function getProduct(id: string): Promise<Product | null> {
  const doc = await getDb().collection('products').doc(id).get()
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Product) : null
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const now = new Date().toISOString()
  const ref = await getDb().collection('products').add({ ...data, createdAt: now })
  return { id: ref.id, ...data, createdAt: now }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await getDb().collection('products').doc(id).update(data)
}

export async function deleteProduct(id: string): Promise<void> {
  await getDb().collection('products').doc(id).delete()
}

/* ───────────────── GALLERY ───────────────── */

export async function getGallery(): Promise<GalleryImage[]> {
  const snap = await getDb().collection('gallery').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage))
}

export async function addGalleryImage(data: Omit<GalleryImage, 'id' | 'createdAt'>): Promise<GalleryImage> {
  const now = new Date().toISOString()
  const ref = await getDb().collection('gallery').add({ ...data, createdAt: now })
  return { id: ref.id, ...data, createdAt: now }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await getDb().collection('gallery').doc(id).delete()
}

/* ───────────────── FAN CARD SETTINGS ───────────────── */

const DEFAULT_FAN_CARD: FanCardSettings = {
  price: 5000,
  background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
  accentColor: '#FF0000',
  logoUrl: '/images/jvcd-avatar.jpg',
  footerText: 'OFFICIAL JONATHAN ROUMIE WORLD FAN CARD',
}

export async function getFanCardSettings(): Promise<FanCardSettings> {
  const doc = await getDb().collection('settings').doc('fanCard').get()
  return doc.exists ? (doc.data() as FanCardSettings) : DEFAULT_FAN_CARD
}

export async function updateFanCardSettings(data: Partial<FanCardSettings>): Promise<void> {
  await getDb().collection('settings').doc('fanCard').set(data, { merge: true })
}

/* ───────────────── SITE SETTINGS ───────────────── */

const DEFAULT_SITE: SiteSettings = {
  announcementBar: 'Officially Licensed Jonathan Roumie Merchandise',
  contactEmail: 'contact@jonathanroumieworld.com',
  socialLinks: { facebook: '#', twitter: '#', instagram: '#', youtube: '#' },
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await getDb().collection('settings').doc('site').get()
  return doc.exists ? (doc.data() as SiteSettings) : DEFAULT_SITE
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  await getDb().collection('settings').doc('site').set(data, { merge: true })
}

/* ───────────────── ADMIN TYPES ───────────────── */

export interface Admin {
  id: string
  email: string
  role: 'super-admin' | 'admin' | 'moderator'
  verified: boolean
  createdAt: string
}

/* ───────────────── ADMIN MANAGEMENT ───────────────── */

export async function getAdmins(): Promise<Admin[]> {
  const snap = await getDb().collection('admins').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Admin))
}

export async function getAdmin(email: string): Promise<Admin | null> {
  const normalized = email.toLowerCase().trim()
  let snap = await getDb().collection('admins').where('email', '==', normalized).limit(1).get()

  if (snap.docs.length > 0) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Admin
  }

  snap = await getDb().collection('admins').where('email', '==', email.trim()).limit(1).get()

  return snap.docs.length > 0
    ? ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Admin)
    : null
}

/* ───────────────── USERS ───────────────── */

export interface User {
  id: string
  email: string
  googleId?: string
  whitelisted: boolean
  fanStatus: 'pending' | 'approved' | 'rejected'
  registeredAt: string
  paymentStatus: 'unpaid' | 'pending' | 'confirmed'
}

export async function getUsers(): Promise<User[]> {
  const snap = await getDb().collection('users').orderBy('registeredAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as User))
}

/* ───────────────── PAYMENTS ───────────────── */

export interface Payment {
  id: string
  userId?: string
  email?: string
  name?: string
  amount: number
  currency: 'USDT' | 'BTC' | 'PayPal' | 'Stripe'
  status: 'pending' | 'confirmed' | 'failed'
  createdAt: string
  updatedAt: string
}

export async function getPayments(): Promise<Payment[]> {
  const snap = await getDb().collection('payments').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment))
}
