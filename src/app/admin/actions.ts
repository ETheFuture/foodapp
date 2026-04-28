"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function setRestaurantActive(id: string, isActive: boolean) {
  const s = await readSession();
  if (s?.role !== "ADMIN") return { error: "Geen toegang" };
  await prisma.restaurant.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: true };
}

export async function setDishFeatured(id: string, isFeatured: boolean) {
  const s = await readSession();
  if (s?.role !== "ADMIN") return { error: "Geen toegang" };
  await prisma.dish.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/dish/${id}`);
  return { ok: true };
}

const createRestaurant = z.object({
  name: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  description: z.string().max(5000).optional(),
  priceRange: z.string().default("€€"),
  cuisineType: z.string().min(1).max(200),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export async function createRestaurantAction(
  data: z.infer<typeof createRestaurant>,
) {
  const s = await readSession();
  if (s?.role !== "ADMIN") return { error: "Geen toegang" };
  const p = createRestaurant.safeParse(data);
  if (!p.success) return { error: "Ongeldig" };
  const r = await prisma.restaurant.create({ data: { ...p.data } });
  revalidatePath("/admin");
  return { ok: true, id: r.id };
}
