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
    sql.raw(
      `SELECT created_at FROM ${MIGRATIONS_TABLE} ORDER BY created_at DESC LIMIT 1`,
    ),
  );
  return rows[0]?.created_at ?? null;
}

function splitMigrationSql(migrationSql: string): string[] {
  return migrationSql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

export async function runMigrations(): Promise<void> {
  await ensureMigrationsTable();

  const latest = await getLatestMigrationTimestamp();
  const journal = migrationsBundle.journal as { entries: JournalEntry[] };
  const migrationFiles = migrationsBundle.migrations as Record<string, string>;

  for (const entry of journal.entries) {
    if (latest !== null && latest >= entry.when) {
      continue;
    }

    const key = `m${entry.idx.toString().padStart(4, "0")}`;
    const migrationSql = migrationFiles[key];
    if (!migrationSql) {
      throw new Error(`Missing migration: ${entry.tag}`);
    }

    const statements = splitMigrationSql(migrationSql);
    for (const statement of statements) {
      await db.run(sql.raw(statement));
    }

    await db.run(
      sql`INSERT INTO ${sql.raw(MIGRATIONS_TABLE)} (hash, created_at) VALUES (${""}, ${entry.when})`,
    );
  }
}
