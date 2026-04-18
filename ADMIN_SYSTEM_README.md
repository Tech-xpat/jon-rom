# Admin Management System

## Overview
Complete admin management system with restricted email access, admin user management, fan card pricing control, wallet configuration, and reward distribution.

## Authentication & Access Control

### Restricted Login Emails
Only these two emails can access the admin panel:
- `empiredigitalsworldwide@gmail.com`
- `empiredigitalsceo@gmail.com`

**Location:** `/src/components/admin/AdminAuthProvider.tsx` (Line 30-33)

### Login Flow
1. Navigate to `/admin/login`
2. Enter authorized email address
3. System validates against hardcoded email list
4. On success, redirected to admin dashboard
5. All admin routes are protected by AuthGuard

## Admin Features

### 1. Admin User Management (`/admin/admins`)
**Features:**
- Add new admin users with email
- Assign roles: Super Admin, Admin, Moderator
- Remove admins (except protected ones)
- View admin list with creation date

**Protected Admins:**
- `empiredigitalsworldwide@gmail.com` - Cannot be removed (PROTECTED badge)
- `empiredigitalsceo@gmail.com` - Cannot be removed (PROTECTED badge)

**API:** `POST/DELETE /api/admin/admins`

### 2. Fan Card Management (`/admin/fan-card`)
**Features:**
- **Change Price:** Input USD amount for fan card
- **Customize Design:**
  - Background gradient/color
  - Accent color with live preview
  - Footer text
  - Logo image URL
- **Anti-Screenshot Protection:** Checkbox toggle
- **Live Preview:** Real-time card preview with settings

**API:** `PUT /api/admin/settings/fan-card`

### 3. Crypto Wallets (`/admin/wallets`)
**Features:**
- **Bitcoin (BTC) Address:** Configure BTC wallet for payments
- **Tether USDT Address:** Configure Ethereum USDT wallet
- Character count display
- Validation and success messages

**Used By:** Payment processing and user checkout
**API:** `POST /api/admin/wallets`

### 4. Rewards System (`/admin/rewards`)
**Features:**
- **Initiate Rewards:** Send bonus amount to users
- **Find Users By:**
  - User ID
  - Email address
- **Reward Details:**
  - Amount (USD)
  - Custom description
- **Recent Rewards History:** View last 50 rewards with status
- **Status Tracking:** pending, completed, failed

**Access:** Super Admin only
**API:** `POST/GET /api/admin/rewards`

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx              # Login form (email-based)
│   │   ├── admins/page.tsx             # Admin management
│   │   ├── fan-card/page.tsx           # Fan card settings
│   │   ├── wallets/page.tsx            # Wallet configuration
│   │   ├── rewards/page.tsx            # Rewards system
│   │   └── layout.tsx                  # Auth guard + provider
│   └── api/admin/
│       ├── check-role/route.ts         # Email validation endpoint
│       ├── admins/route.ts             # Admin CRUD
│       ├── rewards/route.ts            # Reward management
│       ├── settings/fan-card/route.ts  # Fan card settings
│       └── wallets/route.ts            # Wallet storage
├── components/admin/
│   ├── AdminAuthProvider.tsx           # Auth context (email-based)
│   └── AdminSidebar.tsx                # Navigation menu
└── lib/
    └── firebase-admin.ts               # Server utilities
```

## Security

✅ **Email Whitelist:** Only 2 hardcoded emails can login
✅ **Protected Admins:** Super admin accounts cannot be removed
✅ **Role-Based Access:** Rewards only for super admins
✅ **Server-Side Validation:** All API endpoints validate email authorization
✅ **Auth Guard:** All admin routes redirect to login if unauthenticated

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET/POST | `/api/admin/check-role` | Email | Validate admin email |
| POST/DELETE | `/api/admin/admins` | Super Admin | Manage admin users |
| POST/GET | `/api/admin/rewards` | Super Admin | Initiate/view rewards |
| PUT | `/api/admin/settings/fan-card` | Admin | Update fan card price/design |
| POST | `/api/admin/wallets` | Admin | Update wallet addresses |

## Data Storage

Currently using in-memory storage. For production:
- **Admins:** Store in Firestore `admins` collection
- **Rewards:** Store in Firestore `rewards` collection
- **Settings:** Store in Firestore `settings` document
- **Wallets:** Store in Firestore `wallets` document

## Environment Variables

No additional environment variables required. System uses hardcoded email list for security.

## Testing

1. **Login:** Go to `/admin/login`, enter authorized email
2. **Admin Management:** Navigate to "Admin Users" in sidebar
3. **Fan Card:** Click "Fan Card" to adjust pricing/design
4. **Wallets:** Configure BTC and USDT addresses
5. **Rewards:** Grant bonuses to users via "Rewards" section

## Notes

- All admin emails are case-insensitive
- Rewards are stored in-memory (cleared on server restart)
- Protected admins show "PROTECTED" badge
- Live preview updates in real-time for fan card settings
- Wallet addresses displayed to users during checkout
