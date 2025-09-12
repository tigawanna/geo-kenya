import { sqliteTable, integer, text,blob } from "drizzle-orm/sqlite-core";
import { geometry } from "./drizzlespatialite-types";
import { sql } from "drizzle-orm";

export const kenyaWards = sqliteTable("kenya_wards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wardCode: text("ward_code"),
  ward: text("ward").notNull(),
  county: text("county").notNull(),
  countyCode: integer("county_code"),
  subCounty: text("sub_county"),
  constituency: text("constituency").notNull(),
  constituencyCode: integer("constituency_code"),
  geom: geometry("geom"),
});



export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title'),
  content: text('content').notNull(),
  contentHtml: text('content_html'),
  type: text('type').default('note').notNull(),
  status: text('status').default('active'),
  tags: text('tags'),
  meta: text('metadata', { mode: 'json' }),
  imagePath: text('image_path'),
  imageBlob: blob('image_blob'), // BLOB for storing images directly
  priority: integer('priority').default(0),
  lastViewed: text('last_viewed'),
  reminderAt: text('reminder_at'),
  completedAt: text('completed_at'),
  dueDate: text('due_date'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  // Spatial column (will be populated by Spatialite)
  locationPoint: text('location_point'), // Added by AddGeometryColumn
});
