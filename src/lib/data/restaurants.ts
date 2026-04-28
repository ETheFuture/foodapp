import { prisma } from "@/lib/prisma";
import { distanceKm, AMSTERDAM_DEFAULT } from "@/lib/geo";
import { Prisma } from "@prisma/client";

const restWith = {
  include: {
    dishes: {
      where: { isAvailable: true },
      include: {
        category: true,
        restaurant: true,
        images: { orderBy: { isMain: "desc" as const } },
        tags: { include: { tag: true } },
      },
      orderBy: { name: "asc" as const },
    },
  },
} satisfies { include: Prisma.RestaurantInclude };

export type RestaurantWithDishes = Prisma.RestaurantGetPayload<typeof restWith>;

export async function getRestaurantById(id: string) {
  return prisma.restaurant.findFirst({
    where: { id, isActive: true },
    ...restWith,
  });
}

export function mapRestaurantsForMap(
  userLat: number = AMSTERDAM_DEFAULT.lat,
  userLon: number = AMSTERDAM_DEFAULT.lon,
) {
  return prisma.restaurant
    .findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
    .then((rows) =>
      rows.map((r) => ({
        id: r.id,
        name: r.name,
        lat: r.latitude,
        lon: r.longitude,
        address: r.address,
        distanceKm: distanceKm(userLat, userLon, r.latitude, r.longitude),
        cuisineType: r.cuisineType,
      })),
    );
}
