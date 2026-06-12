import migrationsBundle from "@/drizzle/migrations";
import { db } from "@/lib/drizzle/client";
import { sql } from "drizzle-orm";

type JournalEntry = {
  idx: number;
  when: number;
  tag: string;
  breakpoints: boolean;
};

const MIGRATIONS_TABLE = "__drizzle_migrations";

async function ensureMigrationsTable(): Promise<void> {
  await db.run(sql.raw(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash text NOT NULL,
      created_at numeric
    )
  `));
}

async function getLatestMigrationTimestamp(): Promise<number | null> {
  const rows = await db.all<{ created_at: number }>(
    sql.raw(`SELECT created_at FROM ${MIGRATIONS_TABLE} ORDER BY created_at DESC LIMIT 1`),
  );
  return rows[0]?.created_at ?? null;
}

async function tableExists(tableName: string): Promise<boolean> {
  const rows = await db.all<{ name: string }>(
    sql.raw(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name = '${tableName.replace(/'/g, "''")}' LIMIT 1`,
    ),
  );
  return rows.length > 0;
}

async function recordMigration(entry: JournalEntry): Promise<void> {
  const existing = await db.all<{ created_at: number }>(
    sql.raw(
      `SELECT created_at FROM ${MIGRATIONS_TABLE} WHERE created_at = ${entry.when} LIMIT 1`,
    ),
  );
  if (existing.length > 0) {
    return;
  }

  await db.run(
    sql`INSERT INTO ${sql.raw(MIGRATIONS_TABLE)} (hash, created_at) VALUES (${entry.tag}, ${entry.when})`,
  );
}

function splitMigrationSql(migrationSql: string): string[] {
  return migrationSql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

function isBenignMigrationError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("duplicate column") ||
    lower.includes("duplicate column name")
  );
}

async function runStatement(statement: string): Promise<void> {
  try {
    await db.run(sql.raw(statement));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (isBenignMigrationError(message)) {
      return;
    }
    throw err;
  }
}

async function stampMigrationsForExistingSchema(entries: JournalEntry[]): Promise<void> {
  const hasKenyaWards = await tableExists("kenya_wards");
  if (!hasKenyaWards) {
    return;
  }

  const latest = await getLatestMigrationTimestamp();
  if (latest !== null) {
    return;
  }

  for (const entry of entries) {
    await recordMigration(entry);
  }
}

export async function runMigrations(): Promise<void> {
  await ensureMigrationsTable();

  const journal = migrationsBundle.journal as { entries: JournalEntry[] };
  const migrationFiles = migrationsBundle.migrations as Record<string, string>;

  await stampMigrationsForExistingSchema(journal.entries);

  const latest = await getLatestMigrationTimestamp();

  for (const entry of journal.entries) {
    if (latest !== null && latest >= entry.when) {
      continue;
    }

    const key = `m${entry.idx.toString().padStart(4, "0")}`;
    const migrationSql = migrationFiles[key];
    if (!migrationSql) {
      throw new Error(`Missing migration: ${entry.tag}`);
    }

    if (entry.tag === "0000_initial" && (await tableExists("kenya_wards"))) {
      await recordMigration(entry);
      continue;
    }

    const statements = splitMigrationSql(migrationSql);
    for (const statement of statements) {
      await runStatement(statement);
    }

    await recordMigration(entry);
  }
}
