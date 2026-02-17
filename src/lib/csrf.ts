import crypto from 'crypto'

/**
 * CSRF (Cross-Site Request Forgery) Protection
 * Generates and validates secure tokens for form submissions
 */

interface StoredToken {
  token: string
  createdAt: number
  expiresAt: number
}

const TOKEN_TTL = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_STORED_TOKENS = 100 // Prevent memory exhaustion

// Token storage (in-memory - for production, use Redis or database)
const tokenStore = new Map<string, StoredToken>()

/**
 * Generate a secure CSRF token
 */
export function generateCSRFToken(sessionId: string = 'default'): string {
  const token = crypto.randomBytes(32).toString('hex')
  const now = Date.now()

  const storedToken: StoredToken = {
    token,
    createdAt: now,
    expiresAt: now + TOKEN_TTL,
  }

  tokenStore.set(sessionId, storedToken)

  // Clean up expired tokens periodically
  if (tokenStore.size > MAX_STORED_TOKENS) {
    cleanupExpiredTokens()
  }

  return token
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(token: string, sessionId: string = 'default'): boolean {
  const stored = tokenStore.get(sessionId)

  if (!stored) {
    return false
  }

  // Check if token expired
  if (Date.now() > stored.expiresAt) {
    tokenStore.delete(sessionId)
    return false
  }

  // Check if token matches
  const isValid = crypto.timingSafeEqual(
    Buffer.from(stored.token),
    Buffer.from(token)
  )

  // Always remove token after validation (one-time use)
  tokenStore.delete(sessionId)

  return isValid
}

/**
 * Generate CSRF token for form
 */
export function getCSRFInput(sessionId: string = 'default'): { name: string, value: string } {
  const token = generateCSRFToken(sessionId)
  return {
    name: 'csrf_token',
    value: token,
  }
}

/**
 * Clean up expired tokens from storage
 */
function cleanupExpiredTokens(): void {
  const now = Date.now()
  for (const [sessionId, stored] of tokenStore.entries()) {
    if (now > stored.expiresAt) {
      tokenStore.delete(sessionId)
    }
  }
}

/**
 * Generate a simple session ID for CSRF protection
 * In production, use proper session management
 */
export function generateSessionId(): string {
  return crypto.randomBytes(16).toString('hex')
}
