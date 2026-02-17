/**
 * Rate Limiting Utility
 * Provides in-memory rate limiting with sliding window algorithm
 * For production, consider using Redis or a database-backed solution
 */

interface RateLimitEntry {
  count: number
  resetTime: number
  lastSeen: number
}

const DEFAULT_WINDOW = 60 * 1000 // 1 minute in milliseconds
const DEFAULT_MAX_REQUESTS = 5 // 5 requests per minute

interface RateLimitConfig {
  window: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

/**
 * Rate limiter with sliding window algorithm
 */
class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private config: RateLimitConfig

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      window: config.window || DEFAULT_WINDOW,
      maxRequests: config.maxRequests || DEFAULT_MAX_REQUESTS,
    }
  }

  /**
   * Check if request should be rate limited
   * Returns true if request is allowed, false if rate limit exceeded
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.store.get(identifier)

    // First request or window expired
    if (!entry || now > entry.resetTime) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + this.config.window,
        lastSeen: now,
      }
      this.store.set(identifier, newEntry)

      this.cleanup(now)

      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: newEntry.resetTime,
      }
    }

    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    // Increment counter
    entry.count++
    entry.lastSeen = now
    this.store.set(identifier, entry)

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanup(now: number): void {
    // Clean up entries that haven't been seen in 2x the window time
    const staleThreshold = now - this.config.window * 2

    for (const [key, entry] of this.store.entries()) {
      if (entry.lastSeen < staleThreshold) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Get current rate limit status
   */
  getStatus(identifier: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.store.get(identifier)
    if (!entry) return null

    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    }
  }

  /**
   * Reset rate limit for identifier (for testing or manual intervention)
   */
  reset(identifier: string): void {
    this.store.delete(identifier)
  }

  /**
   * Clear all entries (for testing)
   */
  clear(): void {
    this.store.clear()
  }

  /**
   * Get store size (for monitoring)
   */
  size(): number {
    return this.store.size
  }
}

// Pre-configured rate limiters for different use cases
export const contactFormLimiter = new RateLimiter({
  window: 60 * 1000, // 1 minute
  maxRequests: 3, // 3 submissions per minute (strict for contact form)
})

export const apiLimiter = new RateLimiter({
  window: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
})

export const authLimiter = new RateLimiter({
  window: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes (for login, etc.)
})

// Export RateLimiter class for custom configurations
export { RateLimiter }
