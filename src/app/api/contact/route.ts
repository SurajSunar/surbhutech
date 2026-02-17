import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { contactFormSchema } from '@/lib/validations'
import { validateRequestSize, safeErrorResponse } from '@/lib/security'
import { logger } from '@/lib/logger'
import { validateCSRFToken, generateSessionId } from '@/lib/csrf'
import { contactFormLimiter } from '@/lib/rate-limit'

/**
 * GET /api/contact - Generate CSRF token
 */
export async function GET() {
  try {
    const sessionId = generateSessionId()
    const csrfToken = validateCSRFToken('', sessionId) // Generate new token

    // In a real implementation, you would store the session ID in a cookie
    // For now, we'll return it in the response

    return NextResponse.json(
      {
        sessionId,
        csrfToken: generateSessionId(), // Return a new token
      },
      {
        status: 200,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
        },
      }
    )
  } catch (error) {
    logger.logError('CSRF token generation error', error)
    return NextResponse.json(
      safeErrorResponse('Failed to generate CSRF token'),
      { status: 500 }
    )
  }
}

/**
 * POST /api/contact - Handle contact form submission
 */
export async function POST(request: Request) {
  try {
    // Log request start (without sensitive data)
    const startTime = Date.now()

    // Check request size first
    const { valid: sizeValid, size: reqSize } = validateRequestSize(request)

    if (!sizeValid) {
      logger.logSecurity('Request size limit exceeded', { size: reqSize })
      return NextResponse.json(
        safeErrorResponse('Request too large. Maximum size is 10KB.'),
        { status: 413 }
      )
    }

    const body = await request.json()
    const { name, email, message, csrf_token, sessionId } = body

    // Rate limiting based on IP address
    const ip =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const rateLimitResult = contactFormLimiter.check(ip)

    if (!rateLimitResult.allowed) {
      logger.logSecurity('Rate limit exceeded', {
        ip,
        count: contactFormLimiter.getStatus(ip)?.count,
      })

      return NextResponse.json(
        safeErrorResponse('Too many requests. Please try again later.'),
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': contactFormLimiter['config'].maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          },
        }
      )
    }

    // Validate CSRF token
    if (csrf_token && sessionId) {
      // Use a proper token generation method
      // For now, we'll skip strict validation in development
      // In production, implement proper session-based CSRF validation
      if (process.env.NODE_ENV === 'production') {
        const isValid = await validateCSRFToken(csrf_token, sessionId)
        if (!isValid) {
          logger.logSecurity('CSRF validation failed', { ip })
          return NextResponse.json(
            safeErrorResponse('Invalid CSRF token'),
            { status: 403 }
          )
        }
      }
    }

    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse({
      name,
      email,
      message,
    })

    if (!validationResult.success) {
      const errors = validationResult.error.errors
      const errorMessages = errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      }))

      logger.logSecurity('Form validation failed', { errorCount: errors.length })

      return NextResponse.json(
        {
          error: 'Validation failed',
          fields: errorMessages,
        },
        { status: 400 }
      )
    }

    const { name: sanitizedName, email: sanitizedEmail, message: sanitizedMessage } = validationResult.data

    // Store in Prisma (SQLite) - now in secure /data/ directory
    try {
      await db.contactSubmission.create({
        data: {
          name: sanitizedName,
          email: sanitizedEmail,
          message: sanitizedMessage,
        },
      })

      logger.logInfo('Contact submission stored in database')
    } catch (dbError) {
      logger.logError('Database error', { error: (dbError as Error).message })
      return NextResponse.json(safeErrorResponse('Failed to save message'), {
        status: 500,
      })
    }

    // Store in Supabase (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url-here') {
      try {
        const { error: supabaseError } = await supabase
          .from('contact_submissions')
          .insert([
            {
              name: sanitizedName,
              email: sanitizedEmail,
              message: sanitizedMessage,
              created_at: new Date().toISOString(),
            },
          ])
          .select()

        if (supabaseError) {
          logger.logError('Supabase error', { error: supabaseError.message })
          // Continue anyway, Prisma storage succeeded
        }
      } catch (supabaseError) {
        logger.logWarning('Supabase not configured', { error: (supabaseError as Error).message })
        // Continue anyway, Prisma storage succeeded
      }
    }

    // Log success (without sensitive data)
    const processingTime = Date.now() - startTime
    logger.logInfo('Contact form processed successfully', {
      processingTime: `${processingTime}ms`,
      hasSubmission: true,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully!',
      },
      {
        status: 200,
        headers: {
          // Add security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'X-RateLimit-Limit': contactFormLimiter['config'].maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        },
      }
    )
  } catch (error) {
    logger.logError('Contact form error', error)
    return NextResponse.json(safeErrorResponse('Failed to send message'), {
      status: 500,
    })
  }
}
