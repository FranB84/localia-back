import { pgTable, uuid, text, timestamp, integer} from "drizzle-orm/pg-core";

import {relations} from "drizzle-orm";

import {createInsertSchema, createSelectSchema} from "drizzle-zod";

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull()
});


// Define relations


// Infer types
export type User = typeof users.$inferSelect;


// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);


export const selectUserSchema = createSelectSchema(users);
