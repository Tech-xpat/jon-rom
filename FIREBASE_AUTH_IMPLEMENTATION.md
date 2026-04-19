# Firebase Admin Authentication Implementation Summary

## What's Been Built

### 1. Firebase Authentication (Email/Password)
- **File**: `src/components/admin/AdminAuthProvider.tsx`
- Users login with email and password via Firebase Authentication
- Automatic role verification from Firestore `admins` collection
- Auto sign-out if user is not in admins collection (security)
- User-friendly Firebase error messages (wrong password, user not found, etc.)

### 2. Admin Login Page
- **File**: `src/app/admin/login/page.tsx`
- Clean email/password form (NO email suggestions)
- Password visibility toggle
- Real-time loading and error states
- Auto-redirect to dashboard if already logged in
- All placeholders removed for security/privacy

### 3. Real-Time Firestore Listeners
- **File**: `src/hooks/useFirestoreListener.ts`
- Subscribe to Firestore document changes in real-time
- Auto-unsubscribe on component unmount
- Error handling and loading states
- Generic TypeScript support

### 4. Real-Time Firestore Sync
- **File**: `src/hooks/useFirestoreSync.ts`
- Push changes to Firestore instantly
- Merge or replace document data
- Success and error callbacks
- Loading state for UI feedback

### 5. Fan Card Settings - Real-Time Control
- **File**: `src/app/admin/fan-card/page.tsx`
- Live preview updates as you change settings
- Real-time sync to Firestore on save
- Changes reflect on public pages instantly (no refresh needed)
- Controls:
  - Price (USD)
  - Background gradient or color
  - Accent color
  - Footer text
  - Logo URL
  - Anti-screenshot protection

### 6. Crypto Wallets - Real-Time Control
- **File**: `src/app/admin/wallets/page.tsx`
- Bitcoin (BTC) wallet address
- Tether USDT wallet address
- Real-time Firestore sync
- Addresses appear instantly on user payment pages
- Address length counter
- Info box for important notes

### 7. Rewards System
- **File**: `src/app/admin/rewards/page.tsx`
- Super-admin only access
- Grant rewards by User ID or Email
- Custom reward amounts and descriptions
- Real-time reward history
- Status tracking (pending/completed/failed)

### 8. Admin Role Verification API
- **File**: `src/app/api/admin/check-role/route.ts`
- Verifies admin role from Firestore `admins` collection
- Returns user role and verification status
- Checks authorization before allowing API access

### 9. Firebase Setup Script
- **File**: `scripts/setup-firebase.ts`
- Creates Firestore collections automatically
- Initializes two super-admin accounts
- Sets default settings for fan card, wallets, page control
- Run once: `npx ts-node scripts/setup-firebase.ts`

### 10. Complete Setup Guide
- **File**: `FIREBASE_SETUP.md`
- Step-by-step Firebase configuration
- Database structure documentation
- Security rules examples
- Troubleshooting guide
- API endpoints reference

## Real-Time Architecture

### How Changes Propagate

```
1. Admin Changes Value in Panel
   ↓
2. Clicks "Save Settings"
   ↓
3. useFirestoreSync() uploads to Firestore
   ↓
4. Firestore document updates
   ↓
5. useFirestoreListener() in public pages detects change
   ↓
6. Public pages re-render with new data
   ↓
7. NO PAGE REFRESH NEEDED - INSTANT UPDATES
```

### Example: Change Fan Card Price

Admin Panel:
```typescript
// src/app/admin/fan-card/page.tsx
const handleSave = async () => {
  await sync('fanCard', settings) // Updates Firestore
}
```

Public Pages:
```typescript
// Any public component
const { data: settings } = useFirestoreListener('pageSettings', 'fanCard')
// Settings updates automatically when admin changes price
```

## Firestore Collections

### admins
Stores admin user roles and permissions.

```
admins/
├── empiredigitalsworldwide@gmail.com
│   ├── email: "empiredigitalsworldwide@gmail.com"
│   ├── role: "super-admin"
│   ├── verified: true
│   ├── createdAt: "2026-04-19T..."
│   └── status: "active"
└── empiredigitalsceo@gmail.com
    └── ... (same structure)
```

### pageSettings
Stores all public-facing settings that change in real-time.

```
pageSettings/
├── fanCard
│   ├── price: 5000 (cents)
│   ├── background: "gradient..."
│   ├── accentColor: "#FF0000"
│   ├── logoUrl: "/images/..."
│   ├── footerText: "..."
│   ├── antiScreenshot: true
│   └── updatedAt: "2026-04-19T..."
│
├── wallets
│   ├── btc: "bc1q..."
│   ├── usdt: "0x..."
│   └── updatedAt: "2026-04-19T..."
│
└── pageControl
    ├── maintenanceMode: false
    ├── showFanCard: true
    ├── showWallets: true
    ├── showRewards: true
    └── updatedAt: "2026-04-19T..."
```

## Security Features

### Authentication
- Firebase Email/Password authentication
- No hardcoded admin emails - uses Firestore verification
- Auto sign-out if not in admins collection
- User-friendly error messages

### Authorization
- Admin role verified from Firestore on every login
- API endpoints check admin role from Firestore
- Super-admin only access for sensitive operations (rewards)
- Protected routes with AuthGuard component

### Data Privacy
- No email suggestions in login form
- Password visibility toggle
- Firestore security rules recommended (see FIREBASE_SETUP.md)
- Sensitive operations logged but not exposed to users

## Environment Variables Required

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_ADMIN_TYPE
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_PRIVATE_KEY_ID
FIREBASE_ADMIN_PRIVATE_KEY
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_CLIENT_ID
FIREBASE_ADMIN_AUTH_URI
FIREBASE_ADMIN_TOKEN_URI
```

## Getting Started

1. **Download Firebase Credentials**
   - Firebase Console > Project Settings > Service Accounts > Generate Key
   - Save as `firebase-service-account.json`

2. **Run Setup Script**
   ```bash
   export FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json
   npx ts-node scripts/setup-firebase.ts
   ```

3. **Test Admin Login**
   - Go to `http://localhost:3000/admin/login`
   - Use your admin email and password
   - Change fan card price or wallets
   - See real-time updates!

4. **Deploy**
   - Set environment variables in Vercel
   - Deploy to production
   - Real-time updates work globally

## API Endpoints for Admin

All endpoints require Firebase authentication:

- `GET /api/admin/check-role?email=...` - Verify admin role
- `POST /api/admin/admins` - Create new admin
- `GET /api/admin/admins` - List all admins
- `DELETE /api/admin/admins/{email}` - Remove admin
- `POST /api/admin/rewards` - Create reward
- `GET /api/admin/rewards` - Get reward history
- `PUT /api/admin/settings/fan-card` - Update fan card (legacy)
- `POST /api/admin/wallets` - Update wallets (legacy)

Modern approach uses Firestore listeners and sync hooks instead of API calls for settings.

## Monitoring & Debugging

### Console Logs
Look for these prefixes in browser/server console:
- `[Admin Auth]` - Authentication events
- `[Firestore]` - Listener/sync operations
- `[v0]` - General debug logs

### Firebase Console
Monitor in real-time:
1. Authentication > Users - See login activity
2. Firestore Database > Collections - View/edit data manually
3. Firestore Usage - Track read/write operations

### Common Issues & Solutions

**"Email not found in admins collection"**
- Run setup script: `npx ts-node scripts/setup-firebase.ts`
- Or manually add email to Firestore admins collection

**"Real-time updates not working"**
- Check Firestore rules allow reads from your domain
- Verify useFirestoreListener hook is in component
- Check browser console for listener errors

**"Firebase not initialized"**
- Verify environment variables are set
- Check /src/lib/firebase.ts and firebase-admin.ts
- Restart dev server after adding env vars

## Next: Using Real-Time Settings in Public Pages

To use real-time fan card pricing on public pages:

```typescript
'use client'
import { useFirestoreListener } from '@/hooks/useFirestoreListener'

export function FanCardBuyButton() {
  const { data: settings } = useFirestoreListener('pageSettings', 'fanCard')
  
  return (
    <button>
      Buy Fan Card - ${(settings?.price || 5000) / 100}
    </button>
  )
}
// Price updates automatically when admin changes it!
```

To use wallet addresses for payment:

```typescript
export function PaymentPage() {
  const { data: wallets } = useFirestoreListener('pageSettings', 'wallets')
  
  return (
    <div>
      <p>Bitcoin: {wallets?.btc}</p>
      <p>USDT: {wallets?.usdt}</p>
    </div>
  )
}
// Wallets update instantly when admin changes them!
```

---

**Status**: ✅ Complete and Ready to Deploy

All real-time admin functionality is implemented and operational. Simply run the Firebase setup script and start managing your site in real-time!
