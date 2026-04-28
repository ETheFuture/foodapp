"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dishNamesByCategory, imagePool } from "../../../prisma/seed-dishes";

async function requireAdmin() {
  const s = await readSession();
  if (s?.role !== "ADMIN") {
    throw new Error("Geen toegang");
  }
  return s;
}

function revalidatePublic(extra: string[] = []) {
  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/map");
  for (const p of extra) revalidatePath(p);
}

// ---------- Categories ----------

const catName = z.string().min(1).max(100);

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const name = catName.parse(String(formData.get("name") ?? "").trim());
  await prisma.category.create({ data: { name } });
  revalidatePublic();
  revalidatePath("/admin/categories");
}

export async function renameCategoryAction(id: string, formData: FormData) {
  await requireAdmin();
  const name = catName.parse(String(formData.get("name") ?? "").trim());
  await prisma.category.update({ where: { id }, data: { name } });
  revalidatePublic();
  revalidatePath("/admin/categories");
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();
  const used = await prisma.dish.count({ where: { categoryId: id } });
  if (used > 0) {
    throw new Error(`Categorie wordt nog gebruikt door ${used} gerecht(en).`);
  }
  await prisma.category.delete({ where: { id } });
  revalidatePublic();
  revalidatePath("/admin/categories");
}

// ---------- Restaurants ----------

const restaurantSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  address: z.string().min(1).max(500),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  phone: z.string().max(50).optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  instagram: z.string().max(100).optional().or(z.literal("")),
  priceRange: z.string().max(10),
  cuisineType: z.string().min(1).max(100),
  openingHours: z.string().max(2000).optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional(),
});

function parseRestaurant(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    address: formData.get("address"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    phone: formData.get("phone") ?? "",
    website: formData.get("website") ?? "",
    instagram: formData.get("instagram") ?? "",
    priceRange: formData.get("priceRange") ?? "€€",
    cuisineType: formData.get("cuisineType"),
    openingHours: formData.get("openingHours") ?? "",
    isActive: formData.get("isActive") === "on" || formData.get("isActive") === "true",
  };
  return restaurantSchema.parse(raw);
}

export async function createRestaurantAction(formData: FormData) {
  await requireAdmin();
  const data = parseRestaurant(formData);
  const r = await prisma.restaurant.create({
    data: {
      name: data.name,
      description: data.description || null,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone || null,
      website: data.website || null,
      instagram: data.instagram || null,
      priceRange: data.priceRange,
      cuisineType: data.cuisineType,
      openingHours: data.openingHours || null,
      isActive: data.isActive ?? true,
    },
  });
  revalidatePublic([`/restaurant/${r.id}`]);
  redirect(`/admin/restaurants/${r.id}`);
}

export async function updateRestaurantAction(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseRestaurant(formData);
  await prisma.restaurant.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || null,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone || null,
      website: data.website || null,
      instagram: data.instagram || null,
      priceRange: data.priceRange,
      cuisineType: data.cuisineType,
      openingHours: data.openingHours || null,
      isActive: data.isActive ?? true,
    },
  });
  revalidatePublic([`/restaurant/${id}`]);
  revalidatePath(`/admin/restaurants/${id}`);
  revalidatePath("/admin/restaurants");
}

export async function deleteRestaurantAction(id: string) {
  await requireAdmin();
  await prisma.restaurant.delete({ where: { id } });
  revalidatePublic();
  redirect("/admin/restaurants");
}

export async function setRestaurantActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.restaurant.update({ where: { id }, data: { isActive } });
  revalidatePublic([`/restaurant/${id}`]);
  revalidatePath("/admin/restaurants");
  return { ok: true };
}

// ---------- Dishes ----------

const dishSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).optional().or(z.literal("")),
  price: z.coerce.number().min(0).max(9999),
  categoryId: z.string().min(1),
  restaurantId: z.string().min(1),
  isAvailable: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  mainImageUrl: z.string().url().optional().or(z.literal("")),
});

function parseDish(formData: FormData) {
  return dishSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    restaurantId: formData.get("restaurantId"),
    isAvailable:
      formData.get("isAvailable") === "on" ||
      formData.get("isAvailable") === "true",
    isFeatured:
      formData.get("isFeatured") === "on" ||
      formData.get("isFeatured") === "true",
    mainImageUrl: formData.get("mainImageUrl") ?? "",
  });
}

async function applyTagsFromForm(dishId: string, formData: FormData) {
  const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);
  await prisma.dishTag.deleteMany({ where: { dishId } });
  if (tagIds.length > 0) {
    await prisma.dishTag.createMany({
      data: tagIds.map((tagId) => ({ dishId, tagId })),
      skipDuplicates: true,
    });
  }
}

export async function createDishAction(formData: FormData) {
  await requireAdmin();
  const data = parseDish(formData);
  const dish = await prisma.dish.create({
    data: {
      name: data.name,
      description: data.description || null,
      price: data.price,
      categoryId: data.categoryId,
      restaurantId: data.restaurantId,
      isAvailable: data.isAvailable ?? true,
      isFeatured: data.isFeatured ?? false,
    },
  });
  if (data.mainImageUrl) {
    await prisma.dishImage.create({
      data: {
        dishId: dish.id,
        imageUrl: data.mainImageUrl,
        isMain: true,
      },
    });
  }
  await applyTagsFromForm(dish.id, formData);
  revalidatePublic([`/restaurant/${data.restaurantId}`, `/dish/${dish.id}`]);
  redirect(`/admin/dishes/${dish.id}`);
}

export async function updateDishAction(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseDish(formData);
  await prisma.dish.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || null,
      price: data.price,
      categoryId: data.categoryId,
      restaurantId: data.restaurantId,
      isAvailable: data.isAvailable ?? true,
      isFeatured: data.isFeatured ?? false,
    },
  });
  if (data.mainImageUrl) {
    const existingMain = await prisma.dishImage.findFirst({
      where: { dishId: id, isMain: true },
    });
    if (existingMain) {
      await prisma.dishImage.update({
        where: { id: existingMain.id },
        data: { imageUrl: data.mainImageUrl },
      });
    } else {
      await prisma.dishImage.create({
        data: { dishId: id, imageUrl: data.mainImageUrl, isMain: true },
      });
    }
  }
  await applyTagsFromForm(id, formData);
  revalidatePublic([`/restaurant/${data.restaurantId}`, `/dish/${id}`]);
  revalidatePath(`/admin/dishes/${id}`);
  revalidatePath("/admin/dishes");
}

export async function deleteDishAction(id: string) {
  await requireAdmin();
  const d = await prisma.dish.findUnique({ where: { id } });
  await prisma.dish.delete({ where: { id } });
  revalidatePublic(d ? [`/restaurant/${d.restaurantId}`] : []);
  redirect("/admin/dishes");
}

export async function setDishFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  const d = await prisma.dish.update({
    where: { id },
    data: { isFeatured },
  });
  revalidatePublic([`/dish/${id}`, `/restaurant/${d.restaurantId}`]);
  revalidatePath("/admin/dishes");
  return { ok: true };
}

export async function setDishAvailable(id: string, isAvailable: boolean) {
  await requireAdmin();
  const d = await prisma.dish.update({
    where: { id },
    data: { isAvailable },
  });
  revalidatePublic([`/dish/${id}`, `/restaurant/${d.restaurantId}`]);
  revalidatePath("/admin/dishes");
  return { ok: true };
}

// ---------- Dish images ----------

export async function addDishImageAction(dishId: string, formData: FormData) {
  await requireAdmin();
  const url = z.string().url().parse(String(formData.get("imageUrl") ?? ""));
  const isMain = formData.get("isMain") === "on";
  if (isMain) {
    await prisma.dishImage.updateMany({
      where: { dishId, isMain: true },
      data: { isMain: false },
    });
  }
  await prisma.dishImage.create({
    data: { dishId, imageUrl: url, isMain },
  });
  const d = await prisma.dish.findUnique({ where: { id: dishId } });
  revalidatePublic(d ? [`/dish/${dishId}`, `/restaurant/${d.restaurantId}`] : []);
  revalidatePath(`/admin/dishes/${dishId}`);
}

export async function setMainImageAction(dishId: string, imageId: string) {
  await requireAdmin();
  await prisma.dishImage.updateMany({
    where: { dishId, isMain: true },
    data: { isMain: false },
  });
  await prisma.dishImage.update({
    where: { id: imageId },
    data: { isMain: true },
  });
  const d = await prisma.dish.findUnique({ where: { id: dishId } });
  revalidatePublic(d ? [`/dish/${dishId}`, `/restaurant/${d.restaurantId}`] : []);
  revalidatePath(`/admin/dishes/${dishId}`);
}

export async function deleteDishImageAction(dishId: string, imageId: string) {
  await requireAdmin();
  await prisma.dishImage.delete({ where: { id: imageId } });
  const d = await prisma.dish.findUnique({ where: { id: dishId } });
  revalidatePublic(d ? [`/dish/${dishId}`, `/restaurant/${d.restaurantId}`] : []);
  revalidatePath(`/admin/dishes/${dishId}`);
}

// ---------- Sample import ----------

export async function importSampleDishesAction() {
  await requireAdmin();
  let restaurant = await prisma.restaurant.findFirst({
    orderBy: { createdAt: "asc" },
  });
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        name: "Sample Kitchen",
        description: "Demo-restaurant met voorbeeldgerechten.",
        address: "Demoplein 1, Amsterdam",
        latitude: 52.3676,
        longitude: 4.9041,
        cuisineType: "Internationaal",
        priceRange: "€€",
        isActive: true,
      },
    });
  }
  const allCats = await prisma.category.findMany();
  const catIdByName = new Map(allCats.map((c) => [c.name, c.id]));
  for (const name of Object.keys(dishNamesByCategory)) {
    if (!catIdByName.has(name)) {
      const c = await prisma.category.create({ data: { name } });
      catIdByName.set(name, c.id);
    }
  }

  let created = 0;
  let imageIdx = 0;
  for (const [catName, names] of Object.entries(dishNamesByCategory)) {
    const categoryId = catIdByName.get(catName);
    if (!categoryId) continue;
    for (const name of names) {
      if (created >= 50) break;
      const exists = await prisma.dish.findFirst({
        where: { name, restaurantId: restaurant.id },
      });
      if (exists) continue;
      const price = Math.round((6 + (name.length % 6) + Math.sin(created) * 2) * 10) / 10;
      const dish = await prisma.dish.create({
        data: {
          name,
          description: `Voorbeeldgerecht — ${name}.`,
          price,
          categoryId,
          restaurantId: restaurant.id,
          isAvailable: true,
          isFeatured: created % 6 === 0,
        },
      });
      await prisma.dishImage.create({
        data: {
          dishId: dish.id,
          imageUrl: imagePool[imageIdx % imagePool.length]!,
          isMain: true,
        },
      });
      created += 1;
      imageIdx += 1;
    }
    if (created >= 50) break;
  }

  revalidatePublic();
  revalidatePath("/admin/dishes");
  return { ok: true, created, restaurantId: restaurant.id };
}
