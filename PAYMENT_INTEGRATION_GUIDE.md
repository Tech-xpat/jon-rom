# Payment Integration Guide

## Overview

The site now supports multiple payment methods for both shop purchases and fan card purchases:
- **Crypto**: Bitcoin (BTC) and USDT
- **Cash App**: $tinabeingblessed
- **Venmo**: Tina-McGowan-17

## Shop Checkout Flow

### Step 1: Add Items to Cart
- Users browse products and add to cart
- Cart icon shows item count
- Users can adjust quantities

### Step 2: Customer Details
Users must provide:
- **Email** (required) - for order confirmation
- **Phone Number** (required) - contact number
- **Address** (required) - shipping address
- **Alternative Phone** (optional) - backup contact

### Step 3: Payment Method Selection
Users choose their preferred payment method:
- **Crypto (BTC/USDT)**: Select cryptocurrency type → Admin generates wallet address
- **Cash App**: Direct to $tinabeingblessed
- **Venmo**: Direct to Tina-McGowan-17

For all methods, customer must include their email in payment note.

### Step 4: Confirmation
- Spinning loader shows order is being processed
- Email confirmation is sent to customer
- Order appears in admin dashboard

## Admin Payment Configuration

### Cash App & Venmo (Already Configured)
```
Cash App: $tinabeingblessed
Venmo: Tina-McGowan-17
```

These are hardcoded in:
- `/src/app/shop/ShopClient.tsx` (line ~260-275)
- `/src/components/sections/home/FanCardSection.tsx` (line ~105)

### Crypto Payment Setup

When a customer selects Crypto payment:

1. **Admin generates wallet address** manually
2. Customer sees: "Admin will provide wallet address after order"
3. Admin receives order notification with customer email
4. Admin sends wallet address to customer via email

**To configure crypto payments:**
1. Get your BTC and USDT wallet addresses
2. When customer selects crypto, provide the appropriate wallet address
3. Customer sends payment with email in note
4. Verify payment and update order status in admin panel

## Order Management

### Viewing Orders in Admin Dashboard

Go to `/admin/orders` to see all orders:

**Columns displayed:**
- Order ID (unique identifier)
- Type (SHOP or FAN-CARD)
- Email (customer email)
- Phone (customer phone)
- Product (merchandise/fan-card)
- Amount (total price)
- Payment (payment method used)
- Status (pending-payment/paid/shipped)
- Date (order date)

### Order Statuses

- **pending-payment**: Order submitted, awaiting payment confirmation
- **paid**: Payment confirmed, ready to process
- **shipped**: Order has been shipped

### Order Details Available

For each shop order, admin can see:
- Customer details (email, phone, address, alt phone)
- Payment method used
- Cryptocurrency type (if applicable)
- Crypto wallet address (if applicable)
- Complete item list with quantities and prices
- Order timestamp

## Email Configuration

### Current Implementation

Email notifications are logged to console. To enable real email sending:

**Option 1: Resend** (Recommended)
```typescript
// In /src/app/api/email/route.ts
// Uncomment Resend integration
// Set environment variable: RESEND_API_KEY
```

**Option 2: SendGrid**
```
npm install @sendgrid/mail
Set: SENDGRID_API_KEY
```

**Option 3: Custom SMTP**
```
Configure with your email provider
```

### Email Templates

Order confirmation emails include:
- Order ID
- Customer name and contact info
- Item list with prices
- Total amount
- Payment method
- Shipping address

## Cryptocurrency Payment Flow

### For Bitcoin (BTC)

1. Customer selects Bitcoin
2. Admin provides BTC wallet address
3. Customer sends BTC equivalent to USD amount
4. Admin confirms payment received
5. Order status updated to "paid"
6. Shipping begins

### For USDT (Tether)

1. Customer selects USDT
2. Admin provides USDT wallet address (on Ethereum or other chain)
3. Customer sends USDT equivalent to USD amount
4. Admin confirms payment received
5. Order status updated to "paid"
6. Shipping begins

## Fan Card Payment Integration

The fan card section displays all three payment methods:

```
Payment Options:
- Crypto (BTC / USDT)
- Cash App: $tinabeingblessed
- Venmo: Tina-McGowan-17
```

Users apply for fan card and select payment method during application.

## API Endpoints

### POST /api/admin/orders
Submits a new shop order

**Request:**
```json
{
  "items": [...],
  "total": 123.45,
  "customer": {
    "email": "user@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "altPhone": "+0987654321"
  },
  "paymentMethod": "cashapp" | "venmo" | "crypto",
  "cryptoType": "btc" | "usdt",
  "cryptoWallet": "wallet_address",
  "timestamp": "2026-04-24T..."
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "SHOP-123456-abcdef",
  "message": "Order received. Awaiting payment confirmation."
}
```

### GET /api/admin/orders
Retrieves all orders (requires authentication)

**Response:**
```json
{
  "orders": [...],
  "totalRevenue": 5000.00
}
```

### POST /api/email
Sends email notifications

**Request:**
```json
{
  "to": "admin@example.com",
  "subject": "Order Notification",
  "html": "<h1>New Order</h1>"
}
```

## Security Considerations

1. **Customer Data Protection**
   - Store customer details securely
   - Don't expose in client-side code
   - Use HTTPS only

2. **Payment Verification**
   - Always verify payment independently
   - Don't trust customer-submitted payment proofs
   - Use blockchain explorers for crypto verification

3. **Order Validation**
   - Verify customer details before shipping
   - Cross-reference payment amounts
   - Maintain audit log

## Troubleshooting

### Orders not appearing in admin panel
- Check if user is logged in as admin
- Verify admin authentication is configured
- Check browser console for errors

### Payment method not showing
- Clear browser cache
- Refresh page
- Check if payment credentials are set

### Email not being sent
- Email service may need configuration
- Check /api/email route implementation
- Look for RESEND_API_KEY or SENDGRID_API_KEY env vars

## Next Steps

1. **Configure Email Service** (Priority)
   - Choose Resend, SendGrid, or custom provider
   - Set up API keys
   - Test email delivery

2. **Test Payment Flow**
   - Place test order through shop
   - Verify order appears in admin panel
   - Test all three payment methods

3. **Monitor Orders**
   - Check admin/orders regularly
   - Respond to customer inquiries
   - Update order status as items ship

4. **Analytics**
   - Track sales by payment method
   - Monitor order statuses
   - Calculate revenue by category
