import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function StatsPage() {
  const s = await readSession();
  if (!s?.restaurantId) notFound();

  const dishIds = await prisma.dish.findMany({
    where: { restaurantId: s.restaurantId },
    select: { id: true, name: true },
  });

  const [rViews, routeClicks, restClicks, dViewCounts] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        entityType: "restaurant",
        entityId: s.restaurantId,
        type: "view",
      },
    }),
    prisma.analyticsEvent.count({
      where: {
        entityType: "restaurant",
        entityId: s.restaurantId,
        type: "route_click",
      },
    }),
    prisma.analyticsEvent.count({
      where: {
        entityType: "restaurant",
        entityId: s.restaurantId,
        type: "click",
      },
    }),
    Promise.all(
      dishIds.map(async (d) => ({
        name: d.name,
        c: await prisma.analyticsEvent.count({
          where: { entityType: "dish", entityId: d.id, type: "view" },
        }),
      })),
    ),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Statistieken</h1>
      <p className="text-sm text-zinc-500">MVP: alle tijd, zonder periodetools.</p>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <dt className="text-xs text-zinc-500">Restaurant weergaves</dt>
          <dd className="text-2xl font-semibold text-zinc-900">{rViews}</dd>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <dt className="text-xs text-zinc-500">Route-clicks</dt>
          <dd className="text-2xl font-semibold text-zinc-900">{routeClicks}</dd>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <dt className="text-xs text-zinc-500">Clicks (naar profiel)</dt>
          <dd className="text-2xl font-semibold text-zinc-900">{restClicks}</dd>
        </div>
      </dl>
      <h2 className="mt-8 text-sm font-medium text-zinc-900">Gerecht views</h2>
      <ul className="mt-2 space-y-1 text-sm text-zinc-600">
        {dViewCounts.map((r) => (
          <li key={r.name} className="flex justify-between">
            <span>{r.name}</span>
            <span>{r.c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
