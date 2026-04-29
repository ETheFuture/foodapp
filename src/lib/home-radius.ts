/** Stappen voor home-feed: 500 m, 1–10 km. Standaard 1 km. */
export function parseHomeRadiusParam(
  s: string | undefined | null,
): number {
  if (s == null || s === "") return 1;
  const n = Number(s);
  if (Number.isNaN(n)) return 1;
  if (n === 0.5) return 0.5;
  if ([1, 2, 5, 10].includes(n)) return n;
  return 1;
}
