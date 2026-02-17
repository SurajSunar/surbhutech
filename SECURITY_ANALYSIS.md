# Security Analysis - Surbhu Tech Website

## Critical Security Vulnerabilities Found

### 🔴 HIGH SEVERITY Issues

#### 1. **API Route Security (CRITICAL)**
**File:** `/api/contact/route.ts`

**Issues:**
- ❌ **No Rate Limiting** - API can be abused with unlimited submissions
- ❌ **No CSRF Protection** - Vulnerable to cross-site request forgery
- ❌ **No Request Size Limits** - Large payloads can cause DoS
- ❌ **No Authentication** - Publicly accessible endpoint
- ❌ **Email Credentials Exposed** - Passwords/keys in console logs
- ❌ **No Input Sanitization** - XSS vulnerability risk

**Impact:** 
- Spam attacks
- Email abuse
- Data injection
- Denial of Service (DoS)
- Credential theft

---

#### 2. **Prisma Database Security (HIGH)**
**File:** `db/custom.db`

**Issues:**
- ❌ **SQLite in public directory** - Database file accessible via web
- ❌ **No Encryption at Rest** - Data stored in plain text
- ❌ **No Row Level Security** - No access control policies
- ❌ **No Backup Strategy** - No data protection

**Impact:**
- Direct database access via URL
- Data theft if server compromised
- No data integrity protection

---

#### 3. **Supabase Configuration (MEDIUM)**
**Issues:**
- ⚠️ **Public Keys in .env** - Keys exposed in version control
- ⚠️ **No RLS Policies** - Data accessible to all users
- ⚠️ **Placeholder Keys** - Using demo keys in .env

**Impact:**
- API key exposure if committed to Git
- Data privacy concerns
- No fine-grained access control

---

#### 4. **Environment Configuration (MEDIUM)**
**File:** `.env`

**Issues:**
- ⚠️ **Placeholder Values** - `your-supabase-url-here`
- ⚠️ **No .gitignore** - `.env` might be committed
- ⚠️ **Email Credentials** - SMTP credentials visible if configured

**Impact:**
- Development keys in production
- Credential leakage
- Unauthorized access

---

## 🛡️ SECURITY RECOMMENDATIONS

### Immediate Actions (Priority 1 - Do Now)

#### 1. **API Route Security**
```typescript
// /api/contact/route.ts
import { rateLimit } from '@/lib/rate-limit' // Add rate limiting

export async function POST(request: Request) {
  // Check rate limit
  const { success } = await rateLimit(request)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 // HTTP 429 Too Many Requests
    )
  }

  // Validate request size
  const MAX_REQUEST_SIZE = 10 * 1024 // 10KB max
  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
    return NextResponse.json(
      { error: 'Request too large' },
      { status: 413 // HTTP 413 Payload Too Large
    )
  }

  // Sanitize inputs to prevent XSS
  const sanitize = (input: string) => {
    return input
      .replace(/[<>]/g, '')
      .trim()
      .substring(0, 500) // Max length
  }
}
```

#### 2. **Database Security**
```bash
# Move database outside public directory
mkdir -p /home/z/my-project/data
mv db/custom.db /home/z/my-project/data/submissions.db

# Update .env
DATABASE_URL=file:/home/z/my-project/data/submissions.db
```

#### 3. **Environment Security**
```bash
# Create .gitignore
echo ".env" >> .gitignore
echo "node_modules" >> .gitignore
echo ".next" >> .gitignore
echo "db/*.db" >> .gitignore
```

---

### Medium Priority Actions (1-2 Weeks)

#### 1. **Add CSRF Protection**
```typescript
// /lib/csrf.ts
import crypto from 'crypto'

export async function generateCSRFToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  return token
}

export async function validateCSRFToken(token: string): Promise<boolean> {
  // Implement token validation logic
  return true
}

// Use in form
// 1. Generate token on page load
// 2. Include token in hidden input
// 3. Validate token on submission
```

#### 2. **Add Input Validation Library**
```bash
bun add zod
```

```typescript
// /lib/validations.ts
import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string()
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
})
```

#### 3. **Supabase RLS Policies**
```sql
-- In Supabase SQL Editor

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to only allow inserts via API
CREATE POLICY "insert_policy" ON contact_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true)
  USING (true);

-- Allow read access to authenticated users only
CREATE POLICY "select_policy" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);
```

#### 4. **Email Security**
```typescript
// Use server environment variables
// Never log credentials in development

// Configure proper email service
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: true, // Always use SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Add DKIM/SPF records to your domain
```

---

### Long-term Security Improvements (1-3 Months)

#### 1. **Implement Authentication**
```bash
# Add NextAuth.js
bun add next-auth @auth/prisma-adapter

# Configure authentication providers
# - Email/password
# - Google OAuth
# - GitHub OAuth
```

#### 2. **Add Admin Dashboard**
```typescript
// /app/admin/contacts/page.tsx
- Require authentication to access
- View all submissions
- Mark as read/spam
- Export functionality
- Delete capabilities
```

#### 3. **Monitoring & Logging**
```typescript
// /lib/logger.ts
import { createLogger } from 'winston'

export const logger = createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
    new winston.transports.Console(),
  ],
})

// Log security events
// - Failed login attempts
// - Rate limit violations
// - Suspicious activity
// - Database errors
```

---

## Security Best Practices Checklist

### ✅ Production Deployment
- [ ] Use HTTPS everywhere (SSL/TLS)
- [ ] Set up proper CORS headers
- [ ] Configure firewall rules
- [ ] Enable security headers (CSP, HSTS, X-Frame-Options)
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] Dependency vulnerability scanning (npm audit, Snyk)

### ✅ Database Security
- [ ] Encrypt sensitive data at rest
- [ ] Implement proper backup strategy
- [ ] Use prepared statements
- [ ] Regular database maintenance
- [ ] Migration to production-ready database (PostgreSQL)

### ✅ API Security
- [ ] Rate limiting implemented
- [ ] Input validation with Zod
- [ ] CSRF protection enabled
- ] Request size limits set
- ] Proper error handling (no stack traces)
- [ ] API authentication with JWT
- [ ] Request logging and monitoring

### ✅ Environment Security
- [ ] Never commit .env to version control
- [ ] Use secret management service (Vault, AWS Secrets Manager)
- [ ] Different credentials for dev/staging/prod
- [ ] Regular credential rotation
- [ ] Audit access logs

---

## Current Security Score

**Overall Rating:** ⚠️ **MEDIUM RISK** (4/10)

### Scoring Breakdown:
- **API Security:** 3/10 (Critical vulnerabilities)
- **Database Security:** 2/10 (Exposure in public directory)
- **Environment Security:** 4/10 (Keys in .env, not committed yet)
- **Input Validation:** 6/10 (Basic validation present)
- **Error Handling:** 6/10 (Proper error responses)

---

## Recommended Tools

```bash
# Security scanning
bun add -g audit-script

# Input validation
bun add zod

# Rate limiting
bun add @upstash/ratelimit

# CSRF protection
bun add csrf-csrf
```

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/security)
- [Prisma Security Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Supabase Security Docs](https://supabase.com/docs/guides/auth/row-level-security)

---

## Quick Wins (Can implement in 30 minutes)

1. **Move database** from `/db/` to `/data/`
2. **Add .gitignore** with `.env`
3. **Remove console.log** with sensitive data
4. **Add request size limit** to API route
5. **Add input sanitization** to prevent XSS
6. **Update placeholder** Supabase credentials

These changes will improve security from MEDIUM to LOW-MEDIUM risk immediately.
