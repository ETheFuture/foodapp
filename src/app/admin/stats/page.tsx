import { prisma } from "@/lib/prisma";

export default async function AdminStatsPage() {
  const byType = await prisma.analyticsEvent.groupBy({
    by: ["type"],
    _count: { id: true },
  });
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Cijfers</h1>
      <ul className="mt-4 space-y-1 text-sm text-zinc-600">
        {byType.map((b) => (
          <li key={b.type} className="flex justify-between max-w-sm">
            <span>{b.type}</span>
            <span>{b._count.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
