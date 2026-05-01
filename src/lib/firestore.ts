/**
 * Firestore-backed data layer.
 * Collections: products | gallery | settings (doc: fanCard, site)
 */
import { adminDb } from './firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export { adminDb }

export interface Product {
  id: string
  name: string
  price: number        // cents
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
  socialLinks: { facebook: string; twitter: string; instagram: string; youtube: string }
}

// ─── Products ─────────────────────────────────────────────────────────────────
export function getDb() {
  if (!adminDb) throw new Error('Firebase admin is not initialized. Check FIREBASE_ADMIN_* environment variables.')
  return adminDb
}

export async function getProducts(): Promise<Product[]> {
  const snap = await getDb().collection('products').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
}

export async function getProduct(id: string): Promise<Product | null> {
  const doc = await getDb().collection('products').doc(id).get()
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Product) : null
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const ref = await getDb().collection('products').add({ ...data, createdAt: new Date().toISOString() })
  return { id: ref.id, ...data, createdAt: new Date().toISOString() }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await getDb().collection('products').doc(id).update(data)
}

export async function deleteProduct(id: string): Promise<void> {
  await getDb().collection('products').doc(id).delete()
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export async function getGallery(): Promise<GalleryImage[]> {
  const snap = await getDb().collection('gallery').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage))
}

export async function addGalleryImage(data: Omit<GalleryImage, 'id' | 'createdAt'>): Promise<GalleryImage> {
  const ref = await getDb().collection('gallery').add({ ...data, createdAt: new Date().toISOString() })
  return { id: ref.id, ...data, createdAt: new Date().toISOString() }
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await getDb().collection('gallery').doc(id).delete()
}

// ─── Fan Card Settings ────────────────────────────────────────────────────────
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

// ─── Site Settings ────────────────────────────────────────────────────────────
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

// ─── New Admin & Payment Collections ──────────────────────────────────────────

// Admin type
export interface Admin {
  id: string
  email: string
  role: 'super-admin' | 'admin' | 'moderator'
  verified: boolean
  createdAt: string
}

// Fan Card type
export interface FanCard {
  id: string
  title: string
  price: number // in cents or USDT
  image: string
  description: string
  antiScreenshot: boolean
  createdAt: string
  updatedAt: string
  updatedBy: string
}

// User type
export interface User {
  id: string
  email: string
  googleId?: string
  whitelisted: boolean
  fanStatus: 'pending' | 'approved' | 'rejected'
  registeredAt: string
  paymentStatus: 'unpaid' | 'pending' | 'confirmed'
}

// Payment type
export interface Payment {
  id: string
  userId?: string      // linked after Google sign-in; absent for pre-auth submissions
  email?: string       // always present - used to whitelist after admin confirms
  name?: string        // fan name for card engraving
  amount: number
  currency: 'USDT' | 'BTC' | 'PayPal' | 'Stripe'
  status: 'pending' | 'confirmed' | 'failed'
  qrCode?: string
  transactionId?: string
  waybill?: boolean 
  createdAt: string
  updatedAt: string
}

// Crypto Wallet type
export interface CryptoWallet {
  id: string
  type: 'BTC' | 'USDT'
  address: string
  verified: boolean
  updatedAt: string
  updatedBy: string
}

// Page Content type
export interface PageContent {
  id: string
  section: string
  content: string
  image?: string
  updatedAt: string
  updatedBy: string
}

// ─── Admin Management ──────────────────────────────────────────────────────────
export async function getAdmins(): Promise<Admin[]> {
  const snap = await getDb().collection('admins').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Admin))
}

export async function getAdmin(email: string): Promise<Admin | null> {
  const normalized = email.toLowerCase().trim()
  // Try lowercase match first
  let snap = await getDb().collection('admins').where('email', '==', normalized).limit(1).get()
  if (snap.docs.length > 0) return { id: snap.docs[0].id, ...snap.docs[0].data() } as Admin
  // Fallback: original case (handles docs stored before normalization)
  snap = await getDb().collection('admins').where('email', '==', email.trim()).limit(1).get()
  return snap.docs.length > 0 ? ({ id: snap.docs[0].id, ...snap.docs[0].data() } as Admin) : null
}

export async function createAdmin(email: string, role: 'super-admin' | 'admin' | 'moderator' = 'admin'): Promise<Admin> {
  const ref = await getDb().collection('admins').add({
    email,
    role,
    verified: true,
    createdAt: new Date().toISOString(),
  })
  return { id: ref.id, email, role, verified: true, createdAt: new Date().toISOString() }
}

export async function updateAdmin(id: string, data: Partial<Admin>): Promise<void> {
  await getDb().collection('admins').doc(id).update(data)
}

export async function deleteAdmin(id: string): Promise<void> {
  await getDb().collection('admins').doc(id).delete()
}

// ─── Fan Card Management ───────────────────────────────────────────────────────
export async function getFanCards(): Promise<FanCard[]> {
  const snap = await getDb().collection('fanCards').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FanCard))
}

export async function getFanCard(id: string): Promise<FanCard | null> {
  const doc = await getDb().collection('fanCards').doc(id).get()
  return doc.exists ? ({ id: doc.id, ...doc.data() } as FanCard) : null
}

export async function createFanCard(data: Omit<FanCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<FanCard> {
  const now = new Date().toISOString()
  const ref = await getDb().collection('fanCards').add({
    ...data,
    createdAt: now,
    updatedAt: now,
  })
  return { id: ref.id, ...data, createdAt: now, updatedAt: now }
}

export async function updateFanCard(id: string, data: Partial<FanCard>): Promise<void> {
  await getDb().collection('fanCards').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export async function deleteFanCard(id: string): Promise<void> {
  await getDb().collection('fanCards').doc(id).delete()
}

// ─── User Management ──────────────────────────────────────────────────────────
export async function getUsers(): Promise<User[]> {
  const snap = await getDb().collection('users').orderBy('registeredAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as User))
}

export async function getUser(id: string): Promise<User | null> {
  const doc = await getDb().collection('users').doc(id).get()
  return doc.exists ? ({ id: doc.id, ...doc.data() } as User) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const snap = await getDb().collection('users').where('email', '==', email).limit(1).get()
  return snap.docs.length > 0 ? ({ id: snap.docs[0].id, ...snap.docs[0].data() } as User) : null
}

export async function createUser(email: string, googleId?: string): Promise<User> {
  const ref = await getDb().collection('users').add({
    email,
    googleId,
    whitelisted: false,
    fanStatus: 'pending',
    registeredAt: new Date().toISOString(),
    paymentStatus: 'unpaid',
  })
  return {
    id: ref.id,
    email,
    googleId,
    whitelisted: false,
    fanStatus: 'pending',
    registeredAt: new Date().toISOString(),
    paymentStatus: 'unpaid',
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
  await getDb().collection('users').doc(id).update(data)
}

export async function whitelistUser(userId: string, admin: string): Promise<void> {
  await getDb().collection('users').doc(userId).update({
    whitelisted: true,
    fanStatus: 'approved',
  })
}

// ─── Payment Management ────────────────────────────────────────────────────────
export async function getPayments(): Promise<Payment[]> {
  const snap = await getDb().collection('payments').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment))
}

export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  const snap = await getDb().collection('payments').where('userId', '==', userId).orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Payment))
}

export async function getPayment(id: string): Promise<Payment | null> {
  const doc = await getDb().collection('payments').doc(id).get()
  return doc.exists ? ({ id: doc.id, ...doc.data() } as Payment) : null
}

export async function createPayment(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
  const now = new Date().toISOString()
  const ref = await getDb().collection('payments').add({
    ...data,
    createdAt: now,
    updatedAt: now,
  })
  return { id: ref.id, ...data, createdAt: now, updatedAt: now }
}

export async function confirmPayment(paymentId: string, transactionId: string): Promise<void> {
  await getDb().collection('payments').doc(paymentId).update({
    status: 'confirmed',
    transactionId,
    updatedAt: new Date().toISOString(),
  })
}

export async function updatePayment(id: string, data: Partial<Payment>): Promise<void> {
  await getDb().collection('payments').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

// ─── Crypto Wallet Management ──────────────────────────────────────────────────
export async function getCryptoWallets(): Promise<CryptoWallet[]> {
  const snap = await getDb().collection('cryptoWallets').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CryptoWallet))
}

export async function getCryptoWallet(type: 'BTC' | 'USDT'): Promise<CryptoWallet | null> {
  const snap = await getDb().collection('cryptoWallets').where('type', '==', type).limit(1).get()
  return snap.docs.length > 0 ? ({ id: snap.docs[0].id, ...snap.docs[0].data() } as CryptoWallet) : null
}

export async function setCryptoWallet(type: 'BTC' | 'USDT', address: string, updatedBy: string): Promise<void> {
  const existing = await getCryptoWallet(type)
  if (existing) {
    await getDb().collection('cryptoWallets').doc(existing.id).update({
      address,
      updatedAt: new Date().toISOString(),
      updatedBy,
    })
  } else {
    await getDb().collection('cryptoWallets').add({
      type,
      address,
      verified: false,
      updatedAt: new Date().toISOString(),
      updatedBy,
    })
  }
}

// ─── Page Content Management ───────────────────────────────────────────────────
export async function getPageContent(section: string): Promise<PageContent | null> {
  const snap = await getDb().collection('pageContent').where('section', '==', section).limit(1).get()
  return snap.docs.length > 0 ? ({ id: snap.docs[0].id, ...snap.docs[0].data() } as PageContent) : null
}

export async function getAllPageContent(): Promise<PageContent[]> {
  const snap = await getDb().collection('pageContent').get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PageContent))
}

export async function updatePageContent(section: string, data: Partial<PageContent>, updatedBy: string): Promise<void> {
  const existing = await getPageContent(section)
  if (existing) {
    await getDb().collection('pageContent').doc(existing.id).update({
      ...data,
      section,
      updatedAt: new Date().toISOString(),
      updatedBy,
    })
  } else {
    await getDb().collection('pageContent').add({
      section,
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy,
    })
  }
}
