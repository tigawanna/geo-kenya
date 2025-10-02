// More robust implementation that handles consecutive uppercase letters
export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Uppercase<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;

export type CamelToSnakeKeys<T> = {
  [K in keyof T as CamelToSnakeCase<Extract<K, string>>]: T[K];
};
