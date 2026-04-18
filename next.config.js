/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async headers() {
    return [
      // ── Global headers ───────────────────────────────────────────────────
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // NOTE: X-Frame-Options removed — handled per-route below
          // COOP must be same-origin-allow-popups globally so Firebase Auth
          // popup can post a message back to the opener window.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Google Tag Manager + Firebase + Google APIs
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://*.firebaseapp.com https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.googleusercontent.com https://lh3.googleusercontent.com https://www.googletagmanager.com",
              "font-src 'self' https://fonts.gstatic.com",
              [
                "connect-src 'self'",
                "https://firebase.googleapis.com",
                "https://firebaseinstallations.googleapis.com",
                "https://firebaseremoteconfig.googleapis.com",
                "https://*.firebaseio.com",
                "wss://*.firebaseio.com",
                "https://identitytoolkit.googleapis.com",
                "https://securetoken.googleapis.com",
                "https://accounts.google.com",
                "https://oauth2.googleapis.com",
                "https://www.googleapis.com",
                "https://www.google-analytics.com",
                "https://www.googletagmanager.com",
                "https://region1.google-analytics.com",
              ].join(' '),
              "frame-src https://accounts.google.com https://*.firebaseapp.com https://www.youtube.com https://youtube.com",
              "form-action 'self' https://accounts.google.com",
            ].join('; '),
          },
        ],
      },
      // ── Admin login — must allow popups to open & close ──────────────────
      {
        source: '/admin/login',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'unsafe-none' },
        ],
      },
      // ── Non-admin pages — stricter framing ───────────────────────────────
      {
        source: '/((?!admin).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
