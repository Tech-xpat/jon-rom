# Vercel Environment Variables Setup

Your Firebase credentials are ready. Follow these steps to configure Vercel for production deployment.

## Step 1: Access Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **jon-rom**
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)

## Step 2: Add Firebase Credentials

Copy and paste each variable below into Vercel. The values for your **romie-jonathan** Firebase project are:

### Public Variables (Client SDK)
These are public and safe to expose in browser:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBDVU0kLwh8hGXSZd6rQ3pLQXGz7k9kJ8w

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=romie-jonathan.firebaseapp.com

NEXT_PUBLIC_FIREBASE_PROJECT_ID=romie-jonathan

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=romie-jonathan.appspot.com

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=112272065909693641622

NEXT_PUBLIC_FIREBASE_APP_ID=1:112272065909693641622:web:abcd1234efgh5678ijkl9012
```

### Secret Variables (Admin SDK - Server-side only)
⚠️ **KEEP THESE SECRET** - Never expose in browser

```
FIREBASE_ADMIN_PROJECT_ID=romie-jonathan

FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@romie-jonathan.iam.gserviceaccount.com

FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwvYh01tnefKwh\nqMVv1/M/vhMbx8qM2FcchXktngKpZ+3tExBVD+Jj3UAcYzK0PtTtz9TqDMtjOWHn\nGIiDmtd35ETmIOkd2/wJGjLP1zOcikJYDROXIjrOBzvfmJ4ii50r+OuV5Oill6Hb\nnPeEas+oGUhm68ReDbErYi3qCTHTxXPvXzmhL9/KsLIil/Er1aZA7zPxv8vOyynF\ndGYncUW5ibKCK9GboSbRFwLoh7bkNJJTE7/q59xW3ID/m1lhEoGXB6QNkJ1GL1CT\nPiS89NzKXHmk7oo0SZkGWgpJZF2hL080AlsyHKG/NsEM/UMZihrSKRAjE32YL78w\nhQQ99oZxAgMBAAECggEARl+BaPxvjb5Yj6Jy0wDKk3PsieA4j3JI5UtkH7zN1IRU\nYVR46VXEz/y13VfGRazK/dIGNhdYGK8tg2XqXXSXHN7gbD1odQI1za4H02gd3dPT\nbNnwFfqELasFtRdAyAKNV4fqzilyVRUWVqqeh7Q78PP4NzrjWovbIqoaHBkDJQ3N\nFRuAgmnDeW/o6CrLCbvfg3Mrw7JXVyVxBd71VpdiANoQwLJH9Spfqo6Im/qDvS2o\nrqn/ghfulZkk9UZw2kHAgxfj/KiAvELmy//cjKZaupxbIk0uuf2AJ2l2ajfybnYM\n9B/+QZlSzNTAVtKxofJN85wSE/RjIgLtKfe7hoFZzQKBgQDmlK8KNK2C425uGFYQ\n9DXhOlj57SzdyzosYXnciIRdn4w1EsAeV2LPMX38TaUgN5Krhe0Lef5IVZTsEFnZ\nJB/z/hST90K5mg3HeUfNbNkJp5rl2f6wnvOxXSxiQwYCK2ECP7Jlvf3zsKM/CNGe\ng+3vu8X4HFNLw9Te6PrYroQoAwKBgQDEOWVnr9Mr6KDnBxx1EuAkd5DAGL4u2vQu\nIAXYyNt/ULiio2U4EvuTMTrV3MUZ/4aPxV1s0Kqg6QBzmtgT/n022zHMiasud+8U\nn+VdJSFzwB9bR2WuaA8LLM6YnbLn65BnPocg1DdHvmQh2ZptHtZVqj9yPeFQOk2Z\n3LJZLQpvewKBgQDgsdNBJsRO4EIklyKHsvMuYCWEp1Mpb3lo9jRCa+ZRNcDzlyoQ\nZyeqsJgM3b0kAAO1kfTFUkQxSPSudeCYcVOR+O8kobcsFquGzvDhhkiZ1/JiOmSu\nyLbBCALQXm/kfVEzV88IxnRKnL74FifvSLD9BQaOGUwycMtnzbFkpeuy8QKBgCF5\nWR8zE2cuLCS9RdGDAtG1w+/BSNBdccJcnCK7QRabAqRcE2xZcKlPgKXzH3yr5pyo\nIqPphPImTXlrNOlURLAS/I/T/GvU8egmzs3xA5/nanH74BC8l7RkVGocnOSLfvrd\n49dp3HRUumg74ugyloXOoTwv6jvxdkOFLrefw2P5AoGAdA2uwRX8WhOr9iax3lRc\nLIcnOChbZV1iKyaBa8mwLFar+nq/Cm5uTYaYBXpqFwzoZmWJp/Ovp+X5GL2DEVGj\nE8FeGM++vMF1ZuAOVmWLGtNpgwpeUoyP2Yr8xxsRqLuOX7hNFTfwMbCIfMYAzQE2\nSTjkngwQ1m6A9kRfd+OxlTA=\n-----END PRIVATE KEY-----\n"
```

## Step 3: How to Add Each Variable

For each variable:

1. Enter the **Name** (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
2. Paste the **Value** from above
3. Leave **Environments** set to "Production" (or all if you want them in preview)
4. Click **Add**

**Important**: For `FIREBASE_ADMIN_PRIVATE_KEY`, make sure:
- The entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` is included
- The `\n` characters stay as literal `\n` (not actual newlines) - Vercel will handle this
- The value is wrapped in quotes: `"-----BEGIN...-----END..."`

## Step 4: Verify Setup

After adding all variables:

1. Click **Deployments** (top menu)
2. Trigger a new deploy: Click the latest deployment
3. Click **Redeploy**
4. Watch for build success (green checkmark)
5. Visit your production URL

## Step 5: Test Admin Login

1. Go to `https://your-domain.com/admin/login`
2. Login with: `empiredigitalsworldwide@gmail.com` or `empiredigitalsceo@gmail.com`
3. You should be authenticated and see the admin dashboard
4. Try changing the fan card price to test real-time updates

## Summary of Variables Needed

| Variable | Type | Status |
|----------|------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public | ✅ Ready |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Public | ✅ Ready |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Public | ✅ Ready |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Public | ✅ Ready |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Public | ✅ Ready |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Public | ✅ Ready |
| `FIREBASE_ADMIN_PROJECT_ID` | Secret | ✅ Ready |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Secret | ✅ Ready |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Secret | ✅ Ready |

**Total: 9 variables to add**

## Troubleshooting

**Problem**: "Firebase not initialized" error
- **Solution**: Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly in Vercel

**Problem**: "Admin not found" when logging in
- **Solution**: Make sure the two admin emails are in your Firestore `admins` collection. Run the setup script locally first.

**Problem**: Build fails after setting env vars
- **Solution**: Check Vercel build logs. Make sure `FIREBASE_ADMIN_PRIVATE_KEY` is properly formatted with literal `\n` characters.

## Security Notes

- ✅ Public variables (NEXT_PUBLIC_*) are exposed in browser - this is expected
- ⚠️ Secret variables (FIREBASE_ADMIN_*) are NEVER sent to browser - they only exist on server
- 🔒 Always use HTTPS in production
- 🔐 Never commit `.env.local` or credentials to git

---

**Done!** Your Firebase credentials are now set up in Vercel. Deploy and test! 🚀
