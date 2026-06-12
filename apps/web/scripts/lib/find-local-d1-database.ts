import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walkSqlite(dir: string): string | null {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      const nested = walkSqlite(fullPath);
      if (nested) {
        return nested;
      }
      continue;
    }
    if (entry.endsWith(".sqlite") && entry !== "metadata.sqlite") {
      return fullPath;
    }
  }
  return null;
}

export function findLocalD1Database(appRoot: string): string | null {
  const d1Root = join(appRoot, ".wrangler/state/v3/d1");
  try {
    return walkSqlite(d1Root);
  } catch {
    return null;
  }
}
