"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const p = z.object({
  id: z.string(),
  name: z.string().min(1).max(200),
  description: z.string().max(5000).nullable().optional(),
  address: z.string().min(1).max(500),
  phone: z.string().max(50).nullable().optional(),
  website: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .transform((s) => (!s || s === "" ? null : s)),
  instagram: z.string().max(200).nullable().optional(),
  priceRange: z.string().max(20),
  cuisineType: z.string().min(1).max(200),
  openingHoursJson: z
    .string()
    .nullable()
    .optional()
    .refine(
      (s) => {
        if (!s || s.trim() === "") return true;
        try {
          JSON.parse(s);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Ongeldig JSON" },
    ),
});

export async function updateProfileAction(raw: z.infer<typeof p>) {
  const s = await readSession();
  if (s?.role !== "RESTAURANT" || s.restaurantId !== raw.id) {
    return { error: "Geen toegang" };
  }
  const o = p.safeParse(raw);
  if (!o.success) return { error: "Ongeldige invoer" };
  const d = o.data;
  await prisma.restaurant.update({
    where: { id: d.id },
    data: {
      name: d.name,
      description: d.description ?? null,
      address: d.address,
      phone: d.phone ?? null,
      website: d.website,
      instagram: d.instagram ?? null,
      priceRange: d.priceRange,
      cuisineType: d.cuisineType,
      openingHours: d.openingHoursJson && d.openingHoursJson.trim()
        ? d.openingHoursJson
        : null,
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/restaurant/" + d.id);
  return { ok: true };
}
