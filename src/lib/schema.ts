import { sqliteTable, text, integer, customType } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

// TODO: Add auth tables when implementing authentication
// Currently using demo user ID system

// SQLite UUID type with default
const sqliteUuid = customType<{ data: string }>({
  dataType() {
    return 'text';
  },
});

/** SQL for UUID generation in SQLite */
const sqliteUUID =
  "lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-' || '4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))";

// Enums for buyers
export const propertyTypes = ['Apartment', 'Villa', 'Plot', 'Office', 'Retail'] as const;

export const bhks = ['1', '2', '3', '4', 'Studio'] as const;

export const purposes = ['Buy', 'Rent'] as const;

export const cities = ['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula', 'Other'] as const;

export const timelines = ['0-3m', '3-6m', '>6m', 'Exploring'] as const;

export const sources = ['Website', 'Referral', 'Walk-in', 'Call', 'Other'] as const;

export const statuses = ['New', 'Qualified', 'Contacted', 'Visited', 'Negotiation', 'Converted', 'Dropped'] as const;

export const buyers = sqliteTable('buyers', {
  id: text('id').primaryKey().default(sql`(${sql.raw(sqliteUUID)})`),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  propertyType: text('property_type').notNull(),
  bhk: text('bhk'),
  purpose: text('purpose').notNull(),
  budgetMin: integer('budget_min'),
  budgetMax: integer('budget_max'),
  timeline: text('timeline').notNull(),
  source: text('source').notNull(),
  status: text('status').notNull().default('New'),
  notes: text('notes'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
  ownerId: text('owner_id').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).$onUpdateFn(() => new Date()),
});

// TypeScript type for buyers
export type Buyer = {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  city: string;
  propertyType: string;
  bhk?: string;
  purpose: string;
  budgetMin?: number;
  budgetMax?: number;
  timeline: string;
  source: string;
  status: string;
  notes?: string;
  tags: string[];
  ownerId: string;
  createdAt: number;
  updatedAt: number;
};

// Buyer history table
export const buyerHistory = sqliteTable('buyer_history', {
  id: text('id').primaryKey().default(sql`(${sql.raw(sqliteUUID)})`),
  buyerId: text('buyer_id').notNull().references(() => buyers.id, { onDelete: 'cascade' }),
  changedBy: text('changed_by').notNull(),
  changedAt: integer('changed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  diff: text('diff', { mode: 'json' }).$type<Record<string, { old: unknown; new: unknown }>>().notNull(),
});

// Relations (optional)
export const buyersRelations = relations(buyers, ({ many }) => ({
  history: many(buyerHistory),
}));

export const buyerHistoryRelations = relations(buyerHistory, ({ one }) => ({
  buyer: one(buyers, {
    fields: [buyerHistory.buyerId],
    references: [buyers.id],
  }),
}));
