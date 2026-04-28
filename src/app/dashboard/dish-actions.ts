"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const mainImage = z
  .union([z.string().url(), z.literal("")])
  .optional()
  .transform((s) => (s === "" || s === undefined ? undefined : s));

const base = {
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price: z.coerce.number().min(0).max(9999),
  categoryId: z.string().min(1),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
  mainImageUrl: mainImage,
  tagIds: z.array(z.string()).optional(),
};

const create = z.object({
  ...base,
  restaurantId: z.string(),
});

const update = z.object({
  id: z.string(),
  ...base,
});

export async function createDishAction(raw: z.infer<typeof create>) {
  const s = await readSession();
  const p = create.safeParse(raw);
  if (!p.success) return { error: "Ongeldige invoer" };
  if (s?.role !== "RESTAURANT" || s.restaurantId !== p.data.restaurantId) {
    return { error: "Geen toegang" };
  }
  const { tagIds, mainImageUrl, ...rest } = p.data;
  const dish = await prisma.dish.create({
    data: {
      name: rest.name,
      description: rest.description || null,
      price: rest.price,
      categoryId: rest.categoryId,
      restaurantId: rest.restaurantId,
      isAvailable: rest.isAvailable,
      isFeatured: rest.isFeatured,
    },
  });
  if (mainImageUrl) {
    await prisma.dishImage.create({
      data: { dishId: dish.id, imageUrl: mainImageUrl, isMain: true },
    });
  }
  if (tagIds?.length) {
    for (const tid of tagIds) {
      const t = await prisma.tag.findUnique({ where: { id: tid } });
      if (t) {
        await prisma.dishTag.create({ data: { dishId: dish.id, tagId: tid } });
      }
    }
  }
  revalidatePath("/dashboard");
  revalidatePath("/");
  return { ok: true };
}

export async function updateDishAction(raw: z.infer<typeof update>) {
  const s = await readSession();
  const p = update.safeParse(raw);
  if (!p.success) return { error: "Ongeldige invoer" };
  const d = await prisma.dish.findUnique({ where: { id: p.data.id } });
  if (!d || d.restaurantId !== s?.restaurantId) return { error: "Geen toegang" };
  const { tagIds, mainImageUrl, id, ...rest } = p.data;
  await prisma.dish.update({
    where: { id },
    data: {
      name: rest.name,
      description: rest.description || null,
      price: rest.price,
      categoryId: rest.categoryId,
      isAvailable: rest.isAvailable,
      isFeatured: rest.isFeatured,
    },
  });
  if (mainImageUrl) {
    const main = await prisma.dishImage.findFirst({
      where: { dishId: id, isMain: true },
    });
    if (main) {
      await prisma.dishImage.update({
        where: { id: main.id },
        data: { imageUrl: mainImageUrl },
      });
    } else {
      await prisma.dishImage.create({
        data: { dishId: id, imageUrl: mainImageUrl, isMain: true },
      });
    }
  }
  if (tagIds) {
    await prisma.dishTag.deleteMany({ where: { dishId: id } });
    for (const tid of tagIds) {
      await prisma.dishTag
        .create({ data: { dishId: id, tagId: tid } })
        .catch(() => null);
    }
  }
  revalidatePath("/dashboard");
  revalidatePath(`/dish/${id}`);
  revalidatePath("/");
  return { ok: true };
}
