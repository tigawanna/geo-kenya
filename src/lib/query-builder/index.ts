import { TableSchema, SelectBuilder, UpdateBuilder, InsertBuilder } from './types';

function escapeValue(value: any): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
  if (typeof value === 'number') return value.toString();
  return `'${String(value)}'`;
}

class SelectBuilderImpl<T extends TableSchema> implements SelectBuilder<T> {
  private columns: string = '*';
  private tableName: string = '';
  private whereClause: string = '';
  private orderClause: string = '';
  private limitClause: string = '';

  constructor(columns?: (keyof T)[]) {
    if (columns) {
      this.columns = columns.map(col => String(col)).join(', ');
    }
  }

  from(table: string): SelectBuilder<T> {
    this.tableName = table;
    return this;
  }

  where(condition: string): SelectBuilder<T> {
    this.whereClause = `WHERE ${condition}`;
    return this;
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): SelectBuilder<T> {
    this.orderClause = `ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number): SelectBuilder<T> {
    this.limitClause = `LIMIT ${count}`;
    return this;
  }

  build(): string {
    return [
      `SELECT ${this.columns}`,
      `FROM ${this.tableName}`,
      this.whereClause,
      this.orderClause,
      this.limitClause
    ].filter(Boolean).join(' ');
  }
}

class UpdateBuilderImpl<T extends TableSchema> implements UpdateBuilder<T> {
  private tableName: string;
  private setClause: string;
  private whereClause: string = '';

  constructor(tableName: string, data: Partial<T>) {
    this.tableName = tableName;
    const setPairs = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = ${escapeValue(value)}`);
    this.setClause = `SET ${setPairs.join(', ')}`;
  }

  where(condition: string): UpdateBuilder<T> {
    this.whereClause = `WHERE ${condition}`;
    return this;
  }

  build(): string {
    return [
      `UPDATE ${this.tableName}`,
      this.setClause,
      this.whereClause
    ].filter(Boolean).join(' ');
  }
}

class InsertBuilderImpl<T extends TableSchema> implements InsertBuilder<T> {
  private tableName: string = '';
  private data: T;

  constructor(data: T) {
    this.data = data;
  }

  into(table: string): InsertBuilder<T> {
    this.tableName = table;
    return this;
  }

  build(): string {
    const columns = Object.keys(this.data).join(', ');
    const values = Object.values(this.data).map(escapeValue).join(', ');
    return `INSERT INTO ${this.tableName} (${columns}) VALUES (${values})`;
  }
}

export function createQueryBuilder<T extends TableSchema>(tableName: string) {
  return {
    select: (columns?: (keyof T)[]) => new SelectBuilderImpl<T>(columns).from(tableName),
    update: (data: Partial<T>) => new UpdateBuilderImpl<T>(tableName, data),
    insert: (data: T) => new InsertBuilderImpl<T>(data).into(tableName)
  };
}