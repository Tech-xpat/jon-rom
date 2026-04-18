# Firebase Authentication - Quick Reference

## 🚀 Quick Start

### 1. Setup Environment
```bash
cp .env.example .env.local
# Fill in Firebase credentials from Firebase Console
```

### 2. Admin Sign-In
Visit `http://localhost:3000/admin/login` - Two options:
- **Google Sign-In**: For authorized admins only
- **Email Link**: Passwordless magic link to `empiredigitalsceo@gmail.com`

### 3. User Sign-In
Visit `http://localhost:3000/dashboard` - Click "Sign in with Google"

---

## 📦 Core Imports

```typescript
// Main Firebase config
import { auth, db, storage, analytics } from '@/lib/firebase'

// Auth methods
import { 
  signInWithGoogle,           // Admin-only Google auth
  userSignInWithGoogle,       // User Google auth
  sendEmailSignInLink,        // Send passwordless email
  completeEmailSignIn,        // Complete email sign-in
  signInAnonymouslyUser,      // Guest auth
  userSignOut,                // Sign out
  onAuthChange                // Listen to auth changes
} from '@/lib/firebase'

// Auth utilities
import {
  getIdToken,                 // Get current ID token
  getUserMetadata,            // Get user profile info
  isUserAuthenticated,        // Check if authenticated
  updateUserProfile,          // Update display name/photo
  reauthenticateUser          // Re-authenticate for sensitive ops
} from '@/lib/firebase-auth-utils'

// Testing utilities (dev only)
import {
  debugAuthState,
  testGoogleSignIn,
  printTestCommands
} from '@/lib/firebase-test-utils'
```

---

## 🔐 Common Patterns

### Use Admin Auth Hook
```typescript
'use client'
import { useAdminAuth } from '@/components/admin/AdminAuthProvider'

export function AdminPanel() {
  const { user, loading, login, logout, getToken } = useAdminAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not signed in</div>

  return (
    <div>
      <p>Admin: {user.email}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  )
}
```

### Use User Auth Hook
```typescript
'use client'
import { useUserAuth } from '@/components/user/UserAuthProvider'

export function Dashboard() {
  const { user, whitelisted, fanStatus, login, logout } = useUserAuth()

  if (!user) return <button onClick={login}>Sign In with Google</button>
  if (!whitelisted) return <div>Awaiting admin approval...</div>

  return <div>Welcome {user.displayName}</div>
}
```

### Call Protected API Endpoint
```typescript
async function fetchUserData() {
  const { user } = useUserAuth()
  const token = await user?.getIdToken()

  const res = await fetch('/api/user/status', {
    headers: { Authorization: `Bearer ${token}` }
  })

  return res.json()
}
```

### Update User Profile
```typescript
import { updateUserProfile } from '@/lib/firebase-auth-utils'
import { useUserAuth } from '@/components/user/UserAuthProvider'

export function EditProfile() {
  const { user } = useUserAuth()

  const handleUpdate = async () => {
    if (user) {
      await updateUserProfile(user, 'New Name', 'https://...')
    }
  }

  return <button onClick={handleUpdate}>Update</button>
}
```

---

## 🔑 Provider Data

After signing in, `user.providerData` contains:

```typescript
[
  {
    uid: "google-id-123",
    email: "user@gmail.com",
    displayName: "John Doe",
    photoURL: "https://...",
    providerId: "google.com"
  }
]
```

---

## 📋 Auth States for Users

| State | Meaning | Action |
|-------|---------|--------|
| **Not signed in** | User not authenticated | Show sign-in button |
| **Signed in, not whitelisted** | User created but pending approval | Show "awaiting approval" |
| **Signed in, whitelisted** | Full access | Show dashboard |
| **Signed in, rejected** | Admin denied access | Show rejection message |

---

## 🛡️ API Protection Pattern

```typescript
// Route: /src/app/api/user/data/route.ts
import { verifyAdminRequest } from '@/lib/firebase-admin'

export async function GET(req: Request) {
  const isAdmin = await verifyAdminRequest(req)
  
  if (!isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }

  // Admin-only logic here
  return new Response(JSON.stringify({ data: 'admin-only' }))
}
```

---

## 🧪 Testing in Browser Console

```javascript
// Check current user
debugAuthState()

// Get token
await debugGetToken()

// Get token claims
await debugGetTokenClaims()

// Test Google sign-in
await testGoogleSignIn()

// Test sign-out
await testSignOut()

// Test API auth
await testApiAuth('/api/admin/users')

// Full debug info
await debugFullAuthInfo()
```

---

## 🔗 Auth Flow Diagrams

### Admin Sign-In Flow
```
Admin visits /admin/login
  ↓
Choose: Google or Email Link
  ├─ Google: Popup → OAuth → Verify email is admin → Redirect to /admin
  └─ Email: Enter email → Send magic link → Click link → Sign in → Redirect to /admin
```

### User Sign-In Flow
```
User visits /dashboard
  ↓
Click "Sign in with Google"
  ↓
Google OAuth popup
  ↓
Check if user exists in Firestore
  ├─ Yes: Load whitelisted status
  └─ No: Create user with whitelisted=false
  ↓
Check whitelist status
  ├─ whitelisted: true → Show dashboard
  └─ whitelisted: false → Show "awaiting approval"
```

---

## 📊 Database Collections

```
firestore/
├── admins/              # Admin user records
├── users/               # Fan dashboard users
│   ├── {userId}
│   │   ├── email
│   │   ├── whitelisted: boolean
│   │   ├── fanStatus: 'pending' | 'approved' | 'rejected'
│   │   └── registeredAt
├── payments/            # Payment transactions
├── fanCards/            # Fan card products
├── cryptoWallets/       # BTC/USDT wallet addresses
└── pageContent/         # Catalog images & content
```

---

## ⚙️ Environment Variables Required

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Admin Email
NEXT_PUBLIC_ADMIN_EMAILS=empiredigitalsceo@gmail.com

# Server-side Only
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Not authorized as an admin" | Check email in NEXT_PUBLIC_ADMIN_EMAILS |
| Email link not working | Verify email enabled in Firebase Console |
| Token verification fails in API | Check Bearer token format, not expired |
| "Firebase not initialized" | Verify NEXT_PUBLIC_FIREBASE_* vars in .env.local |
| User stuck in "pending" | Admin must whitelist in /admin/users |

---

## 📚 Full Documentation

See `FIREBASE_AUTH_SETUP.md` for comprehensive setup and troubleshooting.

---

**Last Updated:** April 2026
