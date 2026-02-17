/**
 * Secure Logger
 * Logs security events without exposing sensitive information
 */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
}

interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  metadata?: Record<string, any>
}

class SecureLogger {
  private logs: LogEntry[] = []

  /**
   * Log security event without sensitive data
   */
  logSecurity(message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.SECURITY,
      message,
      metadata: {
        ...metadata,
        // Never log actual credentials
        // Only log that an event occurred
      },
    }

    this.logs.push(entry)
    this.outputToConsole(entry)
  }

  /**
   * Log info event
   */
  logInfo(message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.INFO,
      message,
      metadata,
    }

    this.logs.push(entry)
    this.outputToConsole(entry)
  }

  /**
   * Log warning
   */
  logWarning(message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.WARN,
      message,
      metadata,
    }

    this.logs.push(entry)
    this.outputToConsole(entry)
  }

  /**
   * Log error
   */
  logError(message: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level: LogLevel.ERROR,
      message,
      metadata,
    }

    this.logs.push(entry)
    this.outputToConsole(entry)
  }

  /**
   * Output to console (without sensitive data in production)
   */
  private outputToConsole(entry: LogEntry) {
    const isProduction = process.env.NODE_ENV === 'production'
    
    // In production, only log security events to prevent information leakage
    if (isProduction && entry.level !== LogLevel.SECURITY) {
      return
    }

    const prefix = {
      [LogLevel.SECURITY]: '🔴',
      [LogLevel.ERROR]: '❌',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.INFO]: 'ℹ️',
    }[entry.level]

    const metadataStr = entry.metadata 
      ? Object.entries(entry.metadata)
          .filter(([_, value]) => !this.isSensitive(value))
          .map(([key, value]) => `${key}: ${this.sanitizeValue(value)}`)
          .join(', ')
      : ''

    console.log(`${prefix} ${entry.timestamp.toISOString()} [${entry.level}] ${entry.message}${metadataStr ? ` | ${metadataStr}` : ''}`)
  }

  /**
   * Check if value contains sensitive data
   */
  private isSensitive(value: any): boolean {
    const sensitivePatterns = [
      /password/i,
      /secret/i,
      /key/i,
      /token/i,
      /credential/i,
      /api[_-]?key/i,
      /auth/i,
    ]

    if (typeof value === 'string') {
      return sensitivePatterns.some(pattern => pattern.test(value))
    }

    if (typeof value === 'object') {
      const strValue = JSON.stringify(value)
      return sensitivePatterns.some(pattern => pattern.test(strValue))
    }

    return false
  }

  /**
   * Sanitize value for logging (hide partial sensitive data)
   */
  private sanitizeValue(value: any): string {
    if (typeof value === 'string') {
      // For strings, show first 2 chars of password/key/token
      if (this.isSensitive(value)) {
        return value.substring(0, 2) + '***'
      }
      return value
    }
    
    if (typeof value === 'object') {
      // For objects, recursively sanitize
      const sanitized: Record<string, any> = {}
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.sanitizeValue(val)
      }
      return JSON.stringify(sanitized)
    }
    
    return String(value)
  }

  /**
   * Get all logs (for debugging)
   */
  getLogs(): LogEntry[] {
    return this.logs
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = []
  }
}

// Export singleton instance
export const logger = new SecureLogger()
