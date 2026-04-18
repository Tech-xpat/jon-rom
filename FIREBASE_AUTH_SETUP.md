# Firebase Authentication Setup Guide

This document outlines all Firebase authentication features integrated into the Jonathan Roumie World platform.

## Overview

The platform supports multiple authentication methods across different user types:

- **Admin Users** (`/admin`, `/bigadmin`): Email-based passwordless auth + Google OAuth
- **Fan Dashboard Users** (`/dashboard`): Google OAuth with whitelisting
- **Guest Users**: Anonymous authentication (optional)

---

## Authentication Methods

### 1. Google OAuth (Google Sign-In)

**Used For:**
- Admin panel access (email-restricted)
- Fan dashboard access (whitelisting system)

**Setup Steps:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`jon-rom`)
3. Navigate to **Authentication → Sign-in method**
4. Enable **Google**
5. Set OAuth consent screen:
   - User type: External
   - App name: "Jonathan Roumie World"
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com

**Client Implementation:**
- Users click "Sign in with Google"
- Firebase handles OAuth flow automatically
- Admin panel restricts access based on `NEXT_PUBLIC_ADMIN_EMAILS` env var

**Code Examples:**

```typescript
// Admin sign-in
import { signInWithGoogle } from '@/lib/firebase'
const user = await signInWithGoogle()

// Fan sign-in
import { userSignInWithGoogle } from '@/lib/firebase'
const user = await userSignInWithGoogle()
```

---

### 2. Email Link Authentication (Passwordless)

**Used For:**
- Admin-only passwordless sign-in
- Secure email verification

**Setup Steps:**

1. In [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Authentication → Sign-in method**
3. Enable **Email/Password**
4. Scroll down and enable "Email link (passwordless sign-in)"

**Flow:**
1. Admin enters email (`empiredigitalsceo@gmail.com`)
2. Clicks "Send Sign-In Link"
3. Firebase sends email with magic link
4. Admin clicks link → auto-signs in
5. Email stored in `localStorage` for verification

**Code Examples:**

```typescript
// Send sign-in email
import { sendEmailSignInLink } from '@/lib/firebase'
await sendEmailSignInLink('admin@example.com')

// Complete sign-in (automatic via email link)
import { completeEmailSignIn } from '@/lib/firebase'
const user = await completeEmailSignIn(email, emailLink)
```

---

### 3. Anonymous Authentication

**Used For:**
- Guest access (optional feature)
- Demo mode

**Setup Steps:**

1. In [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Authentication → Sign-in method**
3. Enable **Anonymous**

**Code Examples:**

```typescript
import { signInAnonymouslyUser } from '@/lib/firebase'
const user = await signInAnonymouslyUser()
```

---

### 4. Phone Authentication (Available)

**Not currently used but ready to implement**

**Setup Steps:**

1. In [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Authentication → Sign-in method**
3. Enable **Phone**
4. Add your domain to authorized domains

---

## Environment Configuration

### Required Variables

Create `.env.local` in project root with these values:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBmnmTUnj13dY2z_vSugrS_Y9mi5flXTaw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jon-rom.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=jon-rom
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jon-rom.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=599681653469
NEXT_PUBLIC_FIREBASE_APP_ID=1:599681653469:web:d4882a4bf0508cc3419934

# Admin Access
NEXT_PUBLIC_ADMIN_EMAILS=empiredigitalsceo@gmail.com

# Firebase Admin SDK (Server-side)
FIREBASE_ADMIN_PROJECT_ID=jon-rom
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jon-rom.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Getting Credentials

**Firebase Client Config:**
1. Firebase Console → Project Settings
2. Your Apps → Web App
3. Copy config values

**Firebase Admin Credentials:**
1. Firebase Console → Project Settings
2. Service Accounts
3. Click "Generate New Private Key"
4. Copy values (keep private!)

---

## Authentication Utilities

All auth utilities are in `/src/lib/firebase-auth-utils.ts`

### User Profile Management

```typescript
import { 
  updateUserProfile,
  updateUserEmail,
  updateUserPassword 
} from '@/lib/firebase-auth-utils'

// Update profile
await updateUserProfile(user, 'John Doe', 'https://...')

// Update email
await updateUserEmail(user, 'newemail@example.com')

// Update password
await updateUserPassword(user, 'newPassword123')
```

### User Metadata

```typescript
import { getUserMetadata } from '@/lib/firebase-auth-utils'

const metadata = getUserMetadata(user)
// Returns: { uid, email, displayName, photoURL, providers, etc. }
```

### Auth State Helpers

```typescript
import { 
  isUserAuthenticated,
  getUserEmail,
  getAuthProviders,
  hasGoogleAuth
} from '@/lib/firebase-auth-utils'

const isAuth = isUserAuthenticated(user)
const email = getUserEmail(user)
const providers = getAuthProviders(user) // ['google.com', 'password']
const hasGoogle = hasGoogleAuth(user)
```

### ID Token Management

```typescript
import { getIdToken } from '@/lib/firebase-auth-utils'

const token = await getIdToken(user)
const refreshedToken = await getIdToken(user, true)
```

---

## API Route Protection

All admin API routes verify authentication tokens:

```typescript
// /src/lib/auth-utils.ts
import { verifyAdminRequest } from '@/lib/firebase-admin'

export async function POST(req: Request) {
  const isAdmin = await verifyAdminRequest(req)
  if (!isAdmin) return new Response('Unauthorized', { status: 401 })
  
  // Process admin request
}
```

**How it works:**
1. Client gets ID token from Firebase
2. Sends token in `Authorization: Bearer <token>` header
3. Server verifies token with Firebase Admin SDK
4. Checks if email is in `NEXT_PUBLIC_ADMIN_EMAILS`

---

## User Whitelisting System

### Admin Panel
- Navigate to `/admin/users`
- View all registered users
- Click "Whitelist" to approve access
- Whitelisted users can access `/dashboard`
- Non-whitelisted see "Pending Approval"

### In Code

```typescript
import { whitelistUser } from '@/lib/firestore'

await whitelistUser(userId, adminEmail)
```

---

## Security Best Practices

✅ **Do:**
- Never commit `.env.local` to Git
- Use HTTPS in production
- Rotate admin emails if compromised
- Review Firebase Security Rules regularly
- Enable 2FA on Firebase admin accounts

❌ **Don't:**
- Expose Firebase Admin credentials in client code
- Log sensitive auth tokens
- Store passwords in localStorage
- Trust client-side auth checks alone

---

## Firestore Security Rules

Recommended rules for user data protection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Admins can read all user data
    match /users/{document=**} {
      allow read: if isAdmin();
    }
    
    // Admin check function
    function isAdmin() {
      return request.auth.token.email in ['empiredigitalsceo@gmail.com'];
    }
  }
}
```

---

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Admin login: http://localhost:3000/admin/login
# Fan dashboard: http://localhost:3000/dashboard
# Checkout: http://localhost:3000/checkout
```

### Firebase Emulator (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulator
firebase emulators:start

# Use emulator in .env.local
FIREBASE_EMULATOR_HOST=localhost:9099
```

---

## Troubleshooting

### "Not authorized as an admin"
- Verify email in `NEXT_PUBLIC_ADMIN_EMAILS` matches Google account
- Check `.env.local` is loaded
- Clear browser cookies and try again

### "Email link sign-in failed"
- Check email in Firebase Console → Authentication → Users
- Verify email verification is enabled
- Check action code settings match your domain

### Firebase not initialized
- Verify all `NEXT_PUBLIC_FIREBASE_*` env vars are set
- Check `.env.local` exists
- Restart dev server after env changes

### Token verification fails in API
- Check Authorization header format: `Bearer <token>`
- Verify token not expired
- Confirm admin email in `NEXT_PUBLIC_ADMIN_EMAILS`

---

## Additional Resources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Google OAuth Documentation](https://developers.google.com/identity/gsi/web)

---

**Last Updated:** April 2026
**Contact:** empiredigitalsceo@gmail.com
