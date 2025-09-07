// utils/formatDate.ts

/**
 * Convert an ISO date string (e.g., "2025-08-19T19:52:44.741Z")
 * into a formatted date string (e.g., "Jul 30, 25").
 *
 * @param isoDate - The ISO date string to format
 * @returns A formatted date string like "Jul 30, 25"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short", // "Jul"
    day: "2-digit", // "30"
    year: "2-digit", // "25"
  }).format(date);
}
