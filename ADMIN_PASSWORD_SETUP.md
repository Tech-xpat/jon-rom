# Admin Password Management System

Complete guide to setting up and managing admin passwords.

## Initial Setup

### 1. Initialize Super Admin Accounts

Run this command to create the super admin accounts with password "Bigadmin222":

```bash
export FIREBASE_ADMIN_KEY_PATH=./firebase-service-account.json
npx ts-node scripts/init-super-admins.ts
```

**What this does:**
- Creates Firebase Authentication accounts for both super admins
- Sets password to "Bigadmin222"
- Creates admin records in Firestore with super-admin role
- Verifies both accounts are ready to use

### 2. Verify Setup

After initialization, you should see:
```
✓ empiredigitalsworldwide@gmail.com is ready to use
✓ empiredigitalsceo@gmail.com is ready to use
✅ Super-admin initialization complete!
```

## Admin Login

Visit `/admin/login` and enter:

**Option 1: First Super Admin**
- Email: `empiredigitalsworldwide@gmail.com`
- Password: `Bigadmin222`

**Option 2: Second Super Admin**
- Email: `empiredigitalsceo@gmail.com`
- Password: `Bigadmin222`

## Changing Admin Password

### From Admin Dashboard

1. Go to **Settings** page (`/admin/settings`)
2. Scroll to **ACCOUNT SECURITY** section
3. Click **Change Password** button
4. Enter:
   - Current password (Bigadmin222 initially)
   - New password (min 6 characters)
   - Confirm new password
5. Click **Update Password**
6. Password changes immediately in Firebase Authentication

### Requirements

- Current password must be correct
- New password must be at least 6 characters
- Passwords must match

## Managing Multiple Admins

### Add New Admin User

1. Go to **Admin Users** page (`/admin/admins`)
2. Click **Add Admin** button
3. Enter new admin email
4. Select role: super-admin, admin, or moderator
5. Admin must be created in Firebase Authentication first

### Roles & Permissions

- **super-admin**: Full access, can manage admins and settings
- **admin**: Can manage content and settings
- **moderator**: Limited access to moderation features

### Remove Admin User

1. Go to **Admin Users** page
2. Find admin in list
3. Click delete button (trash icon)
4. Confirm removal

**Note:** Protected super admins (empiredigitalsworldwide@gmail.com, empiredigitalsceo@gmail.com) cannot be deleted

## Security Features

✓ Firebase Authentication - Secure password hashing  
✓ Password verification required before changes  
✓ Real-time updates across tabs/devices  
✓ Session management via Firebase  
✓ Role-based access control (RBAC)  
✓ Protected admin accounts cannot be removed  

## Troubleshooting

### "Current password is incorrect"
- Verify you're typing the correct password
- Check Caps Lock
- Try password recovery in Firebase Console

### "Email not found"
- Ensure super admin accounts were initialized with `init-super-admins.ts`
- Check email spelling matches exactly
- Run initialization script again if needed

### "Password change failed"
- Ensure you have super-admin role
- Check internet connection
- Try refreshing the page and login again

### "Cannot add admin"
- Ensure new admin email exists in Firebase Authentication
- Check you have super-admin permissions
- Verify email format is valid

## API Endpoints

### Password Change
```
POST /api/admin/password
{
  "email": "admin@example.com",
  "currentPassword": "oldpass",
  "newPassword": "newpass"
}
```

Returns:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Admin Management
```
GET /api/admin/admins              # List all admins
POST /api/admin/admins             # Add new admin
PUT /api/admin/admins/{id}         # Update admin
DELETE /api/admin/admins/{id}      # Remove admin
```

## Database Schema

### Firebase Authentication
Each admin has a user account with:
- Email
- Password (hashed)
- UID (unique identifier)

### Firestore Collections
```
admins/{email}
├── email: string
├── role: "super-admin" | "admin" | "moderator"
├── verified: boolean
└── createdAt: timestamp
```

## Best Practices

1. **Strong Passwords**
   - Use passwords with 8+ characters
   - Mix uppercase, lowercase, numbers, symbols
   - Avoid common words or patterns

2. **Regular Changes**
   - Change password every 90 days
   - Change immediately if compromised

3. **Account Security**
   - Never share passwords
   - Use unique password per admin account
   - Log out after each session

4. **Admin Management**
   - Remove unused admin accounts
   - Keep admin list current
   - Monitor who has super-admin access

## Features Included

✓ Secure password change in settings  
✓ Email/password authentication  
✓ Admin user management  
✓ Role-based access control  
✓ Protected super-admin accounts  
✓ Real-time Firestore sync  
✓ Session management  
✓ Logout with user display  
✓ Error handling and validation  
✓ TypeScript type safety  

## Next Steps

1. Run initialization: `npx ts-node scripts/init-super-admins.ts`
2. Login: `/admin/login`
3. Change password: Settings → Account Security
4. Add more admins: Admin Users → Add Admin
5. Configure other settings as needed

---

**Your admin system is now fully set up and production-ready!**
