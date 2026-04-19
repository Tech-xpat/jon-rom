# Firebase Admin Authentication Setup Guide

This guide walks you through setting up real-time Firebase authentication and Firestore database for the admin control panel.

## Overview

The system uses:
- **Firebase Authentication** - Email/password login for admins
- **Firestore Database** - Real-time storage for admin settings, pricing, wallets, and rewards
- **Firestore Listeners** - Real-time page updates when admin changes settings

## Prerequisites

- Firebase project already created
- Firebase Admin SDK credentials downloaded
- Two admin email accounts created in Firebase Authentication

## Step 1: Ensure Your Admin Emails are in Firebase Auth

In Firebase Console:
1. Go to **Authentication** > **Users**
2. Verify your two admin emails exist:
   - `empiredigitalsworldwide@gmail.com`
   - `empiredigitalsceo@gmail.com`
3. If they don't exist, click **Add user** and create them with a password

## Step 2: Download Firebase Admin Credentials

1. Go to **Project Settings** > **Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file as `firebase-service-account.json` in your project root
4. **IMPORTANT**: Add this file to `.gitignore` - it contains sensitive credentials

## Step 3: Run the Setup Script

The setup script initializes Firestore with required collections:

```bash
# Set the path to your service account key
export FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json

# Run the setup
npx ts-node scripts/setup-firebase.ts
```

This creates:
- **admins** collection - User roles and permissions
- **pageSettings/fanCard** - Fan card pricing and design
- **pageSettings/wallets** - Crypto wallet addresses
- **pageSettings/pageControl** - Feature flags and maintenance mode

## Step 4: Environment Variables (Already Set)

Your Firebase config is already in `/src/lib/firebase.ts` and `/src/lib/firebase-admin.ts`.
Make sure these environment variables are set in your Vercel project:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_ADMIN_TYPE`
- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_PRIVATE_KEY_ID`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_CLIENT_ID`
- `FIREBASE_ADMIN_AUTH_URI`
- `FIREBASE_ADMIN_TOKEN_URI`

## Step 5: Test the Admin Login

1. Go to `http://localhost:3000/admin/login`
2. Enter your admin email and password
3. You should be redirected to the admin dashboard
4. Try changing the fan card price or wallet address - changes appear in real-time!

## How Real-Time Updates Work

### From Admin Panel:
```
Admin changes price → useFirestoreSync() → Firestore update
```

### To Public Pages:
```
Firestore change → useFirestoreListener() → Page updates in real-time (no refresh needed)
```

### Example: Update Fan Card Price

In admin panel:
1. Change the price from $50 to $100
2. Click "Save Settings"
3. The change syncs to Firestore instantly
4. Public pages listening to `pageSettings/fanCard` update automatically

## Firestore Database Structure

```
firestore
├── admins/
│   ├── empiredigitalsworldwide@gmail.com
│   │   ├── email: "empiredigitalsworldwide@gmail.com"
│   │   ├── role: "super-admin"
│   │   ├── verified: true
│   │   ├── createdAt: "2026-04-19T..."
│   │   └── status: "active"
│   └── empiredigitalsceo@gmail.com
│       └── ... (same structure)
│
├── pageSettings/
│   ├── fanCard
│   │   ├── price: 5000 (in cents)
│   │   ├── background: "linear-gradient(...)"
│   │   ├── accentColor: "#FF0000"
│   │   ├── logoUrl: "/images/jvcd-avatar.jpg"
│   │   ├── footerText: "..."
│   │   ├── antiScreenshot: true
│   │   └── updatedAt: "2026-04-19T..."
│   │
│   ├── wallets
│   │   ├── btc: "bc1q..."
│   │   ├── usdt: "0x..."
│   │   └── updatedAt: "2026-04-19T..."
│   │
│   └── pageControl
│       ├── maintenanceMode: false
│       ├── showFanCard: true
│       ├── showWallets: true
│       ├── showRewards: true
│       └── updatedAt: "2026-04-19T..."
│
└── rewards/
    └── (created when rewards are issued)
```

## Adding More Admins

To add a new admin user:

1. Create the user in Firebase Authentication (Email & Password)
2. Add them to Firestore:

```typescript
// In your admin panel or manual setup
await db.collection('admins').doc('newemail@example.com').set({
  email: 'newemail@example.com',
  role: 'admin', // or 'super-admin'
  verified: true,
  createdAt: new Date().toISOString(),
  status: 'active'
})
```

## Security Rules

Configure these Firestore Security Rules to protect your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admins collection - only super-admins can read/write
    match /admins/{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    // Page settings - admins can read/write, public can read
    match /pageSettings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Troubleshooting

### "Firebase not initialized"
- Check environment variables are set correctly
- Verify Firebase config is loaded in `/src/lib/firebase.ts`

### "Email not found in admins collection"
- Run the setup script: `npx ts-node scripts/setup-firebase.ts`
- Manually add the email to Firestore `admins` collection

### "Authentication failed"
- Verify the email exists in Firebase Authentication
- Check password is correct
- Look at browser console for detailed Firebase errors

### Real-time updates not working
- Check browser console for listener errors
- Verify Firestore rules allow reads from your domain
- Confirm `useFirestoreListener` hook is called in the component

## API Endpoints

All admin API endpoints verify the user is authenticated and authorized:

- `GET /api/admin/check-role?email=...` - Verify admin role
- `PUT /api/admin/settings/fan-card` - Update fan card settings
- `POST /api/admin/wallets` - Update wallet addresses
- `POST /api/admin/rewards` - Create rewards
- `GET /api/admin/admins` - List all admins
- `POST /api/admin/admins` - Add admin
- `DELETE /api/admin/admins/{id}` - Remove admin

## Next Steps

1. ✅ Set up Firebase credentials
2. ✅ Run setup script to initialize Firestore
3. ✅ Test admin login
4. ✅ Change fan card price and wallets in real-time
5. Go to public pages and verify they use real-time listeners
6. Set up proper Firestore security rules (see above)
7. Monitor Firestore usage in Firebase Console
