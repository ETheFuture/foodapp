import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DishForm } from "../_DishForm";
import { createDishAction } from "../../actions";

export default async function NewDishPage() {
  const [categories, restaurants, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.restaurant.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (restaurants.length === 0) {
    redirect("/admin/restaurants/new");
  }
  return (
    <div>
      <p className="text-sm text-zinc-500">
        <Link href="/admin/dishes" className="hover:underline">
          ← Gerechten
        </Link>
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-zinc-900">Nieuw gerecht</h1>
      <div className="mt-6">
        <DishForm
          action={createDishAction}
          categories={categories}
          restaurants={restaurants}
          tags={tags}
          submitLabel="Aanmaken"
        />
      </div>
    </div>
  );
}
