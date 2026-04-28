import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminHome() {
  const [nRest, nDish, nView] = await Promise.all([
    prisma.restaurant.count(),
    prisma.dish.count(),
    prisma.analyticsEvent.count({ where: { type: "view" } }),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Overzicht</h1>
      <p className="text-sm text-zinc-500">Bite – dish-first, globaal kader.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Restaurants", nRest],
          ["Gerechten", nDish],
          ["Totaal views (events)", nView],
        ].map(([a, c]) => (
          <li
            key={String(a)}
            className="rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <p className="text-xs text-zinc-500">{a}</p>
            <p className="text-2xl font-semibold text-zinc-900">{c}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-zinc-500">
        <Link className="text-[var(--accent)]" href="/admin/restaurants">
          Restaurants beheren
        </Link>{" "}
        ·{" "}
        <Link className="text-[var(--accent)]" href="/admin/dishes">
          Featured gerechten
        </Link>
      </p>
    </div>
  );
}
