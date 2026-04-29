import { prisma } from "@/lib/prisma";
import { distanceKm, AMSTERDAM_DEFAULT } from "@/lib/geo";
import { Prisma } from "@prisma/client";

const dishWith = {
  include: {
    category: true,
    restaurant: true,
    images: { orderBy: { isMain: "desc" as const } },
    tags: { include: { tag: true } },
  },
} satisfies {
  include: Prisma.DishInclude;
};

export type DishWithRelations = Prisma.DishGetPayload<typeof dishWith>;

export type DishListItem = DishWithRelations & { distanceKm: number };

function withDistance(
  d: DishWithRelations,
  lat: number,
  lon: number,
): DishListItem {
  const r = d.restaurant;
  return {
    ...d,
    distanceKm: distanceKm(lat, lon, r.latitude, r.longitude),
  };
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

async function popularDishIds(limit: number) {
  const events = await prisma.analyticsEvent.findMany({
    where: { type: "view", entityType: "dish" },
    select: { entityId: true },
  });
  const m = new Map<string, number>();
  for (const e of events) {
    m.set(e.entityId, (m.get(e.entityId) ?? 0) + 1);
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}

export async function getHomeDishes(userLat: number, userLon: number) {
  const take = 20;
  const restOk = { restaurant: { isActive: true } };

  const [featured, forYou, topIds, recent] = await Promise.all([
    prisma.dish.findMany({
      where: { isAvailable: true, isFeatured: true, ...restOk },
      ...dishWith,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.dish.findMany({
      where: { isAvailable: true, ...restOk },
      ...dishWith,
      take: 16,
    }),
    popularDishIds(8),
    prisma.dish.findMany({
      where: { isAvailable: true, ...restOk },
      ...dishWith,
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const forYouSorted = forYou
    .map((d) => withDistance(d, userLat, userLon))
    .sort((a, b) => a.distanceKm - b.distanceKm);
  const featuredD = featured.map((d) => withDistance(d, userLat, userLon));

  let popularDishes: DishWithRelations[] = [];
  if (topIds.length > 0) {
    popularDishes = await prisma.dish.findMany({
      where: { isAvailable: true, ...restOk, id: { in: topIds } },
      ...dishWith,
    });
  }
  if (popularDishes.length < 4) {
    const ids = new Set(popularDishes.map((d) => d.id));
    for (const d of recent) {
      if (!ids.has(d.id) && popularDishes.length < 8) {
        popularDishes.push(d);
        ids.add(d.id);
      }
    }
  }
  const popular = popularDishes
    .map((d) => withDistance(d, userLat, userLon))
    .slice(0, 8);

  return {
    center: { lat: userLat, lon: userLon },
    defaultCenter: AMSTERDAM_DEFAULT,
    featured: featuredD.slice(0, 8),
    popular,
    nearYou: forYouSorted.slice(0, 8),
  };
}

export type SearchFilters = {
  q: string;
  categoryId: string | null;
  maxDistanceKm: number;
  maxPrice: number;
  onlyOpen: boolean;
  userLat: number;
  userLon: number;
};

function openingNow(_openingJson: string | null): boolean {
  if (!process.env.FEATURE_OPENING_FILTER) {
    return true;
  }
  return true;
}

export async function searchDishes(filters: SearchFilters): Promise<DishListItem[]> {
  const { q, categoryId, maxDistanceKm, maxPrice, userLat, userLon, onlyOpen } = filters;
  const search = q.trim();
  const where: Prisma.DishWhereInput = {
    isAvailable: true,
    restaurant: { isActive: true },
    price: { lte: maxPrice },
  };
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (search.length > 0) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const dishes = await prisma.dish.findMany({
    where,
    ...dishWith,
    take: 120,
    orderBy: { name: "asc" },
  });

  const withD = dishes
    .map((d) => withDistance(d, userLat, userLon))
    .filter((d) => d.distanceKm <= maxDistanceKm);

  if (onlyOpen) {
    return withD
      .filter((d) => openingNow(d.restaurant.openingHours))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
  return withD.sort((a, b) => a.distanceKm - b.distanceKm);
}

export async function getDishById(id: string) {
  return prisma.dish.findFirst({
    where: { id, isAvailable: true, restaurant: { isActive: true } },
    ...dishWith,
  });
}

export async function getRelatedDishes(
  dish: DishWithRelations,
  userLat: number,
  userLon: number,
  take = 6,
): Promise<DishListItem[]> {
  const others = await prisma.dish.findMany({
    where: {
      isAvailable: true,
      restaurant: { isActive: true },
      id: { not: dish.id },
      OR: [{ categoryId: dish.categoryId }, { restaurantId: dish.restaurantId }],
    },
    ...dishWith,
    take: take + 4,
  });
  return others
    .map((d) => withDistance(d, userLat, userLon))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, take);
}

export async function getDishListItemById(
  id: string,
  userLat: number,
  userLon: number,
): Promise<DishListItem | null> {
  const d = await getDishById(id);
  if (!d) return null;
  return withDistance(d, userLat, userLon);
}
