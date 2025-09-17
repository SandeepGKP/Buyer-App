import { z } from 'zod'
import {
  propertyTypes,
  bhks,
  purposes,
  cities,
  timelines,
  sources,
  statuses,
} from './schema'

// Phone validation: 10-15 digits, numeric
const phoneRegex = /^\d{10,15}$/

// Buyer schema
export const createBuyerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name must be at most 80 characters'),
    email: z.string().email('Invalid email').or(z.literal('')).optional(),
    phone: z.string().regex(phoneRegex, 'Phone must be 10-15 digits').max(15),
  city: z.enum(cities, 'Invalid city'),
  propertyType: z.enum(propertyTypes, 'Invalid property type'),
  bhk: z.enum(bhks, 'Invalid BHK').optional(),
  purpose: z.enum(purposes, 'Invalid purpose'),
  budgetMin: z.number().int().positive().optional().nullable(),
  budgetMax: z.number().int().positive().optional().nullable(),
  timeline: z.enum(timelines, 'Invalid timeline'),
  source: z.enum(sources, 'Invalid source'),
    notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
    tags: z.string().optional().transform(val => val ? val.split(',').map(t => t.trim()).filter(t => t.length > 0) : []),
  })
  .superRefine((data, ctx) => {
    // Validate budgetMin < budgetMax if both present
    if (data.budgetMin && data.budgetMax && data.budgetMin >= data.budgetMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Maximum budget must be greater than minimum budget',
        path: ['budgetMax'],
      })
    }

    // Validate bhk required if propertyType in ['Apartment', 'Villa']
    if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'BHK is required for Apartment or Villa',
        path: ['bhk'],
      })
    }
  })

// Update buyer schema (similar, but may have optional fields)
export const updateBuyerSchema = createBuyerSchema.partial().merge(
  z.object({
    id: z.string(),
    fullName: z.string().min(2).max(80).optional(),
    // other fields optional
    updatedAt: z.string().datetime().optional(),
  })
)

// CSV row schema for import
export const csvRowSchema = z
  .object({
    fullName: z.string().min(1),
    email: z.string().optional(),
    phone: z.string(),
    city: z.string(),
    propertyType: z.string(),
    bhk: z.string().optional(),
    purpose: z.string(),
    budgetMin: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    budgetMax: z.string().optional().transform(val => val ? parseInt(val) : undefined),
    timeline: z.string(),
    source: z.string(),
    notes: z.string().optional(),
    tags: z.string().optional().transform(val => val ? val.split(',').map(t => t.trim()) : []),
    status: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate phone with regex
    if (!phoneRegex.test(data.phone)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid phone format',
        path: ['phone'],
      })
    }

    // Validate enums
    if (!cities.includes(data.city as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid city',
        path: ['city'],
      })
    }

    if (!propertyTypes.includes(data.propertyType as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid property type',
        path: ['propertyType'],
      })
    }

    if (data.bhk && !bhks.includes(data.bhk as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid BHK',
        path: ['bhk'],
      })
    }

    if (!purposes.includes(data.purpose as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid purpose',
        path: ['purpose'],
      })
    }

    if (!timelines.includes(data.timeline as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid timeline',
        path: ['timeline'],
      })
    }

    if (!sources.includes(data.source as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid source',
        path: ['source'],
      })
    }

    if (data.status && !statuses.includes(data.status as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid status',
        path: ['status'],
      })
    }

    // Budget checks
    if (data.budgetMin && data.budgetMax && data.budgetMin >= data.budgetMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Max budget must be > min budget',
        path: ['budgetMax'],
      })
    }

    // BHK required for certain types
    if (['Apartment', 'Villa'].includes(data.propertyType) && !data.bhk) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'BHK required for residential',
        path: ['bhk'],
      })
    }
  })

// Export types
export type CreateBuyerInput = z.input<typeof createBuyerSchema>
export type UpdateBuyerInput = z.input<typeof updateBuyerSchema>
export type CreateBuyerOutput = z.output<typeof createBuyerSchema>
export type CsvRow = z.infer<typeof csvRowSchema>
