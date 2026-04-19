#!/usr/bin/env tsx

/**
 * Initialize Super Admin Passwords Script
 *
 * This script sets the initial password "Bigadmin222" for the two super-admin accounts:
 * - empiredigitalsworldwide@gmail.com
 * - empiredigitalsceo@gmail.com
 *
 * It creates/updates Firebase Auth accounts and Firestore admin records.
 *
 * Usage: npx tsx scripts/initialize-admin-passwords.ts
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Load service account
const serviceAccount = require('../firebase-service-account.json')

// Super admin configuration
const SUPER_ADMINS = [
  {
    email: 'empiredigitalsworldwide@gmail.com',
    password: 'Bigadmin222',
    role: 'super-admin'
  },
  {
    email: 'empiredigitalsceo@gmail.com',
    password: 'Bigadmin222',
    role: 'super-admin'
  }
]

// Initialize Firebase Admin
function initFirebaseAdmin() {
  if (getApps().length > 0) return getApps()[0]

  try {
    return initializeApp({
      credential: cert(serviceAccount)
    })
  } catch (error: any) {
    throw new Error(`Firebase Admin initialization failed: ${error.message}`)
  }
}

async function initializeSuperAdmin(adminAuth: any, db: any, admin: typeof SUPER_ADMINS[0]) {
  try {
    console.log(`Initializing super admin: ${admin.email}`)

    // Check if user already exists
    let user
    try {
      user = await adminAuth.getUserByEmail(admin.email)
      console.log(`  User already exists, updating password...`)
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        console.log(`  Creating new user...`)
        user = await adminAuth.createUser({
          email: admin.email,
          password: admin.password,
          emailVerified: true
        })
      } else {
        throw error
      }
    }

    // Set/update password
    await adminAuth.updateUser(user.uid, {
      password: admin.password
    })

    // Create/update Firestore admin record
    await db.collection('admins').doc(admin.email).set({
      email: admin.email,
      role: admin.role,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true })

    console.log(`  ✓ Super admin ${admin.email} initialized successfully`)

  } catch (error: any) {
    console.error(`  ✗ Failed to initialize ${admin.email}:`, error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Initializing Super Admin Passwords...\n')

  try {
    // Initialize Firebase Admin
    const app = initFirebaseAdmin()
    const adminAuth = getAuth(app)
    const db = getFirestore(app)

    // Initialize each super admin
    for (const admin of SUPER_ADMINS) {
      await initializeSuperAdmin(adminAuth, db, admin)
    }

    console.log('\n✅ All super admin accounts initialized successfully!')
    console.log('\nSuper Admin Credentials:')
    SUPER_ADMINS.forEach(admin => {
      console.log(`  ${admin.email} / ${admin.password}`)
    })

  } catch (error: any) {
    console.error('\n❌ Initialization failed:', error.message)
    process.exit(1)
  }
}

// Run the script
main().catch(console.error)