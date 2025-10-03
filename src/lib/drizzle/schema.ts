import { sqliteTable, integer, text, blob, real } from "drizzle-orm/sqlite-core";
import { InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import { multiPolygon } from "./drizzlespatialite-types";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { WardChangesType } from "../pb/types/extra-types";

export const kenyaWards = sqliteTable("kenya_wards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  wardCode: text("ward_code"),
  ward: text("ward").notNull(),
  county: text("county").notNull(),
  countyCode: integer("county_code"),
  subCounty: text("sub_county"),
  constituency: text("constituency").notNull(),
  constituencyCode: integer("constituency_code"),

  // ✅ Use REAL for bounding box — matches SQLite column type
  minX: real("minx"),
  minY: real("miny"),
  maxX: real("maxx"),
  maxY: real("maxy"),

  // ✅ Use BLOB for geometry — Spatialite stores WKB as BLOB
  geom: multiPolygon("geom"), // ← this is correct for WKB geometry
});

// export const country = sqliteTable("kenya_country", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   shapeName: text("shape_name").notNull(),
//   shapeIso: text("shape_iso").notNull(),
//   shapeId: text("shape_id"),
//   shapeGroup: text("shape_group"),
//   shapeType: text("shape_type"),
//   geom: multiPolygon("geom"), // ← WKB geometry for country borders
// });

export const wardEvents = sqliteTable("kenya_ward_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventSource: text("trigger_by", { enum: ["REPLAY", "TRIGGER"] }), // Identifies which client triggered the event
  eventType: text("event_type", { enum: ["INSERT", "UPDATE", "DELETE"] }).notNull(),
  wardId: integer("ward_id"), // NULL for INSERT events (before ID assigned)
  wardCode: text("ward_code"), // For tracking even when ID changes
  oldData: text("old_data"), // JSON of previous row data (NULL for INSERT)
  newData: text("new_data"), // JSON of new row data (NULL for DELETE)
  timestamp: text("timestamp")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  syncStatus: text("sync_status", { enum: ["PENDING", "SYNCED", "FAILED"] })
    .notNull()
    .default("PENDING"),
  syncAttempts: integer("sync_attempts").notNull().default(0),
  lastSyncAttempt: text("last_sync_attempt"),
  errorMessage: text("error_message"),
  clientId: text("client_id"), // Identifies which client created the event
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Drizzle table schema with custom type for data array
export const wardUpdates = sqliteTable("kenya_ward_updates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  version: integer("version").notNull(),
  data: text("data").$type<WardChangesType>().notNull(), // Custom type for JSON array
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
  description: text("description"),
});

export interface WardUpdateData {
  id: number; // ward id
  data: Partial<KenyaWardsSelect>; // partial object of updated row
  event: "CREATE" | "UPDATE" | "DELETE";
}

// Infer the select types
// export type CountrySelect = InferSelectModel<typeof country>;
export type KenyaWardsSelect = InferSelectModel<typeof kenyaWards>;
export type KenyaWardsInsert = InferSelectModel<typeof kenyaWards>;
export type WardEventsSelect = InferSelectModel<typeof wardEvents>;
export type WardUpdatesSelect = InferSelectModel<typeof wardUpdates>;

export type WardUpdatesInsert = InferInsertModel<typeof wardUpdates>;

export const WardsZodSchema = createInsertSchema(kenyaWards).extend({
  id: z.number().int().positive().optional(),
});

export const WardUpdateZodSchema = z.object({
  id: z.number().int().positive(),
  data: WardsZodSchema.partial(),
  event: z.enum(["CREATE", "UPDATE", "DELETE"]),
});

export const wardUpdatesDataCodec = z.codec(
  WardUpdateZodSchema.array(), // output schema: Date object
  z.string(), // input schema:  string
  {
    decode: (dataAsArrayOfObject) => JSON.stringify(dataAsArrayOfObject),
    encode: (dataAsString) => JSON.parse(dataAsString),
  }
);

export const WardUpdatesZodSchema = createInsertSchema(wardUpdates).extend({
  data: wardUpdatesDataCodec,
});

export const WardsSnakeCaseZodSchema = WardsZodSchema.extend({
  ward_code: z.string().optional().nullable(),
  county_code: z.number().int().optional().nullable(),
  sub_county: z.string().optional().nullable(),
  constituency_code: z.number().int().optional().nullable(),
  min_x: z.number().optional().nullable(),
  min_y: z.number().optional().nullable(),
  max_x: z.number().optional().nullable(),
  max_y: z.number().optional().nullable(),
});
export const wardDataPayload = z.codec(
  z.string(), // input schema: ISO date string
  WardsSnakeCaseZodSchema.partial(), // output schema: Date object
  {
    decode: (dataAsString) => JSON.parse(dataAsString), // ISO string → Date
    encode: (dataAsObject) => JSON.stringify(dataAsObject), // Date → ISO string
  }
);
export const wardEventType = z.codec(
  z.enum(["CREATE", "UPDATE", "DELETE"]), // input schema: ISO date string
  z.array(z.enum(["CREATE", "UPDATE", "DELETE"])), // output schema: Date object
  {
    decode: (str) => [str], // ISO string → Date
    encode: (strArr) => strArr[0], // Date → ISO string
  }
);
