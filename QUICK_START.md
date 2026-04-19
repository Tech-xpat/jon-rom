# Quick Start Guide - Firebase Admin System

Get your real-time admin panel live in 5 minutes!

## ⚡ 5-Step Setup

### Step 1: Get Firebase Credentials (2 min)
1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file as `firebase-service-account.json` in project root
4. Add to `.gitignore`: `echo "firebase-service-account.json" >> .gitignore`

### Step 2: Run Setup Script (1 min)
```bash
export FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json
npx ts-node scripts/setup-firebase.ts
```

✅ Creates Firestore collections automatically

### Step 3: Set Environment Variables in Vercel (1 min)
Copy your Firebase config to Vercel project settings under "Environment Variables":

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

### Step 4: Test Locally (1 min)
```bash
npm run dev
# Open http://localhost:3000/admin/login
# Login with: empiredigitalsworldwide@gmail.com or empiredigitalsceo@gmail.com
```

### Step 5: Deploy & Test (optional)
```bash
git push origin main
# Vercel auto-deploys
# Visit production URL + /admin/login
```

## 🔐 Admin Access

**Pre-configured Emails**:
- `empiredigitalsworldwide@gmail.com`
- `empiredigitalsceo@gmail.com`

Make sure these exist in Firebase Authentication with passwords set!

**Password**: Set in Firebase Authentication

## 🎮 Admin Features

| Feature | URL | Real-Time? |
|---------|-----|-----------|
| Dashboard | `/admin` | - |
| Admin Management | `/admin/admins` | ✅ Yes |
| Fan Card Control | `/admin/fan-card` | ✅ Yes |
| Wallet Addresses | `/admin/wallets` | ✅ Yes |
| Rewards System | `/admin/rewards` | ✅ Yes |
| Settings | `/admin/settings` | - |

## ⚡ Real-Time Updates

When you change data in the admin panel:
1. Click "Save Settings"
2. Data syncs to Firestore instantly
3. Public pages update automatically
4. NO page refresh needed!

**Example**: Change fan card price → Instantly updates on public pages

## 🚀 Local Development

```bash
# Development server
npm run dev

# Visit admin login
open http://localhost:3000/admin/login

# Test real-time updates:
# 1. Change fan card price in /admin/fan-card
# 2. Click Save
# 3. Watch live preview update
# 4. Check Firestore Console - data is there!
```

## 📚 Documentation

- **Setup Details**: `FIREBASE_SETUP.md`
- **Implementation**: `FIREBASE_AUTH_IMPLEMENTATION.md`
- **Public Page Integration**: `PUBLIC_PAGE_INTEGRATION.md`
- **Complete Summary**: `IMPLEMENTATION_COMPLETE.md`

## 🔒 Security

✅ Email/password via Firebase Authentication  
✅ Firestore role verification  
✅ Auto sign-out for unauthorized users  
✅ No email suggestions in login form  
✅ User-friendly error messages

## 📊 Admin Features Details

### Fan Card Control
- Change price in real-time
- Customize background gradient
- Pick accent color
- Edit footer text
- Set logo URL
- Toggle anti-screenshot protection
- Live preview

### Wallet Management
- Bitcoin (BTC) address
- Tether (USDT) address
- Instant sync to Firestore
- Users see addresses immediately

### Rewards System
- Grant rewards by User ID or Email
- Custom amounts
- Status tracking
- Real-time history

## 📱 Public Page Integration

Use real-time data in your pages:

```typescript
'use client'
import { useFirestoreListener } from '@/hooks/useFirestoreListener'

export function FanCardPrice() {
  const { data: settings } = useFirestoreListener('pageSettings', 'fanCard')
  
  return (
    <button>
      Buy Fan Card - ${(settings?.price || 5000) / 100}
    </button>
  )
}

// Price updates automatically when admin changes it!
```

See `PUBLIC_PAGE_INTEGRATION.md` for more examples.

## 🧪 Testing Checklist

- [ ] Firebase credentials downloaded
- [ ] Setup script ran successfully
- [ ] Environment variables set in Vercel
- [ ] Admin login works locally
- [ ] Can change fan card price
- [ ] Live preview updates
- [ ] Firestore has the data
- [ ] Ready to deploy!

## 🆘 Troubleshooting

**"Firebase not initialized"**
- Check env variables are set correctly in Vercel

**"Email not found in admins collection"**
- Run setup script: `npx ts-node scripts/setup-firebase.ts`

**"Can't login"**
- Verify email exists in Firebase Authentication
- Check password is correct
- Check Firestore `admins` collection has the email

**"Real-time updates not working"**
- Check browser console for listener errors
- Verify Firestore collection names match
- Check Firestore security rules allow reads

## ⏱️ Timeline

| Task | Time |
|------|------|
| Download credentials | 2 min |
| Run setup script | 1 min |
| Set env vars | 1 min |
| Test locally | 1 min |
| Deploy | optional |
| **Total** | **~5 min** |

## 💡 Pro Tips

1. **Test Real-Time**
   - Change fan card price
   - Click Save
   - Watch live preview update instantly
   - Check Firestore Console

2. **Monitor Activity**
   - Go to Firebase Console > Firestore
   - Watch collections update in real-time
   - Monitor read/write operations

3. **Debug Logs**
   - Look for `[Firestore]` in browser console
   - Look for `[Admin Auth]` for auth events
   - Look for `[v0]` for general logs

4. **Add More Admins**
   - Create user in Firebase Authentication
   - Add to Firestore `admins` collection with role
   - They can login immediately

## 🎯 Next Steps

1. ✅ Download Firebase credentials
2. ✅ Run setup script
3. ✅ Set environment variables
4. ✅ Test locally
5. ✅ Deploy to Vercel
6. ✅ Integrate into public pages (see `PUBLIC_PAGE_INTEGRATION.md`)
7. ✅ Set Firestore security rules (see `FIREBASE_SETUP.md`)

## 📋 Firestore Collections

```
firestore/
├── admins/
│   ├── empiredigitalsworldwide@gmail.com
│   │   ├── role: "super-admin"
│   │   ├── verified: true
│   │   └── ...
│   └── empiredigitalsceo@gmail.com
│       └── ...
│
└── pageSettings/
    ├── fanCard (price, design, etc.)
    ├── wallets (BTC, USDT addresses)
    └── pageControl (feature toggles)
```

## 🚀 You're Ready!

Everything is set up for real-time admin control.

**Status**: ✅ READY TO USE

```
Admin Changes Price → Firestore Updates → Public Pages Refresh Instantly
```

**Get started**: Download credentials and run the setup script!

---

Questions? Check the documentation files or browser console for errors!
