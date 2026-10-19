import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  prompt: text("prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  model: varchar("model", { length: 100 }).notNull().default("cogvideox-5b"),
  duration: integer("duration").notNull().default(8), // in seconds, up to 480 (8 min)
  resolution: varchar("resolution", { length: 20 }).notNull().default("1080p"),
  aspectRatio: varchar("aspect_ratio", { length: 10 }).notNull().default("16:9"),
  motionStrength: integer("motion_strength").notNull().default(50),
  seed: integer("seed"),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, processing, completed, failed
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  replicateId: varchar("replicate_id", { length: 255 }),
  error: text("error"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Generation = typeof generations.$inferSelect;
export type NewGeneration = typeof generations.$inferInsert;
