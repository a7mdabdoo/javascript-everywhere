/**
 * Day 06 — Project Library: Generic List Utilities
 * list-utils.ts
 */

export function countBy<T, K extends string>(
  items: T[],
  fn: (item: T) => K
): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const item of items) {
    const key = fn(item);
    tally[key] = (tally[key] ?? 0) + 1;
  }
  return tally;
}

export function groupBy<T, K extends string>(
  items: T[],
  fn: (item: T) => K
): Partial<Record<K, T[]>> {
  const result: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const key = fn(item);
    const existing = result[key];
    if (existing) {
      existing.push(item);
    } else {
      result[key] = [item];
    }
  }
  return result;
}
