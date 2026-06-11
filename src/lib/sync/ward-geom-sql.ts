export function isWkbHex(value: string): boolean {
  return /^[0-9a-fA-F]+$/.test(value);
}

function isSpatialiteBlob(hex: string): boolean {
  return (
    hex.length >= 4 &&
    hex.slice(0, 2) === "00" &&
    hex.slice(-2).toLowerCase() === "fe"
  );
}

export function buildGeomSqlFragment(geom: string | null | undefined): string {
  if (!geom) {
    return "NULL";
  }

  const trimmed = geom.trim();

  if (trimmed.startsWith("{")) {
    const escaped = trimmed.replace(/'/g, "''");
    return `SetSrid(GeomFromGeoJSON('${escaped}'), 4326)`;
  }

  if (isWkbHex(trimmed)) {
    if (isSpatialiteBlob(trimmed)) {
      return `SetSrid(x'${trimmed}', 4326)`;
    }
    return `SetSrid(GeomFromWKB(x'${trimmed}'), 4326)`;
  }

  return "NULL";
}
