import { pgTable, uuid, text, timestamp, integer, decimal, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum("role", ["tourist", "seller", "admin"]);

export const businessTypeEnum = pgEnum("business_type", ["service", "activity", "product"]);

export const categoryEnum = pgEnum("category", [
  "Gastronomy",
  "Tours & Adventures",
  "Wellness",
  "Accommodation",
  "Transport",
  "Shopping",
]);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id:         uuid("id").primaryKey().defaultRandom(),
  name:       text("name").notNull(),
  email:      text("email").notNull().unique(),
  password:   text("password").notNull(),
  role:       roleEnum("role").notNull().default("tourist"),
  avatar:     text("avatar"),      // → CommentProps.avatar
  location:   text("location"),    // → CommentProps.location
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

// ─── Businesses ───────────────────────────────────────────────────────────────

export const businesses = pgTable("businesses", {
  id:          uuid("id").primaryKey().defaultRandom(),
  owner_id:    uuid("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name:        text("name").notNull(),
  description: text("description"),
  category:    categoryEnum("category").notNull(),
  type:        businessTypeEnum("type").notNull(),
  phone:       text("phone"),
  image_url:   text("image_url"),
  address:     text("address"),
  city:        text("city"),
  lat:         decimal("lat", { precision: 10, scale: 7 }),
  lng:         decimal("lng", { precision: 10, scale: 7 }),
  created_at:  timestamp("created_at").defaultNow().notNull(),
  updated_at:  timestamp("updated_at").defaultNow().notNull(),
});

export type Business = typeof businesses.$inferSelect;
export const insertBusinessSchema = createInsertSchema(businesses);
export const selectBusinessSchema = createSelectSchema(businesses);

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = pgTable("reviews", {
  id:          uuid("id").primaryKey().defaultRandom(),
  user_id:     uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  business_id: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  rating:      integer("rating").notNull(),
  title:       text("title"),
  body:        text("body"),
  helpful:     integer("helpful").notNull().default(0),
  created_at:  timestamp("created_at").defaultNow().notNull(),
  updated_at:  timestamp("updated_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export const insertReviewSchema = createInsertSchema(reviews);
export const selectReviewSchema = createSelectSchema(reviews);

// ─── Favorites ────────────────────────────────────────────────────────────────

export const favorites = pgTable("favorites", {
  id:          uuid("id").primaryKey().defaultRandom(),
  user_id:     uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  business_id: uuid("business_id").notNull().references(() => businesses.id, { onDelete: "cascade" }),
  created_at:  timestamp("created_at").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export const insertFavoriteSchema = createInsertSchema(favorites);
export const selectFavoriteSchema = createSelectSchema(favorites);

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  businesses: many(businesses),
  reviews:    many(reviews),
  favorites:  many(favorites),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner:     one(users,     { fields: [businesses.owner_id], references: [users.id] }),
  reviews:   many(reviews),
  favorites: many(favorites),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user:     one(users,      { fields: [reviews.user_id],     references: [users.id] }),
  business: one(businesses, { fields: [reviews.business_id], references: [businesses.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user:     one(users,      { fields: [favorites.user_id],     references: [users.id] }),
  business: one(businesses, { fields: [favorites.business_id], references: [businesses.id] }),
}));