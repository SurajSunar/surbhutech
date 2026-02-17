/**
 * Security utilities for input validation and sanitization
 * Provides protection against XSS, injection attacks, and other security threats
 */

export const MAX_REQUEST_SIZE = 10 * 1024 // 10KB max request size
export const MAX_NAME_LENGTH = 100
export const MAX_EMAIL_LENGTH = 255
export const MAX_MESSAGE_LENGTH = 1000

/**
 * Dangerous patterns to detect in input
 */
const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /on\w+\s*=/gi, // Event handlers like onclick=
  /<script[^>]*>.*?<\/script>/gis,
  /<iframe[^>]*>.*?<\/iframe>/gis,
  /<object[^>]*>.*?<\/object>/gis,
  /<embed[^>]*>.*?<\/embed>/gis,
  /<form[^>]*>.*?<\/form>/gis,
  /<input[^>]*>/gis,
  /<button[^>]*>.*?<\/button>/gis,
  /expression\s*\(/gi, // CSS expression
  /@import/gi, // CSS import
  /&#x[\da-f]+;/gi, // HTML hex entities
  /&#\d+;/gi, // HTML decimal entities
  /from\s*\(\s*['"]\s*javascript/gi,
]

/**
 * Check if input contains dangerous patterns
 */
export function containsDangerousPatterns(input: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input))
}

/**
 * Sanitize input to prevent XSS attacks
 * Uses multiple layers of protection
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  let sanitized = input

  // Remove null bytes and control characters (except common whitespace)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Remove dangerous HTML tags and event handlers
  DANGEROUS_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '')
  })

  // HTML entity encoding for common characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')

  // Remove any remaining potential HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, '')

  // Remove extra whitespace
  sanitized = sanitized.trim()

  // Limit length
  sanitized = sanitized.substring(0, 2000)

  return sanitized
}

/**
 * Sanitize HTML content (rich text areas)
 * For future use with rich text editors
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  let sanitized = input

  // Remove dangerous tags but keep basic formatting
  const dangerousTags = [
    '<script',
    '</script>',
    '<iframe',
    '</iframe>',
    '<object',
    '</object>',
    '<embed',
    '</embed>',
    '<form',
    '</form>',
    '<input',
    '<button',
    '</button>',
    '<link',
    '<meta',
  ]

  dangerousTags.forEach((tag) => {
    const regex = new RegExp(tag, 'gis')
    sanitized = sanitized.replace(regex, '')
  })

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]+/gi, '')

  // Remove javascript: and data: URLs
  sanitized = sanitized.replace(/(src|href)\s*=\s*["']\s*javascript:/gi, '$1=""')
  sanitized = sanitized.replace(/(src|href)\s*=\s*["']\s*data:/gi, '$1=""')

  return sanitized
}

/**
 * Validate email format with stricter rules
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!emailRegex.test(email)) {
    return false
  }

  // Check length
  if (email.length > MAX_EMAIL_LENGTH) {
    return false
  }

  // Check for suspicious patterns
  if (email.includes('+') || email.includes('..')) {
    return false
  }

  return true
}

/**
 * Validate and sanitize URL
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  // Remove javascript: and data: protocols
  const cleaned = url.replace(/^(javascript|data|vbscript):/gi, '')

  // Only allow http and https protocols
  if (!/^https?:\/\//i.test(cleaned)) {
    return ''
  }

  // Validate URL format
  try {
    const urlObj = new URL(cleaned)
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return ''
    }
    return urlObj.href
  } catch {
    return ''
  }
}

/**
 * Validate request size
 */
export function validateRequestSize(request: Request): { valid: boolean; size: number } {
  const contentLength = request.headers.get('content-length')
  const size = contentLength ? parseInt(contentLength, 10) : 0

  return {
    valid: size <= MAX_REQUEST_SIZE,
    size,
  }
}

/**
 * Check for SQL injection patterns
 * For additional protection (though Prisma handles this)
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bUNION\b.*\bSELECT\b)/gi,
    /(\bDROP\b.*\bTABLE\b)/gi,
    /(\bDELETE\b.*\bFROM\b)/gi,
    /(\bINSERT\b.*\bINTO\b)/gi,
    /(\bUPDATE\b.*\bSET\b)/gi,
    /(\bEXEC\b|EXECUTE\b)/gi,
    /(;\s*\b(WAITFOR|DELAY)\b)/gi,
    /(\b(OR|AND)\s+["']?\d+["']?\s*=\s*["']?\d+["'?])/gi,
    /(["']\s*(OR|AND)\s*\d+\s*=\s*\d+)/gi,
    /(--)/g,
    /(\/\*)/,
  ]

  return sqlPatterns.some((pattern) => pattern.test(input))
}

/**
 * Generate a safe error response without exposing sensitive information
 */
export function safeErrorResponse(message: string, status: number = 500, details?: Record<string, any>) {
  // Sanitize error message
  const sanitizedMessage = sanitizeInput(message)

  const response: any = {
    error: sanitizedMessage,
    status,
    timestamp: new Date().toISOString(),
  }

  // Add sanitized details if provided
  if (details) {
    const sanitizedDetails: Record<string, any> = {}
    for (const [key, value] of Object.entries(details)) {
      // Never include stack traces, passwords, or keys
      if (!isSensitiveKey(key)) {
        sanitizedDetails[key] = typeof value === 'string' ? sanitizeInput(value) : value
      }
    }
    response.details = sanitizedDetails
  }

  return response
}

/**
 * Check if a key is sensitive (should not be included in error responses)
 */
function isSensitiveKey(key: string): boolean {
  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'key',
    'credential',
    'auth',
    'cookie',
    'session',
    'stack',
    'trace',
    'api_key',
    'apikey',
  ]
  return sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))
}

/**
 * Rate limit violation response
 */
export function rateLimitResponse(resetTime: number): any {
  return {
    error: 'Too many requests. Please try again later.',
    status: 429,
    retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
    resetTime: new Date(resetTime).toISOString(),
  }
}
