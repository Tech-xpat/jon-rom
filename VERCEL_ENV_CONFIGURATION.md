# Vercel Environment Variables Setup – jon-romie Firebase

Complete guide to configure your Firebase credentials in Vercel for production deployment.

## Quick Copy-Paste

Go to **Vercel Dashboard → Project Settings → Environment Variables** and add these 16 variables:

```
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCThQjqTwbwwiUSD_Uz0bIP9Db-7zcDIKU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jon-romie.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=jon-romie
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jon-romie.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=153741513670
NEXT_PUBLIC_FIREBASE_APP_ID=1:153741513670:web:1b50bc6b6412d2201158c7
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-839TLHKVCN

FIREBASE_ADMIN_TYPE=service_account
FIREBASE_ADMIN_PROJECT_ID=jon-romie
FIREBASE_ADMIN_PRIVATE_KEY_ID=c1dd98014834647c8efa250c53b6c0d12572a902
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCu7RcnJ7gWs/Lh\nUuRAL+e9pu61fqCtC+kdUJqEK1rzAgfwVogJi1I715HZZWcjZj1eL/AOAjDx3eKf\nO9rTWWrLOrEYIXozYy+xfwGmHOlogQon4y6nBry7+eoVSgibx/77Vj6d8o01gNFc\nEmMWRBtBcTW5Nc7gE/Ddfti0V5CYKD5P1arIra5DhXfWaftXd+svblEWHtN0Gn4A\nIgzTsuYzpHjUqL/CJYbOdcGWPomyxKK435Qsb8hECZCg65KC3b7kIjq1rOcH3/mN\nm29iQAa24efbeBwfNykXt8gNLU0B9VnRiTUnOXCJTgppus87ZPkUoTHoytcdDKmu\nRaQQ/XqZAgMBAAECggEAKK0SJrU6PfE/R70WPYTGPxgbxxF4fHTaEsqE+7n3Lq3o\nua7teEaw6yBwFlzZlGY4W/gKur8wsXV2tq9c7auLxVFTD/js6Rkl5IDTmdR8RCRJ\nf8f4t7c92Po+wA+Um+DwPnKqIeFei7P2OxI9f1Z7/gY8x2InRnzslBzkeF8qTO8g\nT0Wl7R72SqLedFfqOSsdzOwcrehjwfaymnHPG40xkWHeNd4NnY5EKpAmbz1+mhqP\nOaQFqLKK2Osae4bz7LRYXatSbLmAgcGgEHYBDFnNgzGDdN9zcc41M5vqnbL92J//\nzBgd8uLKvr/u5mcV0oZ2WFEvbsHKjdmkKXb5LrwJBwKBgQDUuqATNC2ZXJhxex4v\noYVtRO6YCypcgS8r4A5vSGnvJZYsdqjlnEhE6OD+0s5u5fbIFhuv3Xl/fDiWzX6Z\nfGbMtlQrrIEayrghugbmXh6dNYKMn3KqR12wFm+50LP0OCRZGHZZpODpxDBgxTvk\n37Ag+0rWmnRvLp/Mpk9GUGEk/wKBgQDSgfepSh5f+ygrsAeXyQqW+ojVkxrwT9C+\nmVInuNqqF24y+O1XLUyx0cDsiNznCtaM1JXTUCjltDR3ZGFu2vgKekbWiJA5NMM5\nLjLEoLyQnuDnTUZbY0Hd1RdWGRpiaXJAoY6pTG1Yjoa8BdfRRrqQ8cbGrsPo7J26\n2lXjXSBoZwKBgGNAQ4lSMeg41IM1zyqn8Km/nJZhtzz7pPeSjQmMvqguYDeUkU63\nsNw9zyP1VQ1Wy+IktnxCF/rMCVcKv4N7EDd45iKOVJocdPZ/ZdK7nQr6OVPE3Onn\nbCXJAg2u+xb5zrOm/yjqDWnj+DJeM4igePuaYxtnauWo2jPQcHI89GYfAoGBAKf6\nHe5wvpxIhl2WMfjk7BZeBSKoKC7rAd+V6QDZeWORHtZ93KZb939NqW0WKXAULfBj\nEst0g64IhnVfHIChKpzxxeUbRDrh54aRXuGYgd/FaCIqf6IdKkoh6GVD0tIE4q7A\nPF7MJdUspkcTQow0rFtNExkoDByp85NO9opfnaSxAoGBAIvLKgpjfxy6SafD3glw\nbrZm/q4sANviG3auMWd96UkFK0q3bIr5Xm2vZ8qpfyDwFEIOkqCmZICJDE0RFzYs\nMjcD4NIX9ktQ7QNe8qsMWmx/F0PQhbWuo0isHg8WKvkXW/qYqxO/vtF/b7YrqL2/\n27TZiyDa0YLBmuQr3Zj7T7WD\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@jon-romie.iam.gserviceaccount.com
FIREBASE_ADMIN_CLIENT_ID=101917246730536467706
FIREBASE_ADMIN_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_ADMIN_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_ADMIN_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40jon-romie.iam.gserviceaccount.com

NEXT_PUBLIC_ADMIN_EMAILS=empiredigitalsworldwide@gmail.com,empiredigitalsceo@gmail.com
```

## Step-by-Step Setup

### 1. Go to Vercel Dashboard
- Visit https://vercel.com/dashboard
- Click on your **jon-romie** project
- Go to **Settings** (top navigation)

### 2. Navigate to Environment Variables
- Click **Environment Variables** (left sidebar)
- You'll see a form to add variables

### 3. Add Public Firebase Variables (These are safe to expose)
Add these 7 variables one by one:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCThQjqTwbwwiUSD_Uz0bIP9Db-7zcDIKU` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `jon-romie.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `jon-romie` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `jon-romie.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `153741513670` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:153741513670:web:1b50bc6b6412d2201158c7` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-839TLHKVCN` |

### 4. Add Admin SDK Variables (Private - never expose)
Add these 9 variables:

| Key | Value |
|-----|-------|
| `FIREBASE_ADMIN_TYPE` | `service_account` |
| `FIREBASE_ADMIN_PROJECT_ID` | `jon-romie` |
| `FIREBASE_ADMIN_PRIVATE_KEY_ID` | `c1dd98014834647c8efa250c53b6c0d12572a902` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | (See multiline key below) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@jon-romie.iam.gserviceaccount.com` |
| `FIREBASE_ADMIN_CLIENT_ID` | `101917246730536467706` |
| `FIREBASE_ADMIN_AUTH_URI` | `https://accounts.google.com/o/oauth2/auth` |
| `FIREBASE_ADMIN_TOKEN_URI` | `https://oauth2.googleapis.com/token` |
| `FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL` | `https://www.googleapis.com/oauth2/v1/certs` |
| `FIREBASE_ADMIN_CLIENT_X509_CERT_URL` | `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40jon-romie.iam.gserviceaccount.com` |

### 5. Handling the Private Key
The `FIREBASE_ADMIN_PRIVATE_KEY` contains newlines. In Vercel:
- Copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Paste it exactly as shown in the "Quick Copy-Paste" section above
- Vercel automatically handles the `\n` characters

### 6. Add Admin Email Configuration
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_ADMIN_EMAILS` | `empiredigitalsworldwide@gmail.com,empiredigitalsceo@gmail.com` |

### 7. (Optional) Set Production Base URL
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_BASE_URL` | `https://your-production-domain.com` |

## Verification

After adding all variables:

1. **Go to Deployments** tab
2. **Click the latest deployment** to redeploy with new env vars
3. Or **push a new commit** to trigger automatic redeploy

The build will now use your jon-romie Firebase project.

## Troubleshooting

**Build fails with "Firebase not initialized"**
- Check all 16 variables are added
- Verify no typos in variable names
- Check `NEXT_PUBLIC_` variables are marked as "Plaintext" in Vercel

**Admin login fails with "Email not authorized"**
- Ensure your admin emails are registered in Firebase Authentication
- Visit Firebase Console → Authentication → Users → Create users if needed

**"PRIVATE_KEY is invalid"**
- Make sure you copied the entire multiline key
- Include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Don't modify the newlines - paste exactly as provided

## Security Best Practices

✅ Public variables (`NEXT_PUBLIC_*`) are safe to expose  
✅ Private variables (no prefix) are only used on the server  
✅ Never commit `.env.local` to git  
✅ Never share the private key  
✅ Rotate service account keys periodically in Firebase Console  

## What's Now Configured

- Authentication for `/admin` and `/bigadmin` routes
- Real-time Firestore sync for fan card, wallets, rewards
- Email/password login with Firebase
- Admin role verification
- 24/7 uptime on production servers

Your admin panel is now production-ready!
