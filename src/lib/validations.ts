import { z } from 'zod'

/**
 * Contact form validation schema with Zod
 * Provides comprehensive input validation with proper error messages
 */

export const contactFormSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be less than 100 characters' })
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, { message: 'Name can only contain letters, spaces, hyphens, and apostrophes' }),
  
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .min(5, { message: 'Email must be at least 5 characters' })
    .max(255, { message: 'Email must be less than 255 characters' })
    .toLowerCase()
    .trim(),
  
  message: z
    .string({ required_error: 'Message is required' })
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(1000, { message: 'Message must be less than 1000 characters' })
    .trim()
    .regex(/^[a-zA-Z0-9\s!?.,'"()]*$/, { message: 'Message contains invalid characters' }),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
