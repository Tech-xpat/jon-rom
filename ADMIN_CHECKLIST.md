# Admin Payment Setup Checklist

## Immediate Actions Required

### 1. Verify Payment Details in Code
- [x] Cash App: $tinabeingblessed (already set)
- [x] Venmo: Tina-McGowan-17 (already set)
- [x] Payment methods display in shop and fan card pages

### 2. Logo Size Verification
- [x] Logo increased by 25% for better visibility
- [x] Logo responsive on mobile, tablet, desktop
- [x] Test in header on all page sizes

### 3. Checkout Flow Configuration
- [x] Customer form: email, phone, address, alt phone
- [x] Payment method selection: Crypto, Cash App, Venmo
- [x] Order confirmation with spinning loader
- [x] Admin orders dashboard ready

### 4. Email Service Setup (TODO)
Choose one email provider:
- [ ] **Resend** (Recommended for Next.js)
  - [ ] Sign up at resend.com
  - [ ] Get API key
  - [ ] Add RESEND_API_KEY to environment variables
  - [ ] Uncomment Resend code in `/src/app/api/email/route.ts`

- [ ] **SendGrid**
  - [ ] Sign up at sendgrid.com
  - [ ] Get API key
  - [ ] Add SENDGRID_API_KEY to environment variables
  - [ ] Implement SendGrid integration in email route

- [ ] **Other Provider**
  - [ ] Configure email service
  - [ ] Update email route
  - [ ] Add necessary environment variables

### 5. Test the Shop
- [ ] Add items to cart
- [ ] Enter customer details
- [ ] Test each payment method (Crypto, Cash App, Venmo)
- [ ] Verify order appears in admin/orders
- [ ] Confirm checkout flow completes successfully

### 6. Test Admin Panel
- [ ] Go to `/admin/orders`
- [ ] Verify all orders display correctly
- [ ] Check order details include:
  - [ ] Customer email
  - [ ] Customer phone
  - [ ] Customer address
  - [ ] Payment method used
  - [ ] Order total
  - [ ] Order status

### 7. Crypto Payment Setup
For each cryptocurrency, decide:

**Bitcoin (BTC)**
- [ ] Get your BTC wallet address
- [ ] Test receiving small amount (if on testnet)
- [ ] Document where wallet address is used

**USDT (Tether)**
- [ ] Choose chain: Ethereum, Polygon, other
- [ ] Get USDT wallet address
- [ ] Document where wallet address is used

**When Customer Selects Crypto:**
- [ ] Customer receives notification
- [ ] Admin receives order details
- [ ] Admin sends crypto wallet address to customer
- [ ] Admin verifies payment on blockchain
- [ ] Admin updates order status to "paid"

## Daily Operations

### Check Orders
```
Visit: https://yoursite.com/admin/orders
Check for:
- New orders (status: pending-payment)
- Payment received for pending orders
- Orders ready to ship (status: paid)
```

### Verify Payments

**For Cash App / Venmo:**
1. Check Cash App: $tinabeingblessed
2. Check Venmo: Tina-McGowan-17
3. Match payment amount to order total
4. Verify customer email in payment note

**For Crypto:**
1. Get customer's wallet address from order details
2. Send them the payment wallet address
3. Monitor wallet for incoming payment
4. Use blockchain explorer to confirm:
   - [ ] Payment received
   - [ ] Amount correct
   - [ ] Confirmations sufficient
5. Update order status in admin panel

### Process Order
1. Confirm payment received
2. Update order status to "paid"
3. Prepare package
4. Send tracking info to customer
5. Update order status to "shipped"

## Payment Methods & Details

### Cash App
- **Handle**: $tinabeingblessed
- **Service**: Mobile payment app
- **Verification**: Check transaction in app
- **Typical Time**: Instant to 1 hour

### Venmo
- **Handle**: Tina-McGowan-17
- **Service**: Mobile payment app
- **Verification**: Check transaction in app
- **Typical Time**: Instant to 1 hour

### Bitcoin (BTC)
- **Type**: Blockchain cryptocurrency
- **Fees**: Varies with network congestion
- **Confirmation Time**: 10 minutes to hours
- **Verification**: Use blockchain explorer
- **Example**: https://blockchain.com

### USDT (Tether)
- **Type**: Stablecoin (value = $1 USD)
- **Chains**: Ethereum, Polygon, others
- **Fees**: Lower than BTC on most chains
- **Confirmation Time**: Minutes
- **Verification**: Use chain explorer

## Important Notes

1. **Always Verify Payments Independently**
   - Don't trust customer screenshots
   - Check payment accounts directly
   - For crypto, use blockchain explorer

2. **Order Status Updates**
   - pending-payment: Waiting for customer payment
   - paid: Payment confirmed, ready to ship
   - shipped: Order sent to customer

3. **Customer Communication**
   - Send order confirmation email with details
   - Provide payment instruction with your address
   - Include your contact info for questions
   - Notify when payment received
   - Send tracking info when shipped

4. **Record Keeping**
   - Keep records of all orders
   - Document payment verification
   - Note any discrepancies
   - Track revenue by payment method

5. **Security**
   - Keep wallet addresses private
   - Don't share customer payment info
   - Use secure payment verification
   - Regular backups of order data

## Monitoring Dashboard

### Admin Orders Page Fields
```
Order ID        - Unique order identifier (SHOP-timestamp-random)
Type            - SHOP or FAN-CARD
Email           - Customer email for confirmation
Phone           - Customer phone number
Product         - merchandise or fan-card
Amount          - Total order price in USD
Payment         - Payment method (cashapp/venmo/crypto-btc/crypto-usdt)
Status          - pending-payment / paid / shipped
Date            - Order creation date
```

## Troubleshooting

### Order Not Showing Up
- [ ] Check if order submission succeeded
- [ ] Verify order was created in system
- [ ] Check admin panel refresh
- [ ] Look for error messages in console

### Payment Not Received
- [ ] Verify payment amount matches order total
- [ ] Check if customer used correct account
- [ ] Ask customer to resend or provide proof
- [ ] Update order details if needed

### Email Not Sent
- [ ] Check email service configuration
- [ ] Verify API keys are set
- [ ] Check email provider dashboard
- [ ] Contact customer directly if urgent

## Revenue Tracking

### Track Sales By Method
- **Cash App**: Check $tinabeingblessed account
- **Venmo**: Check Tina-McGowan-17 account  
- **BTC**: Check BTC wallet balance
- **USDT**: Check USDT wallet balance
- **System**: Check admin/orders total revenue

### Monthly Reporting
- Total orders received
- Total revenue
- Orders by payment method
- Crypto vs fiat distribution
- Pending vs completed orders

## Quick Links

- **Shop**: https://yoursite.com/shop
- **Admin Orders**: https://yoursite.com/admin/orders
- **Fan Card**: https://yoursite.com/fan-card
- **Admin Login**: https://yoursite.com/admin/login

## Support Resources

- Resend Docs: https://resend.com/docs
- SendGrid Docs: https://sendgrid.com/docs
- Blockchain.com: https://blockchain.com (BTC explorer)
- Etherscan: https://etherscan.io (USDT explorer)
