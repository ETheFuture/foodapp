import { prisma } from "@/lib/prisma";
import { RestaurantRow } from "@/components/AdminRestaurantRow";
import { NewRestaurantForm } from "@/components/AdminNewRestaurantForm";

export default async function AdminRestaurantsPage() {
  const list = await prisma.restaurant.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Restaurants</h1>
      <div className="mt-6">
        <NewRestaurantForm />
      </div>
      <ul className="mt-8 space-y-2">
        {list.map((r) => (
          <li key={r.id}>
            <RestaurantRow
              id={r.id}
              name={r.name}
              isActive={r.isActive}
              address={r.address}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
