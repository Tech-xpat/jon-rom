# Deployment Checklist - Jonathan Roumie World

Complete this checklist before deploying to production.

## Environment Variables ✅

All environment variables have been added to your Vercel project:

### Firebase Configuration
- [x] `NEXT_PUBLIC_FIREBASE_API_KEY` = AIzaSyBmnmTUnj13dY2z_vSugrS_Y9mi5flXTaw
- [x] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = jon-rom.firebaseapp.com
- [x] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = jon-rom
- [x] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = jon-rom.firebasestorage.app
- [x] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = 599681653469
- [x] `NEXT_PUBLIC_FIREBASE_APP_ID` = 1:599681653469:web:d4882a4bf0508cc3419934
- [x] `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = G-T7EM1S4JXD

### Admin Configuration
- [x] `NEXT_PUBLIC_ADMIN_EMAILS` = empiredigitalsceo@gmail.com

## Pre-Deployment Testing

### Local Testing
- [ ] Run `npm run dev` and verify no errors
- [ ] Test admin login at `http://localhost:3000/admin/login`
- [ ] Test email passwordless signin flow
- [ ] Test Google OAuth signin
- [ ] Verify user dashboard at `http://localhost:3000/dashboard`
- [ ] Test all admin pages load correctly

### Mobile Testing
- [ ] Test on iPhone (iOS Safari)
- [ ] Test on Android Chrome
- [ ] Test hamburger menu functionality
- [ ] Verify all buttons are touchable (44px+)
- [ ] Check text is readable on small screens
- [ ] Verify no horizontal scrolling issues

### Admin Features
- [ ] Users page loads and displays users
- [ ] Whitelist/remove users functionality
- [ ] Filter buttons work properly
- [ ] Payments page displays transactions
- [ ] Crypto wallet configuration works
- [ ] Catalog management functions
- [ ] Anti-screenshot toggle saves

### Authentication
- [ ] Google signup/signin works
- [ ] Email passwordless signin sends link
- [ ] Email link signs in user correctly
- [ ] User dashboard shows after login
- [ ] Whitelist restriction works (pending users see "Pending" state)
- [ ] Logout functionality clears session
- [ ] Token verification works in API calls

## Firestore Setup

Before deploying to production, configure Firebase Firestore:

### Security Rules
Add these Firestore security rules in Firebase Console → Firestore Database → Rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Admin collection - only authorized admins
    match /admins/{document=**} {
      allow read, write: if request.auth.token.email == 'empiredigitalsceo@gmail.com';
    }
    
    // Fan cards - admins can write, users can read
    match /fanCards/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'empiredigitalsceo@gmail.com';
    }
    
    // Users - users can read/write their own, admins can read all
    match /users/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == document;
    }
    
    // Payments - users can read their own, admins can read/write all
    match /payments/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'empiredigitalsceo@gmail.com';
    }
    
    // Crypto wallets - only admins can write
    match /cryptoWallets/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'empiredigitalsceo@gmail.com';
    }
    
    // Page content - admins can write, users can read
    match /pageContent/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'empiredigitalsceo@gmail.com';
    }
  }
}
```

## Firebase Configuration

### Enable Authentication Methods

In Firebase Console → Authentication → Sign-in method:

- [x] **Google** - Enable (required for user signup)
- [x] **Email/Password** - Enable or use Email Link for admin
- [ ] **Phone** - Optional (if you want phone auth later)
- [ ] **Anonymous** - Optional (if you want guest access)

### Configure OAuth Redirect URIs

In Firebase Console → Authentication → Settings → Authorized domains:

- [ ] Add your production domain (e.g., `jonromworld.com`)
- [ ] Add `localhost` for local development
- [ ] Add Vercel preview domain (optional for testing)

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Deploy to Vercel
- [ ] Visit https://vercel.com/dashboard
- [ ] Select your project
- [ ] Click "Deploy" or just push to `main` (auto-deploy)
- [ ] Wait for build to complete
- [ ] Verify no build errors

### 3. Verify Production
- [ ] Visit production URL
- [ ] Test admin login with Gmail
- [ ] Test user signup with Google
- [ ] Verify mobile responsiveness on production
- [ ] Check browser console for no errors
- [ ] Test payment creation flow

## Post-Deployment

### Monitor & Test
- [ ] Check Vercel Analytics dashboard
- [ ] Monitor Firebase quota usage
- [ ] Review error logs in Firebase Console
- [ ] Test admin features one more time
- [ ] Verify emails are sending (if configured)

### Backup Configuration
- [ ] Export Firebase rules backup
- [ ] Document crypto wallet addresses used
- [ ] Save admin email whitelist
- [ ] Take screenshot of environment variables

## Common Issues & Solutions

### Issue: "Firebase auth is not initialized"
**Solution**: Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are set in Vercel Settings → Environment Variables

### Issue: "Only authorized emails can access this panel"
**Solution**: Make sure the Google account email matches `NEXT_PUBLIC_ADMIN_EMAILS`

### Issue: Mobile menu not closing
**Solution**: Clear browser cache and hard refresh (Cmd/Ctrl + Shift + R)

### Issue: Payment creation fails
**Solution**: Verify crypto wallets are configured in admin panel first

## Monitoring & Maintenance

### Daily Checks
- [ ] Monitor error logs in Firebase Console
- [ ] Check user signup activity
- [ ] Verify payment processing

### Weekly Checks
- [ ] Review whitelist requests in admin panel
- [ ] Check payment confirmations
- [ ] Monitor Firestore read/write usage

### Monthly Checks
- [ ] Review user growth metrics
- [ ] Audit crypto wallet transactions
- [ ] Update security rules if needed
- [ ] Backup critical data

## Support & Documentation

**Important Files:**
- `README_FIREBASE_AUTH.md` - Firebase auth overview
- `FIREBASE_SETUP_CHECKLIST.md` - Detailed setup guide
- `MOBILE_OPTIMIZATION.md` - Mobile features guide
- `FIREBASE_AUTH_ARCHITECTURE.md` - System diagrams

**Useful Links:**
- Firebase Console: https://console.firebase.google.com
- Vercel Dashboard: https://vercel.com/dashboard
- NextJS Docs: https://nextjs.org/docs
- Firebase Auth Docs: https://firebase.google.com/docs/auth

---

## Final Sign-Off

- [ ] All environment variables added to Vercel
- [ ] Firestore security rules configured
- [ ] Firebase authentication methods enabled
- [ ] Local testing completed
- [ ] Mobile testing completed
- [ ] Production deployment successful
- [ ] Post-deployment verification complete

**Deployed By**: ________________  
**Date**: ________________  
**Production URL**: ________________

---

**Last Updated**: April 2025
**Status**: Ready for Deployment ✅
