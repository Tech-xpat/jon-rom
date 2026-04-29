# Quick Reference Card

## Payment Methods

```
CASH APP     $tinabeingblessed
VENMO        Tina-McGowan-17
CRYPTO       Bitcoin (BTC) or USDT - Admin provides address
```

## Shop Checkout Flow

```
1. ADD ITEMS TO CART
   ↓
2. ENTER CUSTOMER DETAILS
   - Email (required)
   - Phone (required)
   - Address (required)
   - Alt Phone (optional)
   ↓
3. SELECT PAYMENT METHOD
   - Choose: Crypto / Cash App / Venmo
   - View payment instructions
   ↓
4. CONFIRM & PAY
   - Processing spinner shown
   - Email confirmation sent
   - Order appears in admin panel
```

## Admin Quick Actions

### View Orders
- Go to: `https://yoursite.com/admin/orders`
- See: All shop and fan card orders
- Info shown: Customer details, payment method, status

### Verify Cash App / Venmo Payment
1. Open Cash App or Venmo app
2. Find transaction from customer email
3. Verify amount matches order total
4. Check payment note includes customer email
5. Update order status in admin panel

### Verify Crypto Payment
1. Get customer's crypto address from order
2. Send admin wallet address to customer (via email)
3. Customer sends crypto to wallet
4. Use blockchain explorer to verify:
   - Amount correct
   - Confirmations received
5. Update order status in admin panel

### Update Order Status
1. Go to admin/orders
2. Find order in table
3. Click order row
4. Change status: pending-payment → paid → shipped
5. Send shipping confirmation to customer

## Important Numbers

```
TOTAL ORDERS: https://yoursite.com/admin/orders
TOTAL REVENUE: https://yoursite.com/admin/orders (displayed)
PENDING ORDERS: Filter by "pending-payment" status
PAID ORDERS: Filter by "paid" status
```

## Customer Support

### Customer Can't Complete Checkout
1. Check if form is filled correctly
2. Ask for email, phone, address
3. Help choose payment method
4. Provide payment instructions

### Customer Sent Payment But Order Not Updated
1. Find order in admin/orders
2. Check payment details match
3. If payment received, update status to "paid"
4. Send confirmation email

### Customer Lost Order ID
1. Look up by email in admin/orders
2. Find order with their email address
3. Provide order ID from table

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Orders not showing | Refresh admin page, check auth |
| Payment details wrong | Check ShopClient.tsx lines 260-275 |
| Email not sent | Configure RESEND_API_KEY or SENDGRID_API_KEY |
| Crypto address needed | Get from admin env var or generate new one |
| Image not displaying | Check file extension matches actual format |
| Logo too small | It's been increased 25%, check cache |

## Files to Know

```
SHOP SETUP:
/src/app/shop/ShopClient.tsx      ← Edit products & payments here
/src/app/shop/page.tsx             ← Shop page component

ADMIN:
/src/app/admin/orders/page.tsx    ← View all orders here
/src/app/api/admin/orders/route.ts ← Order API handler

PAYMENT METHODS:
/src/app/shop/ShopClient.tsx:260  ← Payment method display
/src/components/sections/home/FanCardSection.tsx:90 ← Fan card payment

DOCUMENTATION:
IMPLEMENTATION_SUMMARY.md          ← Full technical details
PAYMENT_INTEGRATION_GUIDE.md       ← Payment setup guide
ADMIN_CHECKLIST.md                 ← Setup checklist
QUICK_REFERENCE.md                 ← This file
```

## Environment Setup

### Required
```
ADMIN_EMAIL=your@email.com
```

### For Emails
```
Choose ONE:
RESEND_API_KEY=resend_key_here
SENDGRID_API_KEY=sendgrid_key_here
```

### For Crypto (Optional)
```
BTC_WALLET_ADDRESS=your_btc_wallet
USDT_WALLET_ADDRESS=your_usdt_wallet
```

## Daily Checklist

- [ ] Check `/admin/orders` for new orders
- [ ] Verify Cash App / Venmo payments received
- [ ] Check for pending crypto transactions
- [ ] Update order statuses as payments received
- [ ] Monitor email notifications
- [ ] Respond to customer inquiries
- [ ] Process shipments for "paid" orders

## Links

```
Shop:           https://yoursite.com/shop
Admin Orders:   https://yoursite.com/admin/orders
Fan Card:       https://yoursite.com/fan-card
Admin Login:    https://yoursite.com/admin/login
```

## Payment Contact Info

```
CASH APP USER: Tina-McGowan (handle: $tinabeingblessed)
VENMO USER:    Tina McGowan (handle: Tina-McGowan-17)
```

## Key Contact Points

**Customer Email:**
- Use to identify orders
- Send payment confirmation
- Send tracking info

**Customer Phone:**
- Backup contact method
- Call for payment verification if needed

**Customer Address:**
- For shipping products
- Verify before processing

## Order Columns Explained

```
ORDER ID     → Unique identifier (SHOP-12345-abcdef)
TYPE         → SHOP (merchandise) or FAN-CARD
EMAIL        → Customer email for order confirmation
PHONE        → Customer phone number
PRODUCT      → Type of product (merchandise/fan-card)
AMOUNT       → Total order price in USD
PAYMENT      → How they're paying (cashapp/venmo/crypto-btc/crypto-usdt)
STATUS       → pending-payment / paid / shipped
DATE         → When order was placed
```

## Status Meanings

```
PENDING-PAYMENT    → Waiting for customer to send payment
PAID               → Payment received, ready to ship
SHIPPED            → Order sent to customer
```

## Test Order Data

When testing, use these format:

```
Email:    test@example.com
Phone:    +1 (555) 123-4567
Address:  123 Main St, City, State 12345
Payment:  Cash App / Venmo / Crypto BTC or USDT
Amount:   $29.99 - $69.99 (varies by product)
```

---

**Last Updated:** 2026-04-24
**Logo Size:** Increased 25% ✓
**Payment Methods:** 3 (Cash App, Venmo, Crypto) ✓
**Mobile Ready:** Yes ✓
**Admin Orders:** Complete ✓
