# Firebase Setup Checklist

Complete this checklist to fully activate all Firebase authentication features.

---

## ✅ Phase 1: Basic Setup (5 mins)

- [ ] Clone/fork repository
- [ ] Run `npm install` or `pnpm install`
- [ ] Copy `.env.example` to `.env.local`

---

## ✅ Phase 2: Firebase Console Configuration (10 mins)

### 2a. Access Firebase Project

- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Select project: **jon-rom**
- [ ] Navigate to **Project Settings** (gear icon)

### 2b. Verify Client SDK Config

- [ ] Check "Your Apps" section
- [ ] Verify Web app config matches `.env.local`:
  ```
  ✓ apiKey: AIzaSyBmnmTUnj13dY2z_vSugrS_Y9mi5flXTaw
  ✓ authDomain: jon-rom.firebaseapp.com
  ✓ projectId: jon-rom
  ✓ storageBucket: jon-rom.firebasestorage.app
  ✓ messagingSenderId: 599681653469
  ✓ appId: 1:599681653469:web:d4882a4bf0508cc3419934
  ```

### 2c. Enable Authentication Methods

Navigate to **Authentication → Sign-in method**

- [ ] **Google** - Click "Enable" if not already enabled
  - [ ] Add your Google account to OAuth consent screen
  - [ ] Set User type: "External"
  - [ ] App name: "Jonathan Roumie World"
  - [ ] User support email: your-email@example.com
  - [ ] Developer contact: your-email@example.com

- [ ] **Email/Password** - Enable
  - [ ] Scroll down to find "Email link (passwordless sign-in)"
  - [ ] Toggle "Enable"

- [ ] **Anonymous** - Enable (optional, for demo users)

### 2d. Configure Email Action Links

Still in **Authentication → Email Templates**

- [ ] Verify sender email is set
- [ ] (Optional) Customize email templates:
  - [ ] Email Verification
  - [ ] Password Reset
  - [ ] Sign-in with Email Link

---

## ✅ Phase 3: Service Account Configuration (5 mins)

### 3a. Generate Private Key

- [ ] In **Project Settings → Service Accounts**
- [ ] Click "Generate New Private Key"
- [ ] Download JSON file (keep it safe!)

### 3b. Extract Credentials

Open the downloaded JSON file and copy:

```json
{
  "type": "service_account",
  "project_id": "jon-rom",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@jon-rom.iam.gserviceaccount.com",
  "client_id": "...",
  ...
}
```

### 3c. Update .env.local

Add to your `.env.local`:

```env
FIREBASE_ADMIN_PROJECT_ID=jon-rom
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jon-rom.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nCOPY_FULL_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**⚠️ Important:** 
- Replace `xxxxx` with actual values from JSON
- Keep newlines as `\n` (literal text, not actual newlines)
- Never commit `.env.local` to Git
- Delete downloaded JSON file after copying

---

## ✅ Phase 4: Firestore Configuration (5 mins)

### 4a. Create Collections

Navigate to **Firestore Database**

Click "Create Collection" for each:

- [ ] `admins` (document: auto-generated)
- [ ] `users` (document: auto-generated)
- [ ] `payments` (document: auto-generated)
- [ ] `fanCards` (document: auto-generated)
- [ ] `cryptoWallets` (document: auto-generated)
- [ ] `pageContent` (document: auto-generated)

Or let the app auto-create them on first use.

### 4b. Set Security Rules

Go to **Firestore → Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admins to read all collections
    function isAdmin() {
      return request.auth.token.email in ['empiredigitalsceo@gmail.com'];
    }

    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if isAdmin();
    }

    // Admins can manage all users
    match /admins/{document=**} {
      allow read, write: if isAdmin();
    }

    // Admins can manage payments
    match /payments/{document=**} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
    }

    // Admins can manage fan cards
    match /fanCards/{document=**} {
      allow read: if true; // Public read
      allow write: if isAdmin();
    }

    // Admins can manage crypto wallets
    match /cryptoWallets/{document=**} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Admins can manage page content
    match /pageContent/{document=**} {
      allow read: if true; // Public read
      allow write: if isAdmin();
    }
  }
}
```

- [ ] Click "Publish"
- [ ] Confirm changes

---

## ✅ Phase 5: Authorized Domains (5 mins)

Still in **Authentication → Settings**

### 5a. Add Authorized Domains

- [ ] Add `localhost:3000` (for development)
- [ ] Add your production domain (e.g., `jonromworld.com`)
- [ ] Add `localhost:3001` if needed for testing

These allow Firebase to accept sign-in links from these domains.

---

## ✅ Phase 6: Local Testing (10 mins)

### 6a. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

- [ ] Server running at `http://localhost:3000`
- [ ] Check console for any Firebase errors

### 6b. Test Admin Sign-In

- [ ] Visit `http://localhost:3000/admin/login`
- [ ] Try Google Sign-In with `empiredigitalsceo@gmail.com`
  - [ ] Should redirect to `/admin` on success
  - [ ] Check browser console - should see user logged in

- [ ] Try Email Link Sign-In
  - [ ] Enter email: `empiredigitalsceo@gmail.com`
  - [ ] Click "Send Sign-In Link"
  - [ ] Check email for sign-in link
  - [ ] Click link - should sign in and redirect to `/admin`

### 6c. Test User Sign-In

- [ ] Visit `http://localhost:3000/dashboard`
- [ ] Click "Sign in with Google"
  - [ ] Use any Gmail account
  - [ ] Should create user and show "Awaiting Approval"
  - [ ] In another window, sign in to `/admin/users`
  - [ ] Find the user you just created
  - [ ] Click "Whitelist"
  - [ ] Refresh `/dashboard` - should now show approved status

### 6d. Test API Protection

In browser console:

```javascript
// Run this after signing in as admin
await testApiAuth('/api/admin/users')

// Should return 200 with user list
```

- [ ] Response status is 200
- [ ] Data is returned
- [ ] No "Unauthorized" error

---

## ✅ Phase 7: Debug & Troubleshoot (as needed)

### 7a. Check Auth State

In browser console (after signing in):

```javascript
debugAuthState()      // Shows current user
await debugGetToken() // Shows ID token
await debugFullAuthInfo() // Complete info
```

- [ ] Can see current user
- [ ] Can see valid token
- [ ] No null/undefined errors

### 7b. Check Admin Verification

```javascript
// In .env.local, verify:
NEXT_PUBLIC_ADMIN_EMAILS=empiredigitalsceo@gmail.com
```

- [ ] Email matches exactly (case-insensitive)
- [ ] No extra spaces
- [ ] .env.local exists in root

### 7c. Check Token in Network Tab

- [ ] Open DevTools → Network tab
- [ ] Make API request to `/api/user/status`
- [ ] Look for Authorization header
- [ ] Should see `Bearer <token>`

---

## ✅ Phase 8: Production Setup (before deploying)

### 8a. Update Environment

- [ ] Update production domain in Firebase Console
  - [ ] **Authentication → Settings → Authorized Domains**
  - [ ] Add your production domain

- [ ] Update `.env` variables on Vercel
  - [ ] Add all `NEXT_PUBLIC_FIREBASE_*` variables
  - [ ] Add all `FIREBASE_ADMIN_*` variables
  - [ ] Set `NEXT_PUBLIC_BASE_URL` to production domain

### 8b. Security Review

- [ ] Review Firestore Security Rules
  - [ ] Only admins can write data
  - [ ] Users can only read/write own data
  - [ ] Payment data restricted

- [ ] Review authorized domains
  - [ ] Only production domain and custom domains
  - [ ] Remove localhost

- [ ] Review admin emails
  - [ ] Only intended admins listed
  - [ ] No test emails

### 8c. Deploy

- [ ] Push code to GitHub
- [ ] Vercel auto-deploys (or manually trigger)
- [ ] Verify Firebase env vars are set on Vercel
- [ ] Test sign-in on production domain
- [ ] Confirm no console errors

---

## ✅ Phase 9: Post-Launch Maintenance (ongoing)

### 9a. Monitor Authentication

- [ ] Check Firebase Console regularly
  - [ ] Monitor active users
  - [ ] Review authentication errors
  - [ ] Track sign-in methods usage

### 9b. Manage Admin Access

- [ ] Review admin email list monthly
  - [ ] Remove inactive admins
  - [ ] Add new admin emails as needed
  - [ ] Update in `.env` and redeploy

### 9c. User Management

- [ ] Regularly review `/admin/users`
  - [ ] Approve pending users
  - [ ] Monitor for spam/abuse
  - [ ] Remove unauthorized access

### 9d. Security Updates

- [ ] Keep Firebase SDK updated
  - [ ] `npm update firebase`
  - [ ] Review security advisories
  - [ ] Test updates in dev before production

---

## 🔍 Verification Checklist

### Can I...

- [ ] Sign in to `/admin` with Google?
- [ ] Sign in to `/admin` with email link?
- [ ] Sign in to `/dashboard` with Google?
- [ ] See "Awaiting Approval" before whitelisting?
- [ ] Whitelist users in `/admin/users`?
- [ ] See full access after whitelisting?
- [ ] Call protected API endpoints?
- [ ] Update user profile?
- [ ] Sign out from all areas?
- [ ] See auth errors in console (not silent failures)?

---

## 📞 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| "Not authorized" in admin | Check `.env.local` email matches Google account |
| Email link doesn't work | Verify "Email/Password" enabled with "Passwordless" |
| API returns 401 | Check Authorization header format: `Bearer <token>` |
| User stuck in "Pending" | Admin must click "Whitelist" button in `/admin/users` |
| Firebase not initializing | Verify all `NEXT_PUBLIC_FIREBASE_*` vars in `.env.local` |
| Token keeps expiring | Clear browser cookies, try signing in again |

---

## 📚 Documentation

After completing this checklist, refer to:

- **Full Setup:** `FIREBASE_AUTH_SETUP.md`
- **Quick Reference:** `FIREBASE_AUTH_QUICK_REFERENCE.md`
- **Implementation Details:** `FIREBASE_IMPLEMENTATION_SUMMARY.md`

---

## ✨ Next Steps After Setup

1. **Customize Branding**
   - [ ] Update email templates in Firebase Console
   - [ ] Add logo to OAuth consent screen

2. **Add More Features**
   - [ ] Phone number authentication (optional)
   - [ ] Social logins (Facebook, Twitter, etc.)
   - [ ] Two-factor authentication (2FA)

3. **Scale Operations**
   - [ ] Set up Firebase Analytics dashboard
   - [ ] Configure monitoring & alerts
   - [ ] Set up backup & recovery procedures

---

**Last Updated:** April 13, 2026
**Estimated Completion Time:** 30-45 minutes
**Support:** Check documentation or contact empiredigitalsceo@gmail.com
