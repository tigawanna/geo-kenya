type FormatDateStyle = "date" | "datetime";

export function formatDate(
  value: string | Date | number | null | undefined,
  style: FormatDateStyle = "date",
): string {
  if (value == null) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  if (style === "datetime") {
    return date.toLocaleString();
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
