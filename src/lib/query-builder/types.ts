export type TableSchema = Record<string, any>;

export interface QueryBuilder<T extends TableSchema> {
  select(columns?: (keyof T)[]): SelectBuilder<T>;
  update(data: Partial<T>): UpdateBuilder<T>;
  insert(data: T): InsertBuilder<T>;
}

export interface SelectBuilder<T> {
  from(table: string): SelectBuilder<T>;
  where(condition: string): SelectBuilder<T>;
  orderBy(column: string, direction?: 'ASC' | 'DESC'): SelectBuilder<T>;
  limit(count: number): SelectBuilder<T>;
  build(): string;
}

export interface UpdateBuilder<T> {
  where(condition: string): UpdateBuilder<T>;
  build(): string;
}

export interface InsertBuilder<T> {
  into(table: string): InsertBuilder<T>;
  build(): string;
}