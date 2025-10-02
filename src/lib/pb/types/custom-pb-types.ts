import { KenyaWardsSelect, WardEventsSelect } from "@/lib/drizzle/schema";
import { CamelToSnakeKeys } from "@/utils/types";

export type WardItem = CamelToSnakeKeys<KenyaWardsSelect>;

// === start of custom type ===
// WardsEvents.WardsEventsOld_data.old_data
export type WardsEventsOld_data = Array<WardItem>;
// === end of custom type ===
// === start of custom type ===
// Wards.WardsData.data
export type WardsData = Array<WardItem>;
// === end of custom type ===
// === start of custom type ===
// WardsUpdates.WardsUpdatesData.data
export type WardsUpdatesData = { changes: Array<WardItem> };
// === end of custom type ===
