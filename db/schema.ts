import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// API Key usage statistics table
export const apiKeyStats = pgTable('api_key_stats', {
  id: serial('id').primaryKey(),
  apiKey: text('api_key').notNull().unique(),
  totalCalls: integer('total_calls').notNull().default(0),
  successfulCalls: integer('successful_calls').notNull().default(0),
  remainingCalls: integer('remaining_calls').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Site statistics table (from your reference code)
export const siteStats = pgTable('site_stats', {
  id: serial('id').primaryKey(),
  totalGenerations: integer('total_generations').notNull().default(0),
  dailyGenerations: integer('daily_generations').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}); 