import Link from "next/link";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { DishRowForm } from "@/components/DishRowForm";
import { NewDishForm } from "@/components/NewDishForm";

export default async function DashboardPage() {
  const s = await readSession();
  if (!s?.restaurantId) notFound();
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: s.restaurantId },
    include: {
      dishes: {
        orderBy: { name: "asc" },
        include: {
          category: true,
          images: { take: 2, orderBy: { isMain: "desc" } },
          tags: { include: { tag: true } },
        },
      },
    },
  });
  if (!restaurant) {
    redirect("/");
  }
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">{restaurant.name}</h1>
        <p className="text-sm text-zinc-500">Gerechten beheren</p>
      </div>
      <NewDishForm
        restaurantId={restaurant.id}
        categories={categories}
        tags={tags}
      />
      <div className="space-y-3">
        {restaurant.dishes.map((d) => (
          <DishRowForm
            key={d.id}
            dish={d}
            categories={categories}
            tags={tags}
            restaurantId={restaurant.id}
          />
        ))}
      </div>
      {restaurant.dishes.length === 0 && (
        <p className="text-sm text-zinc-500">Nog geen gerechten. Voeg er één toe.</p>
      )}
      <p className="text-sm text-zinc-500">
        <Link href="/" className="text-[var(--accent)]">
          Publieke site
        </Link>
      </p>
    </div>
  );
}
