/** Home-feed radius: vaste stappen van 500 m tot 500 km. Standaard 1 km. */
export const HOME_RADIUS_STEPS_KM = [
  0.5, 1, 2, 5, 10, 25, 50, 100, 250, 500,
] as const;

export type HomeRadiusKm = (typeof HOME_RADIUS_STEPS_KM)[number];

export const HOME_RADIUS_LABELS: readonly string[] = [
  "500m",
  "1km",
  "2km",
  "5km",
  "10km",
  "25km",
  "50km",
  "100km",
  "250km",
  "500km",
];

export function parseHomeRadiusParam(
  s: string | undefined | null,
): HomeRadiusKm {
  if (s == null || s === "") return 1;
  const n = Number(s);
  if (Number.isNaN(n)) return 1;
  for (const step of HOME_RADIUS_STEPS_KM) {
    if (Math.abs(n - step) < 0.001) return step;
  }
  return 1;
}

export function homeRadiusStepIndex(km: number): number {
  const i = HOME_RADIUS_STEPS_KM.findIndex(
    (x) => Math.abs(x - km) < 0.001,
  );
  return i >= 0 ? i : 1;
}
