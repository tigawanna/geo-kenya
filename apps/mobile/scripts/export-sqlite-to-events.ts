import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

type WardRow = {
  id: number;
  ward_code: string | null;
  ward: string;
  county: string;
  county_code: number | null;
  sub_county: string | null;
  constituency: string;
  constituency_code: number | null;
  minx: number | null;
  miny: number | null;
  maxx: number | null;
  maxy: number | null;
  geom: string | null;
};

const ROOT = resolve(__dirname, "..");
const DB = resolve(ROOT, "assets/geo_kenya.db");
const OUTPUT = resolve(ROOT, "assets/data/kenya-events.json");
const DEVICE_ID = "geo-kenya-sqlite-export";
const BATCH_SIZE = 50;

function stableId(parts: string[]): string {
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 32);
}

function rowToEvent(row: WardRow) {
  const rowId = String(row.id);
  return {
    id: stableId(["kenya_wards", rowId, "create"]),
    deviceId: DEVICE_ID,
    table: "kenya_wards",
    rowId,
    action: "create" as const,
    createdAt: new Date().toISOString(),
    payload: {
      wardCode: row.ward_code,
      ward: row.ward,
      county: row.county,
      countyCode: row.county_code,
      subCounty: row.sub_county,
      constituency: row.constituency,
      constituencyCode: row.constituency_code,
      minX: row.minx,
      minY: row.miny,
      maxX: row.maxx,
      maxY: row.maxy,
      geom: row.geom,
    },
  };
}

function fetchBatch(afterId: number): WardRow[] {
  const sql = `
SELECT
  id,
  ward_code,
  ward,
  county,
  county_code,
  sub_county,
  constituency,
  constituency_code,
  minx,
  miny,
  maxx,
  maxy,
  hex(geom) AS geom
FROM kenya_wards
WHERE id > ${afterId}
ORDER BY id
LIMIT ${BATCH_SIZE}
`.trim();

  const raw = execFileSync("sqlite3", ["-json", DB, sql], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });

  if (!raw.trim()) {
    return [];
  }

  return JSON.parse(raw) as WardRow[];
}

function main() {
  const events = [];
  let afterId = 0;

  while (true) {
    const batch = fetchBatch(afterId);
    if (batch.length === 0) {
      break;
    }
    events.push(...batch.map(rowToEvent));
    afterId = batch[batch.length - 1].id;
  }

  if (events.length === 0) {
    throw new Error("No rows found in kenya_wards");
  }

  const output = {
    version: 1,
    format: "geo-kenya-sync-events-seed",
    generatedAt: new Date().toISOString(),
    events,
  };

  writeFileSync(OUTPUT, `${JSON.stringify(output)}\n`, "utf8");
  process.stdout.write(`[export-sqlite-to-events] wrote ${events.length} events to ${OUTPUT}\n`);
}

main();
