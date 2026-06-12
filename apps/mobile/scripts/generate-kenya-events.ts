import { createHash, randomUUID } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

type GeoJsonFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

type GeoJsonCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

const ROOT = resolve(__dirname, "..");
const INPUT = resolve(ROOT, "assets/data/kenya-wards.geojson");
const OUTPUT = resolve(ROOT, "assets/data/kenya-events.json");
const DEVICE_ID = "geo-kenya-seed-generator";

function stableId(parts: string[]): string {
  return createHash("sha256").update(parts.join(":")).digest("hex").slice(0, 32);
}

function readGeoJson(path: string): GeoJsonCollection {
  const raw = readFileSync(path, "utf8");
  const parsed = JSON.parse(raw) as GeoJsonCollection;
  if (!parsed.features?.length) {
    throw new Error(`No features found in ${path}`);
  }
  return parsed;
}

function featureToEvent(feature: GeoJsonFeature, index: number) {
  const props = feature.properties ?? {};
  const rowId = String(props.id ?? props.ward_id ?? props.WARD_ID ?? index + 1);
  const eventId = stableId(["kenya_wards", rowId, "create"]);

  return {
    id: eventId,
    deviceId: DEVICE_ID,
    table: "kenya_wards",
    rowId,
    action: "create" as const,
    createdAt: new Date().toISOString(),
    payload: {
      wardCode: props.ward_code ?? props.WARD_CODE ?? props.code ?? null,
      ward: String(props.ward ?? props.WARD ?? props.name ?? `Ward ${rowId}`),
      county: String(props.county ?? props.COUNTY ?? "Unknown"),
      countyCode: props.county_code ?? props.COUNTY_CODE ?? null,
      subCounty: props.sub_county ?? props.SUB_COUNTY ?? null,
      constituency: String(props.constituency ?? props.CONSTITUENCY ?? "Unknown"),
      constituencyCode: props.constituency_code ?? props.CONSTITUENCY_CODE ?? null,
      minX: props.minx ?? props.min_x ?? null,
      minY: props.miny ?? props.min_y ?? null,
      maxX: props.maxx ?? props.max_x ?? null,
      maxY: props.maxy ?? props.max_y ?? null,
      geom: JSON.stringify(feature.geometry),
    },
  };
}

function main() {
  const collection = readGeoJson(INPUT);
  const events = collection.features.map(featureToEvent);

  const output = {
    version: 1,
    format: "geo-kenya-sync-events-seed",
    generatedAt: new Date().toISOString(),
    events,
  };

  writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`[generate-kenya-events] wrote ${events.length} events to ${OUTPUT}`);
  console.log(`[generate-kenya-events] run id: ${randomUUID()}`);
}

main();
