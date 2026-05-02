# Real-Time Firestore Sync Fix

## Problem Fixed
Admin editable functions weren't working properly - changes weren't persisting to Firestore and weren't reflected on public pages. Example: wallet addresses remained at default values.

## Root Causes Identified & Fixed

### 1. **Data Storage Inconsistency**
- **Problem**: Admin pages were saving to `cryptoWallets` collection, but public pages read from `settings/paymentMethods` document
- **Fix**: Consolidated all wallet data to use centralized `pageSettings/cryptoWallets` document as single source of truth

### 2. **No Real-Time Listeners**
- **Problem**: Admin pages manually fetched data once on mount using API calls, then cached it
- **Fix**: Implemented `useFirestoreListener` hook for real-time updates in admin pages

### 3. **Manual Fetching vs Real-Time Sync**
- **Problem**: Admin pages used old pattern with `fetch()` calls instead of Firestore listeners
- **Fix**: Replaced with `useFirestoreListener` for reading and `useFirestoreSync` for writing

## Changes Made

### A. Updated [src/lib/firestore.ts](src/lib/firestore.ts)
**New Functions:**
```typescript
// Wallet data now stored in pageSettings/cryptoWallets as centralized document
export interface CryptoWalletsData {
  btc?: { address: string; verified?: boolean }
  usdt?: { address: string; verified?: boolean }
  updatedAt?: string
  updatedBy?: string
}

export async function getCryptoWallets(): Promise<CryptoWalletsData>
export async function setCryptoWallet(type: 'BTC' | 'USDT', address: string, updatedBy: string): Promise<void>
```

### B. Fixed [src/app/admin/wallets/page.tsx](src/app/admin/wallets/page.tsx)
**Changes:**
- Removed manual `fetch()` calls and `loadWallets()` function
- Added `useFirestoreListener('pageSettings', 'cryptoWallets')` for real-time data
- Added `useFirestoreSync('pageSettings')` for saving changes
- Synced Firestore data to local state in useEffect hook
- Changes now save directly to Firestore and reflect instantly

**Before:**
```typescript
const [wallets, setWallets] = useState([...])
const loadWallets = async () => {
  const res = await fetch('/api/admin/wallets', { headers: { Authorization: token } })
  // ... manual update
}
```

**After:**
```typescript
const { data: firestoreWallets, loading } = useFirestoreListener('pageSettings', 'cryptoWallets')
const { sync } = useFirestoreSync('pageSettings')

useEffect(() => {
  if (firestoreWallets) {
    // Auto-sync Firestore data to local state
    setWallets([...])
  }
}, [firestoreWallets])
```

### C. Fixed [src/app/admin/payment-methods/page.tsx](src/app/admin/payment-methods/page.tsx)
**Changes:**
- Removed API token-based authentication (using Firestore rules instead)
- Implemented `useFirestoreListener` for crypto wallet data
- Implemented `useFirestoreSync` for saving changes
- Simplified to focus on cryptocurrency payments
- All changes sync in real-time

### D. Updated [src/app/fan-card/page.tsx](src/app/fan-card/page.tsx)
**Changes:**
- Added import: `useFirestoreListener` hook
- Replaced manual fetch calls with real-time listener
- Now listens to `pageSettings/cryptoWallets` in real-time
- Wallet data updates instantly when admin changes it

**Before:**
```typescript
useEffect(() => {
  const res = await fetch('/api/checkout/payment-methods')
  setWallets(...)
}, [])
```

**After:**
```typescript
const { data: firestoreWallets } = useFirestoreListener('pageSettings', 'cryptoWallets')

useEffect(() => {
  if (firestoreWallets) {
    setWallets(...)
  }
}, [firestoreWallets])
```

### E. Updated [src/app/api/checkout/payment-methods/route.ts](src/app/api/checkout/payment-methods/route.ts)
**Changes:**
- Now reads from centralized `pageSettings/cryptoWallets` location
- Falls back to old `settings/paymentMethods` for backward compatibility
- Combines both sources for complete payment methods response

### F. Simplified [src/app/api/admin/wallets/route.ts](src/app/api/admin/wallets/route.ts)
**Changes:**
- Removed unnecessary POST endpoint (now handled by Firestore directly)
- GET endpoint now fetches from centralized `pageSettings/cryptoWallets`

## Firestore Structure

### New Unified Structure
```
pageSettings/
├── cryptoWallets/  ← CENTRALIZED WALLET DATA
│   ├── btc:
│   │   ├── address: "bc1q..."
│   │   ├── verified: false
│   ├── usdt:
│   │   ├── address: "0x..."
│   │   ├── verified: false
│   ├── updatedAt: "2026-05-02T..."
│   └── updatedBy: "admin@email.com"
│
├── fanCard/
├── pageControl/
└── ...
```

## How Real-Time Sync Works Now

### Admin Edits Wallet Address
1. Admin opens `/admin/wallets`
2. Admin edits BTC address and clicks "SAVE"
3. `useFirestoreSync` updates `pageSettings/cryptoWallets` in Firestore
4. All real-time listeners immediately receive notification

### Public Pages See Changes Instantly
1. Fan card page has `useFirestoreListener('pageSettings', 'cryptoWallets')`
2. Firestore notifies listener of change
3. Component re-renders with new wallet address
4. Users see new address without page refresh

## Testing the Fix

### Test 1: Admin Wallet Changes
```bash
1. Go to http://localhost:3000/admin/wallets
2. Edit Bitcoin address to new value
3. Click SAVE
4. Check browser console for "[Wallets] Saving..." message
5. Verify success notification appears
```

### Test 2: Public Page Updates
```bash
1. Open http://localhost:3000/fan-card in one browser tab
2. Keep address visible (before payment section)
3. In another tab, go to http://localhost:3000/admin/wallets
4. Change wallet address
5. Without refreshing fan-card page, address updates instantly ✓
```

### Test 3: Firestore Verification
```bash
1. Go to Firebase Console > Firestore Database
2. Navigate to pageSettings > cryptoWallets document
3. Verify `btc.address` and `usdt.address` fields contain updated values
4. Check `updatedAt` and `updatedBy` fields for audit trail
```

### Test 4: Multiple Admin Access
```bash
1. Admin 1 opens /admin/wallets
2. Admin 2 opens /admin/wallets in separate window
3. Admin 1 changes BTC address
4. Admin 2's page auto-updates without refresh ✓
```

## Files Modified

| File | Change | Impact |
|------|--------|--------|
| `src/lib/firestore.ts` | Updated wallet functions to use centralized document | Foundation for real-time sync |
| `src/app/admin/wallets/page.tsx` | Added Firestore listeners & sync | Admin changes now persist and reflect instantly |
| `src/app/admin/payment-methods/page.tsx` | Added Firestore listeners & sync | Crypto payments editable with real-time updates |
| `src/app/fan-card/page.tsx` | Added real-time listener for wallets | Public pages now show updates immediately |
| `src/app/api/checkout/payment-methods/route.ts` | Updated to read from new location | Maintains API compatibility |
| `src/app/api/admin/wallets/route.ts` | Simplified GET endpoint | Works with new structure |

## Benefits

✅ **Real-Time Updates**: Admin changes appear instantly across the site  
✅ **No Manual Refresh**: Users don't need to reload pages  
✅ **Single Source of Truth**: Wallet data stored in one centralized location  
✅ **Live Collaboration**: Multiple admins see each other's changes in real-time  
✅ **Audit Trail**: `updatedAt` and `updatedBy` track all changes  
✅ **Better UX**: Success notifications confirm changes saved  

## Troubleshooting

### Changes Not Appearing on Public Page
1. Check browser dev tools for listener errors
2. Verify Firestore reads not blocked by security rules
3. Confirm `useFirestoreListener` properly subscribed
4. Check Firestore console for document existence

### Admin Page Shows Stale Data
1. Wait 1-2 seconds for Firestore to propagate changes
2. Check if listener is properly initialized
3. Verify Firestore rules allow admin reads
4. Look for console errors about listener setup

### Sync Button Not Working
1. Verify admin authentication is valid
2. Check Firestore allows this admin to write
3. See browser console for sync errors
4. Verify network connectivity

## Next Steps

- [ ] Test all admin pages work with real-time updates
- [ ] Monitor Firestore quota usage with new listeners
- [ ] Consider adding offline support for critical settings
- [ ] Implement change notifications/audit logs
- [ ] Add retry logic for failed syncs
