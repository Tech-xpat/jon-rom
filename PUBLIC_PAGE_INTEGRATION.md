# Integrating Real-Time Admin Settings into Public Pages

This guide shows how to use the admin panel settings in your public-facing pages with real-time updates.

## Quick Start Examples

### Display Fan Card Price

```typescript
'use client'

import { useFirestoreListener } from '@/hooks/useFirestoreListener'

export function FanCardSection() {
  const { data: settings, loading } = useFirestoreListener('pageSettings', 'fanCard')
  
  if (loading) return <div>Loading price...</div>
  
  const price = settings?.price ? (settings.price / 100).toFixed(2) : '50.00'
  
  return (
    <div className="fan-card">
      <h2>Official Fan Card</h2>
      <p className="price">${price}</p>
      <button>Buy Now</button>
    </div>
  )
}

// When admin changes price in /admin/fan-card and saves,
// this component automatically updates with the new price!
```

### Display Crypto Wallets for Payment

```typescript
'use client'

import { useFirestoreListener } from '@/hooks/useFirestoreListener'

export function CryptoPaymentOptions() {
  const { data: wallets, loading, error } = useFirestoreListener('pageSettings', 'wallets')
  
  if (loading) return <div>Loading payment options...</div>
  if (error) return <div>Error loading wallets</div>
  
  return (
    <div className="payment-methods">
      {wallets?.btc && (
        <div className="wallet">
          <h3>Bitcoin</h3>
          <code>{wallets.btc}</code>
          <button>Copy Address</button>
        </div>
      )}
      
      {wallets?.usdt && (
        <div className="wallet">
          <h3>USDT</h3>
          <code>{wallets.usdt}</code>
          <button>Copy Address</button>
        </div>
      )}
    </div>
  )
}

// Admin updates wallets in /admin/wallets
// Customers see new addresses instantly!
```

### Conditional Content Based on Page Control

```typescript
'use client'

import { useFirestoreListener } from '@/hooks/useFirestoreListener'

export function MainContent() {
  const { data: pageControl } = useFirestoreListener('pageSettings', 'pageControl')
  
  // Show maintenance message if admin enables it
  if (pageControl?.maintenanceMode) {
    return (
      <div className="maintenance-banner">
        <h1>Under Maintenance</h1>
        <p>We'll be back online soon!</p>
      </div>
    )
  }
  
  return (
    <div>
      {pageControl?.showFanCard && <FanCardSection />}
      {pageControl?.showWallets && <CryptoPaymentOptions />}
      {pageControl?.showRewards && <RewardsBoard />}
    </div>
  )
}

// Admin toggles features in admin panel
// Users see features appear/disappear instantly!
```

### Real-Time Fan Card Preview

```typescript
'use client'

import { useFirestoreListener } from '@/hooks/useFirestoreListener'

export function FanCardDisplay() {
  const { data: settings } = useFirestoreListener('pageSettings', 'fanCard')
  
  if (!settings) return null
  
  return (
    <div
      className="fan-card-container"
      style={{ background: settings.background }}
    >
      <div className="fan-card-header">
        <div
          className="accent-line"
          style={{ background: settings.accentColor }}
        />
      </div>
      
      <div className="fan-card-content">
        <h1>JONATHAN ROUMIE</h1>
        <p className="price">${(settings.price / 100).toFixed(2)}</p>
        {settings.logoUrl && (
          <img src={settings.logoUrl} alt="Logo" className="logo" />
        )}
      </div>
      
      <div className="fan-card-footer">
        <p>{settings.footerText}</p>
      </div>
      
      {settings.antiScreenshot && (
        <div className="anti-screenshot-protection" />
      )}
    </div>
  )
}

// Admin changes background, color, price, etc. in /admin/fan-card
// Card updates in real-time across all pages!
```

## The useFirestoreListener Hook

### API Reference

```typescript
const { data, loading, error } = useFirestoreListener<T>(
  collectionPath: string,
  docId: string
)
```

**Parameters:**
- `collectionPath`: Firestore collection (e.g., `'pageSettings'`)
- `docId`: Document ID (e.g., `'fanCard'`)

**Returns:**
- `data: T | null` - The document data, typed as T
- `loading: boolean` - True while fetching initial data
- `error: string | null` - Error message if something fails

**Features:**
- Auto-subscribes on component mount
- Auto-unsubscribes on component unmount
- Real-time updates when document changes
- Type-safe with TypeScript generics
- Error handling included
- Console logging for debugging

### Usage Patterns

**With TypeScript types:**
```typescript
interface FanCardSettings {
  price: number
  background: string
  accentColor: string
  logoUrl: string
  footerText: string
  antiScreenshot: boolean
}

const { data: settings } = useFirestoreListener<FanCardSettings>(
  'pageSettings',
  'fanCard'
)
```

**With null coalescing:**
```typescript
const price = settings?.price ?? 5000
const walletAddress = wallets?.btc ?? ''
```

**With fallback UI:**
```typescript
if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!data) return <div>No data available</div>

return <YourComponent data={data} />
```

## Real-Time Firestore Database Schema

### pageSettings/fanCard

```json
{
  "price": 5000,
  "background": "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
  "accentColor": "#FF0000",
  "logoUrl": "/images/jvcd-avatar.jpg",
  "footerText": "OFFICIAL JONATHAN ROUMIE WORLD FAN CARD",
  "antiScreenshot": true,
  "updatedAt": "2026-04-19T14:30:00Z"
}
```

### pageSettings/wallets

```json
{
  "btc": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "usdt": "0x742d35Cc6634C0532925a3b844Bc9e7595f12345",
  "updatedAt": "2026-04-19T14:30:00Z"
}
```

### pageSettings/pageControl

```json
{
  "maintenanceMode": false,
  "showFanCard": true,
  "showWallets": true,
  "showRewards": true,
  "updatedAt": "2026-04-19T14:30:00Z"
}
```

## Performance Considerations

### Firestore Reads

Each component that uses `useFirestoreListener` counts as:
- **1 read** on initial mount (initial document load)
- **0 reads** for real-time updates (listeners use streaming)

To optimize:
- Don't create listeners in every component
- Create at top-level and pass data down
- Use React Context for shared settings

Example:

```typescript
// ❌ INEFFICIENT - Multiple listeners
function Page() {
  return (
    <>
      <Section1 /> {/* Creates listener */}
      <Section2 /> {/* Creates listener */}
      <Section3 /> {/* Creates listener */}
    </>
  )
}

// ✅ EFFICIENT - Single listener
function Page() {
  const { data: settings } = useFirestoreListener('pageSettings', 'fanCard')
  
  return (
    <>
      <Section1 settings={settings} />
      <Section2 settings={settings} />
      <Section3 settings={settings} />
    </>
  )
}
```

## Handling Loading States

Always handle loading gracefully:

```typescript
export function Component() {
  const { data, loading, error } = useFirestoreListener('pageSettings', 'fanCard')
  
  // Loading - show skeleton or placeholder
  if (loading) {
    return (
      <div className="skeleton-loader">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2 mt-2" />
      </div>
    )
  }
  
  // Error - show error message
  if (error) {
    return (
      <div className="error-banner">
        ⚠️ {error}
      </div>
    )
  }
  
  // No data - show empty state
  if (!data) {
    return <div>No settings configured</div>
  }
  
  // Success - show content
  return <YourComponent data={data} />
}
```

## Advanced Examples

### Dynamic Pricing with Stock Quantity

```typescript
'use client'

interface FanCardSettings {
  price: number
  stockRemaining: number
  maxPerUser: number
  salesClosed: boolean
}

export function FanCardStore() {
  const { data: settings } = useFirestoreListener<FanCardSettings>(
    'pageSettings',
    'fanCard'
  )
  
  if (!settings) return null
  
  const soldOut = settings.stockRemaining <= 0
  const priceUSD = (settings.price / 100).toFixed(2)
  
  return (
    <div>
      {settings.salesClosed && (
        <div className="warning">Sales are closed</div>
      )}
      
      <p className="price">${priceUSD}</p>
      <p className="stock">{settings.stockRemaining} left in stock</p>
      
      <button disabled={soldOut || settings.salesClosed}>
        {soldOut ? 'Sold Out' : `Buy Now`}
      </button>
    </div>
  )
}

// Admin updates price, stock, or closes sales
// Changes appear instantly for all users!
```

### Multiple Payment Methods

```typescript
'use client'

interface PaymentSettings {
  methods: {
    bitcoin: { address: string; enabled: boolean }
    usdt: { address: string; enabled: boolean }
    stripe: { enabled: boolean }
    paypal: { enabled: boolean }
  }
}

export function PaymentGateway() {
  const { data: settings } = useFirestoreListener<PaymentSettings>(
    'pageSettings',
    'payment'
  )
  
  return (
    <div className="payment-options">
      {settings?.methods.bitcoin.enabled && (
        <PaymentMethod
          name="Bitcoin"
          address={settings.methods.bitcoin.address}
        />
      )}
      
      {settings?.methods.usdt.enabled && (
        <PaymentMethod
          name="USDT"
          address={settings.methods.usdt.address}
        />
      )}
      
      {settings?.methods.stripe.enabled && (
        <StripeCheckout />
      )}
    </div>
  )
}

// Admin enables/disables payment methods instantly
```

### Scheduled Maintenance Mode

```typescript
'use client'

interface PageControl {
  maintenanceMode: boolean
  maintenanceStartTime?: string
  maintenanceEndTime?: string
  maintenanceMessage?: string
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: pageControl } = useFirestoreListener<PageControl>(
    'pageSettings',
    'pageControl'
  )
  
  if (pageControl?.maintenanceMode) {
    return (
      <div className="maintenance-page">
        <h1>Under Maintenance</h1>
        <p>{pageControl.maintenanceMessage || 'We\'ll be back soon!'}</p>
        {pageControl.maintenanceEndTime && (
          <p>Expected back: {new Date(pageControl.maintenanceEndTime).toLocaleString()}</p>
        )}
      </div>
    )
  }
  
  return <>{children}</>
}

// Admin enables maintenance mode with a message and end time
// All users see it instantly and can see when it ends!
```

## Debugging Real-Time Updates

Check browser console for logs with `[Firestore]` prefix:

```javascript
// Listener started
[Firestore] Listening to pageSettings/fanCard

// Data updated
[Firestore] pageSettings/fanCard updated: { price: 5000, ... }

// Listener cleaned up
[Firestore] Unsubscribing from pageSettings/fanCard
```

To enable full debugging:

```typescript
// In your component
const { data } = useFirestoreListener('pageSettings', 'fanCard')

// In browser console:
localStorage.debug = '*' // See all logs
// or specific:
localStorage.debug = 'firestore*'
```

## Firestore Security Rules

Recommended rules to allow public read access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read of pageSettings
    match /pageSettings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
    
    // Only admins can read/write admins collection
    match /admins/{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
    }
  }
}
```

## Troubleshooting

**"Data not updating in real-time"**
- Check Firestore security rules allow public reads
- Verify collection and document names match exactly
- Check browser console for listener errors
- Verify Firestore has the document

**"Loading state stuck"**
- Check network tab for errors
- Verify Firebase config is correct
- Check browser console for detailed errors

**"Data is always null"**
- Document might not exist - run setup script
- Check collection/document name spelling
- Try manually creating the document in Firestore Console

---

**Next Steps**: Copy these examples into your public pages and watch as admin changes sync instantly!
