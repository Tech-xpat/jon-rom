# Firebase Authentication Architecture

Visual diagrams and architecture overview of the complete authentication system.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Jonathan Roumie World                         │
│                    Complete Auth System Architecture                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Browser)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Admin Pages              User Pages             Auth Pages          │
│  ┌──────────────┐        ┌──────────────┐      ┌──────────────┐    │
│  │ /admin       │        │ /dashboard   │      │ /admin/login │    │
│  │ /admin/users │        │ /checkout    │      │ (Google/Email)    │
│  │ /admin/...   │        │ ...          │      │              │    │
│  └──────────────┘        └──────────────┘      └──────────────┘    │
│         │                       │                     │              │
│         └───────────────────────┴─────────────────────┘              │
│                        │                                             │
│              ┌─────────▼─────────┐                                  │
│              │   Auth Providers  │                                  │
│              ├─────────────────────┤                                │
│              │ Google Auth         │                                │
│              │ Email Link Auth     │                                │
│              │ Anonymous Auth      │                                │
│              │ Firebase Storage    │                                │
│              └─────────────────────┘                                │
│                        │                                             │
└────────────────────────┼─────────────────────────────────────────────┘
                         │
                ┌────────▼────────┐
                │  Firebase SDK   │
                │ (Client Library)│
                └────────────────┘
                         │
                ┌────────▼────────┐
                │   OAuth 2.0     │
                │   Email Links   │
                │   Sessions      │
                └────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐     ┌───▼────┐     ┌──▼───┐
    │ Google  │     │Firebase│     │User  │
    │ OAuth   │     │  Auth  │     │Cache │
    └─────────┘     └────────┘     └──────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
┌────────────────────────┼────────────────────────────────────────────┐
│                        │        SERVER LAYER (Node.js)              │
├────────────────────────┼────────────────────────────────────────────┤
│                        │                                             │
│                   API Routes                                        │
│                  ┌──────────────────────────────┐                   │
│                  │ Token Verification          │                   │
│                  │ Bearer Token Check           │                   │
│                  │ Admin Email Verification    │                   │
│                  └──────────────────────────────┘                   │
│                        │                                             │
│    ┌────────────────────┼────────────────────────┐                 │
│    │                    │                        │                 │
│ ┌──▼──────┐      ┌─────▼──────┐      ┌────────▼────┐              │
│ │ Admin   │      │ User       │      │ Payment    │              │
│ │ Routes  │      │ Routes     │      │ Routes     │              │
│ │ POST... │      │ GET...     │      │ POST...    │              │
│ │ DELETE..│      │ PUT...     │      │ webhook... │              │
│ └─────────┘      └────────────┘      └────────────┘              │
│                        │                                             │
│              ┌─────────▼─────────┐                                 │
│              │  Firebase Admin   │                                 │
│              │  SDK              │                                 │
│              │ (Server Library)  │                                 │
│              └─────────────────────┘                               │
│                        │                                             │
└────────────────────────┼─────────────────────────────────────────────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
       ┌────▼───┐   ┌───▼────┐  ┌──▼────┐
       │Firestore   │Auth    │  │Storage│
       │(Database)  │(Auth)  │  │(Files)│
       └──────────┘ └────────┘  └───────┘
            │            │            │
       ┌────▼───┐   ┌───▼────┐  ┌──▼────┐
       │ Users  │   │ Tokens │  │ Images│
       │Payments│   │ Claims │  │ Docs  │
       │ Config │   │ Custom │  │ Videos│
       └────────┘   └────────┘  └───────┘
```

---

## 🔄 Authentication Flows

### 1. Google OAuth Flow (Admin & User)

```
User/Admin
    │
    ├──► Clicks "Sign in with Google"
    │
    ▼
Browser
    │
    ├──► Redirects to Google OAuth Endpoint
    │    with client_id, scopes, redirect_uri
    │
    ▼
Google
    │
    ├──► User logs in to Google (if not already)
    │
    ├──► Shows consent screen
    │
    ├──► User grants permissions
    │
    ▼
Browser
    │
    ├──► Redirects back with authorization code
    │
    ▼
Firebase SDK
    │
    ├──► Exchanges code for ID token & access token
    │
    ▼
Client App
    │
    ├──► Receives user object from Firebase
    │
    ├──► For Admin: Checks if email in AUTHORIZED_EMAILS
    │    └──► If yes: Redirects to /admin
    │    └──► If no: Signs out & shows error
    │
    ├──► For User: Creates/loads user in Firestore
    │    └──► Checks whitelist status
    │    └──► Redirects to /dashboard
    │
    ▼
Firestore
    │
    ├──► Stores/updates user record
    │    {
    │      id: "user-uid",
    │      email: "user@gmail.com",
    │      whitelisted: false,
    │      fanStatus: "pending",
    │      registeredAt: "2026-04-13..."
    │    }
    │
    ▼
User is authenticated ✓
```

### 2. Email Link (Passwordless) Flow (Admin Only)

```
Admin
    │
    ├──► Visits /admin/login
    │
    ├──► Enters email: empiredigitalsceo@gmail.com
    │
    ├──► Clicks "Send Sign-In Link"
    │
    ▼
Client App
    │
    ├──► Calls sendEmailSignInLink('email@example.com')
    │
    ├──► Stores email in localStorage
    │
    ▼
Firebase Auth Service
    │
    ├──► Generates email link with code
    │    Link format:
    │    https://jon-rom.firebaseapp.com/auth/action?
    │      code=XXXXX&
    │      continueUrl=http://localhost:3000/admin/login&
    │      ...
    │
    ├──► Sends email via Firebase email service
    │
    ▼
Admin's Email
    │
    ├──► Receives email with "Sign In" button
    │
    ▼
Admin
    │
    ├──► Clicks link in email
    │
    ▼
Firebase Auth (URL Handler)
    │
    ├──► Detects email link in URL
    │
    ├──► Verifies code is valid
    │
    ├──► Completes sign-in automatically
    │
    ▼
Client App
    │
    ├──► onAuthStateChanged triggers
    │
    ├──► User is authenticated ✓
    │
    ├──► Clears localStorage
    │
    ├──► Redirects to /admin
    │
    ▼
Admin is authenticated ✓
```

### 3. User Whitelisting Flow

```
New User Signs In
    │
    ├──► Created in Firestore with:
    │    {
    │      whitelisted: false,
    │      fanStatus: "pending"
    │    }
    │
    ▼
User Dashboard
    │
    ├──► Checks userAuth.whitelisted
    │
    ├──► Shows: "Awaiting Admin Approval"
    │
    ├──► Cannot access checkout
    │
    ▼
Admin Panel (/admin/users)
    │
    ├──► Admin sees new user in list
    │
    ├──► Clicks "Whitelist" button
    │
    ▼
API Call
    │
    ├──► POST /api/admin/users/whitelist
    │
    ├──► Admin token verified ✓
    │
    ▼
Firestore Update
    │
    ├──► Updates user document:
    │    {
    │      whitelisted: true,
    │      fanStatus: "approved"
    │    }
    │
    ▼
User's App (Next Refresh)
    │
    ├──► Fetches /api/user/status
    │
    ├──► Gets updated whitelist status
    │
    ├──► Shows full dashboard ✓
    │
    ├──► Can now checkout
    │
    ▼
User Access Granted ✓
```

### 4. API Authentication Flow

```
Client App
    │
    ├──► User signs in
    │
    ├──► Firebase provides ID token
    │    {
    │      header: { typ, alg },
    │      payload: {
    │        iss, aud, auth_time, user_id,
    │        email, email_verified, ...
    │      },
    │      signature
    │    }
    │
    ├──► Stores token in memory (Firebase SDK)
    │
    ▼
Making API Call
    │
    ├──► Gets current token
    │    await user.getIdToken()
    │
    ├──► Includes in Authorization header
    │    headers: { Authorization: 'Bearer <token>' }
    │
    ├──► Sends request to server
    │
    ▼
Server (Node.js)
    │
    ├──► Receives request
    │
    ├──► Extracts token from header
    │
    ├──► Calls Firebase Admin SDK
    │    adminAuth.verifyIdToken(token)
    │
    ▼
Firebase Admin
    │
    ├──► Verifies token signature
    │
    ├──► Checks expiry
    │
    ├──► Decodes claims
    │
    ├──► Returns decoded claims with email
    │
    ▼
Server Auth Check
    │
    ├──► Check: email in AUTHORIZED_EMAILS?
    │    ├──► Yes: Continue to handler ✓
    │    └──► No: Return 401 Unauthorized ✗
    │
    ▼
API Handler
    │
    ├──► Execute protected logic
    │
    ├──► Access user data safely
    │
    ├──► Return protected response
    │
    ▼
Client App
    │
    ├──► Receives data
    │
    ├──► Updates UI
    │
    ▼
Success ✓
```

---

## 📊 Data Models

### User Collection
```javascript
users/{userId}
├── email: "fan@gmail.com"           // Email address
├── googleId: "google-uid-123"       // Google provider ID
├── whitelisted: false               // Whitelist status
├── fanStatus: "pending"             // pending | approved | rejected
├── registeredAt: "2026-04-13T..."   // Timestamp
├── paymentStatus: "unpaid"          // unpaid | pending | confirmed
└── metadata: {
    displayName: "John Doe",
    photoURL: "https://...",
    ...
}
```

### Admin Collection
```javascript
admins/{adminId}
├── email: "admin@example.com"
├── verified: true
└── createdAt: "2026-04-13T..."
```

### Payment Collection
```javascript
payments/{paymentId}
├── userId: "user-uid"
├── amount: 9999                     // In cents/satoshis
├── currency: "USDT"                 // USDT | BTC | PayPal | Stripe
├── status: "pending"                // pending | confirmed | failed
├── qrCode: "data:image/png;..."     // QR code image
├── transactionId: "tx123abc"        // Transaction hash
├── createdAt: "2026-04-13T..."
└── updatedAt: "2026-04-13T..."
```

---

## 🔐 Token Structure

### ID Token Payload
```json
{
  "iss": "https://securetoken.google.com/jon-rom",
  "aud": "jon-rom",
  "auth_time": 1681234567,
  "user_id": "user-uid-123",
  "sub": "user-uid-123",
  "iat": 1681234567,
  "exp": 1681238167,
  "email": "user@gmail.com",
  "email_verified": true,
  "firebase": {
    "identities": {
      "google.com": ["google-uid-123"]
    },
    "sign_in_provider": "google.com"
  }
}
```

### Custom Token Claims (Server-side)
```javascript
// Can be added in Firebase Console → Custom Claims
{
  admin: true,
  role: "admin",
  permissions: ["read_users", "write_users"]
}
```

---

## 🗂️ Directory Structure

```
project/
│
├── src/
│   ├── lib/
│   │   ├── firebase.ts                      (100 lines)
│   │   │   ├── initializeApp()
│   │   │   ├── getAuth()
│   │   │   ├── signInWithGoogle()          [Admin]
│   │   │   ├── userSignInWithGoogle()      [User]
│   │   │   ├── sendEmailSignInLink()       [Admin]
│   │   │   ├── completeEmailSignIn()       [Auto]
│   │   │   ├── signInAnonymouslyUser()
│   │   │   ├── userSignOut()
│   │   │   └── onAuthChange()
│   │   │
│   │   ├── firebase-auth-utils.ts           (147 lines)
│   │   │   ├── updateUserProfile()
│   │   │   ├── getUserMetadata()
│   │   │   ├── isUserAuthenticated()
│   │   │   ├── getIdToken()
│   │   │   └── 20+ more utilities
│   │   │
│   │   ├── firebase-admin.ts
│   │   │   ├── initializeApp()
│   │   │   ├── getAuth()          [Admin SDK]
│   │   │   ├── getFirestore()
│   │   │   └── verifyAdminRequest()
│   │   │
│   │   ├── auth-utils.ts
│   │   │   └── Request token verification
│   │   │
│   │   └── firebase-test-utils.ts           (203 lines)
│   │       ├── debugAuthState()
│   │       ├── debugGetToken()
│   │       ├── testGoogleSignIn()
│   │       ├── testApiAuth()
│   │       └── 5+ debug utilities
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminAuthProvider.tsx        (120 lines)
│   │   │       ├── useAdminAuth() hook
│   │   │       ├── Email link detection
│   │   │       └── Token management
│   │   │
│   │   └── user/
│   │       └── UserAuthProvider.tsx         (130 lines)
│   │           ├── useUserAuth() hook
│   │           ├── Whitelist checking
│   │           └── Fan status tracking
│   │
│   └── app/
│       ├── api/
│       │   ├── admin/
│       │   │   ├── auth/email-signin/route.ts
│       │   │   ├── users/route.ts
│       │   │   ├── users/whitelist/route.ts
│       │   │   └── ...
│       │   │
│       │   └── user/
│       │       ├── register/route.ts
│       │       ├── status/route.ts
│       │       └── transactions/route.ts
│       │
│       ├── admin/
│       │   ├── login/page.tsx               (Enhanced)
│       │   ├── users/page.tsx
│       │   ├── payments/page.tsx
│       │   └── ...
│       │
│       ├── dashboard/page.tsx               (User dashboard)
│       ├── checkout/page.tsx                (Payment)
│       └── bigadmin/page.tsx                (/bigadmin redirect)
│
├── .env.local                               (Firebase credentials)
├── .env.example                             (Template)
│
├── README_FIREBASE_AUTH.md                  (Overview)
├── FIREBASE_AUTH_SETUP.md                   (Full guide)
├── FIREBASE_AUTH_QUICK_REFERENCE.md         (Dev reference)
├── FIREBASE_SETUP_CHECKLIST.md              (Step-by-step)
├── FIREBASE_IMPLEMENTATION_SUMMARY.md       (Statistics)
└── FIREBASE_AUTH_ARCHITECTURE.md            (This file)
```

---

## 🔄 Request/Response Examples

### Google Sign-In Request
```javascript
// Client
const user = await userSignInWithGoogle()
// Returns: Firebase User object with email, uid, etc.
```

### Email Link Request
```javascript
// Client - Send link
await sendEmailSignInLink('admin@example.com')

// Server
POST /api/admin/auth/email-signin
{
  "email": "admin@example.com"
}
Response: { success: true, message: "Check your email" }

// Auto-complete (when clicking link)
const user = await completeEmailSignIn(email, emailLink)
```

### Protected API Request
```javascript
// Client
const token = await user.getIdToken()
const res = await fetch('/api/admin/users', {
  headers: { Authorization: `Bearer ${token}` }
})

// Server receives
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Inhxx...

// Server verifies
const decoded = await adminAuth.verifyIdToken(token)
// { email: 'admin@example.com', uid: '...', ... }
```

---

## 🚨 Error Handling

### Client Errors
```javascript
try {
  await userSignInWithGoogle()
} catch (err) {
  // "Popup was closed by user"
  // "Google account email not authorized"
  // "Firebase not initialized"
  console.error(err.message)
}
```

### Server Errors
```typescript
export async function GET(req: Request) {
  try {
    const isAdmin = await verifyAdminRequest(req)
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Token verification failed' }),
      { status: 401 }
    )
  }
}
```

---

## 🎯 Key Design Decisions

| Decision | Reason |
|----------|--------|
| **Google OAuth first** | Most secure, user-friendly, built-in consent |
| **Email link for admins** | Passwordless, no password management needed |
| **Client-side token storage** | Firebase SDK handles secure storage automatically |
| **Bearer token in headers** | Standard REST API pattern, easy to implement |
| **Server-side verification** | Prevents token forgery, ensures security |
| **Firestore for users** | Real-time updates, scales infinitely |
| **Separate admin context** | Different auth rules, cleaner separation |
| **Whitelisting system** | Simple, effective user management |

---

## 📈 Scaling Considerations

### Current Capacity
- ✅ Supports unlimited users
- ✅ Token-based (no session storage)
- ✅ Firebase auto-scales Firestore
- ✅ No database connection pooling needed

### Future Optimizations
- Cache whitelist status in Redis
- Implement token caching
- Add rate limiting for API calls
- Monitor authentication errors
- Set up Firebase Cloud Functions

---

## 🔍 Monitoring & Debugging

### Firebase Console Metrics
- Active Users
- Sign-in Methods
- Failed Sign-ins
- Auth Errors

### Application Logging
```javascript
// Enable debug mode
// In browser console:
debugAuthState()          // Current user
debugGetToken()           // Token info
debugTokenClaims()        // Claims
debugFullAuthInfo()       // Complete info
```

### Error Tracking
```javascript
// Errors automatically logged to:
// - Browser Console
// - Firebase Console → Logs
// - Error tracking service (optional)
```

---

## 📚 Related Documentation

- `README_FIREBASE_AUTH.md` - Overview
- `FIREBASE_AUTH_SETUP.md` - Complete guide
- `FIREBASE_AUTH_QUICK_REFERENCE.md` - Developer guide
- `FIREBASE_SETUP_CHECKLIST.md` - Step-by-step
- `FIREBASE_IMPLEMENTATION_SUMMARY.md` - Statistics

---

**Last Updated:** April 13, 2026
**Version:** 1.0
