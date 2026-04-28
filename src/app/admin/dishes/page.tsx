import { prisma } from "@/lib/prisma";
import { AdminDishRow } from "@/components/AdminDishRow";

export default async function AdminDishesPage() {
  const list = await prisma.dish.findMany({
    where: { isAvailable: true },
    orderBy: { name: "asc" },
    include: { restaurant: { select: { name: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Gerechten & featured</h1>
      <p className="text-sm text-zinc-500">Toggle &quot;Uitgelicht&quot; op home.</p>
      <ul className="mt-6 space-y-1">
        {list.map((d) => (
          <li key={d.id}>
            <AdminDishRow
              id={d.id}
              name={d.name}
              restaurantName={d.restaurant.name}
              isFeatured={d.isFeatured}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
