
/**
 * Converts ISO timestamp to local time format
 * @param date - ISO timestamp string (e.g., "2025-10-02 04:56:09.877Z")
 * @returns Formatted date string as "DD/MM/YYYY HH:MM"
 */
export function timestampTolaclTime(date: string) {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}
