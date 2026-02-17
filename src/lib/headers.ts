/**
 * Security Headers Configuration
 * Adds comprehensive security headers to Next.js responses
 */

export function getSecurityHeaders() {
  return [
    {
      source: '/(.*)',
      headers: [
        // Prevent clickjacking
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        // Prevent MIME sniffing
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        // Enable XSS protection
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        // Prevent referrer leakage
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        // Content Security Policy
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.openai.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https: https://api.openai.com https://*.githubusercontent.com",
            "font-src 'self' data:",
            "connect-src 'self' https://api.openai.com",
            "frame-ancestors 'self'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join(';'),
        },
        // Permissions Policy
        {
          key: 'Permissions-Policy',
          value: 'geolocation=(), microphone=(), camera=(), interest-cohort=(), usb=(), payment=()',
        },
        // HSTS (HTTP Strict Transport Security) - Only enable on HTTPS
        // Uncomment for production with HTTPS
        /*
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
        */
      ],
    },
  ]
}

/**
 * CORS headers for API routes
 */
export function getCORSHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || 'https://surbhutech.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Allow-Credentials': 'false',
    'Access-Control-Max-Age': '86400',
  }
}

/**
 * Additional security headers for API responses
 */
export function getAPIResponseHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  }
}
