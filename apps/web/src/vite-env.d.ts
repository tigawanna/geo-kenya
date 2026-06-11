/// <reference types="vite/client" />

declare module "virtual:drizzle-migrations.sql" {
  const migrations: Array<{
    idx: number;
    when: number;
    tag: string;
    hash: string;
    sql: string[];
  }>;
  export default migrations;
}
