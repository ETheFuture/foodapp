import { PrismaClient } from "@prisma/client";
import { dishNamesByCategory, imagePool, photoDishes } from "./seed-dishes";

const prisma = new PrismaClient();

const TARGET_DISHES = 50;

const restaurants = [
  {
    name: "Casa Riva",
    description: "Houtgestookte oven, Italiaanse wijnen, laat in de avond open.",
    address: "Lange Leidsedwarsstraat 88, Amsterdam",
    latitude: 52.3638,
    longitude: 4.8885,
    phone: "+31 20 123 4001",
    website: "https://example.com/casa-riva",
    instagram: "@casariva",
    priceRange: "€€",
    cuisineType: "Italiaans",
  },
  {
    name: "Koi West",
    description: "Kleine zender, grote smaken, omakase in het weekend.",
    address: "Bilderdijkstraat 192, Amsterdam",
    latitude: 52.3702,
    longitude: 4.8701,
    phone: "+31 20 123 4002",
    website: "https://example.com/koi-west",
    instagram: "@koiwest",
    priceRange: "€€€",
    cuisineType: "Japans",
  },
  {
    name: "Smashed & Co",
    description: "Smash-style burgers, natuurlijk gerijpt rund.",
    address: "Eerste van der Helststraat 45, Amsterdam",
    latitude: 52.3541,
    longitude: 4.8902,
    phone: "+31 20 123 4003",
    website: "https://example.com/smashed",
    instagram: "@smashedco",
    priceRange: "€€",
    cuisineType: "Americana",
  },
  {
    name: "Gusto Due",
    description: "Huisgemaakt pastina, dagelijks vers.",
    address: "Van Woustraat 201, Amsterdam",
    latitude: 52.3505,
    longitude: 4.9116,
    phone: "+31 20 123 4004",
    website: "https://example.com/gustodue",
    instagram: "@gustodue",
    priceRange: "€€",
    cuisineType: "Italiaans",
  },
  {
    name: "Bowl & Steam",
    description: "Ramen, baozi en groente bouillons, comfort food.",
    address: "Elandsgracht 45, Amsterdam",
    latitude: 52.3756,
    longitude: 4.8757,
    phone: "+31 20 123 4005",
    website: "https://example.com/bowlsteam",
    instagram: "@bowlsteam",
    priceRange: "€€",
    cuisineType: "Azië fusion",
  },
  {
    name: "Calle 9",
    description: "Gele maïstortillas, salsas, mezcal bar.",
    address: "Eerste Jacob van Campenstraat 6, Amsterdam",
    latitude: 52.3607,
    longitude: 4.8889,
    phone: "+31 20 123 4006",
    website: "https://example.com/calle9",
    instagram: "@calle9mex",
    priceRange: "€€",
    cuisineType: "Latijns",
  },
  {
    name: "Morgenstond",
    description: "Eersteklas brunch, specialty coffee, weekend queue.",
    address: "Barentszstraat 5, Amsterdam",
    latitude: 52.3759,
    longitude: 4.8754,
    phone: "+31 20 123 4007",
    website: "https://example.com/morgenstond",
    instagram: "@morgenstond",
    priceRange: "€€",
    cuisineType: "Brunch",
  },
  {
    name: "Groen & Simpel",
    description: "Seizoenssalades, lokaal en biologisch.",
    address: "Eerste Constantijn Huygensstraat 20, Amsterdam",
    latitude: 52.3604,
    longitude: 4.8756,
    phone: "+31 20 123 4008",
    website: "https://example.com/groen",
    instagram: "@groensimpel",
    priceRange: "€",
    cuisineType: "Salad bar",
  },
  {
    name: "Fuego Grill",
    description: "Droog gerijpt vlees, degustatie, charcuterie.",
    address: "Ferdinand Bolstraat 6, Amsterdam",
    latitude: 52.3556,
    longitude: 4.8907,
    phone: "+31 20 123 4009",
    website: "https://example.com/fuego",
    instagram: "@fuegogrill",
    priceRange: "€€€",
    cuisineType: "Steakhouse",
  },
  {
    name: "Spice Route 9",
    description: "Tandoor, rijst gerechten, vegetarische klassiekers.",
    address: "Eerste Oosterparkstraat 1, Amsterdam",
    latitude: 52.3604,
    longitude: 4.9116,
    phone: "+31 20 123 4010",
    website: "https://example.com/spiceroute9",
    instagram: "@spiceroute9",
    priceRange: "€€",
    cuisineType: "Indisch",
  },
  {
    name: "Souk Noord",
    description: "Gedeelde schalen, pita, za'atar, dessert.",
    address: "Brouwersgracht 1, Amsterdam",
    latitude: 52.3806,
    longitude: 4.8887,
    phone: "+31 20 123 4011",
    website: "https://example.com/souknoord",
    instagram: "@souknoord",
    priceRange: "€€",
    cuisineType: "Midden-Oosters",
  },
  {
    name: "Lotus Breeze",
    description: "Knopjes, wok, streetfood, groene curries.",
    address: "Reinwardtstraat 1, Amsterdam",
    latitude: 52.3478,
    longitude: 4.9116,
    phone: "+31 20 123 4012",
    website: "https://example.com/lotus",
    instagram: "@lotusbreeze",
    priceRange: "€€",
    cuisineType: "Vietnamees/Thai",
  },
] as const;

const tagNames = [
  "Vegan",
  "Vegetarisch",
  "Pittig",
  "Halal",
  "Glutenvrij",
  "Huisgemaakt",
  "Gedeelde schotel",
] as const;

const openingTemplate = {
  mon: "12:00–22:00",
  tue: "12:00–22:00",
  wed: "12:00–22:00",
  thu: "12:00–23:00",
  fri: "12:00–00:00",
  sat: "10:00–00:00",
  sun: "10:00–22:00",
};

function buildDishList(): { name: string; categoryName: string }[] {
  const out: { name: string; categoryName: string }[] = [];
  for (const [catName, names] of Object.entries(dishNamesByCategory)) {
    for (const name of names) {
      if (out.length >= TARGET_DISHES) return out;
      out.push({ name, categoryName: catName });
    }
  }
  return out;
}

async function main() {
  const existingCount = await prisma.dish.count();
  if (existingCount > 0) {
    console.log(`Clearing ${existingCount} existing dishes for fresh re-seed with local photos…`);
    await prisma.dishTag.deleteMany();
    await prisma.dishImage.deleteMany();
    await prisma.dish.deleteMany();
    await prisma.user.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    console.log("Old data cleared.");
  }

  const categoryEntries = await Promise.all(
    Object.keys(dishNamesByCategory).map((name) =>
      prisma.category.create({ data: { name } }),
    ),
  );
  const categoryByName = Object.fromEntries(
    categoryEntries.map((c) => [c.name, c]),
  );

  const tagEntries = await Promise.all(
    tagNames.map((name) => prisma.tag.create({ data: { name } })),
  );
  const tagByName = Object.fromEntries(tagEntries.map((t) => [t.name, t]));

  const restRows = await Promise.all(
    restaurants.map((r, i) =>
      prisma.restaurant.create({
        data: {
          name: r.name,
          description: r.description,
          address: r.address,
          latitude: r.latitude,
          longitude: r.longitude,
          phone: r.phone,
          website: r.website,
          instagram: r.instagram,
          priceRange: r.priceRange,
          cuisineType: r.cuisineType,
          openingHours: JSON.stringify({
            ...openingTemplate,
            note: `Spor ${i + 1} — laat tafel 21:00`,
          }),
          isActive: true,
        },
      }),
    ),
  );

  // ── Phase 1: seed the 23 dishes that have real photos ──
  let totalDishes = 0;
  const usedNames = new Set<string>();

  for (let i = 0; i < photoDishes.length; i++) {
    const pd = photoDishes[i]!;
    const cat = categoryByName[pd.category];
    if (!cat) continue;
    const restaurant = restRows[i % restRows.length]!;
    const base = 8 + (pd.name.length % 5) * 0.5 + (i % 4);
    const price = Math.round((base + Math.sin(i) * 2) * 10) / 10;
    const isFeatured = i < 12;

    const dish = await prisma.dish.create({
      data: {
        name: pd.name,
        description: `${pd.name} — huisbereiding bij ${restaurant.name}.`,
        price,
        categoryId: cat.id,
        restaurantId: restaurant.id,
        isAvailable: true,
        isFeatured,
      },
    });

    await prisma.dishImage.create({
      data: { dishId: dish.id, imageUrl: pd.image, isMain: true },
    });

    const tags = (
      [
        "Huisgemaakt",
        i % 3 === 0 ? "Vegetarisch" : null,
        i % 7 === 0 ? "Pittig" : null,
      ] as (string | null)[]
    )
      .filter((x): x is string => Boolean(x))
      .map((t) => tagByName[t])
      .filter(Boolean) as { id: string }[];

    for (const t of tags) {
      await prisma.dishTag.create({ data: { dishId: dish.id, tagId: t.id } });
    }

    usedNames.add(pd.name);
    totalDishes++;
  }

  // ── Phase 2: fill up remaining slots with generated names + local photo pool ──
  const dishList = buildDishList();
  let imageIdx = 0;
  for (const { name: dName, categoryName } of dishList) {
    if (totalDishes >= TARGET_DISHES) break;
    if (usedNames.has(dName)) continue;

    const cat = categoryByName[categoryName];
    if (!cat) continue;
    const restaurant = restRows[totalDishes % restRows.length]!;
    const base = 6 + (dName.length % 5) * 0.5 + (totalDishes % 4);
    const price = Math.round((base + Math.sin(totalDishes) * 2) * 10) / 10;

    const dish = await prisma.dish.create({
      data: {
        name: dName,
        description: `Signature bereiding — ${dName} bij ${restaurant.name}.`,
        price,
        categoryId: cat.id,
        restaurantId: restaurant.id,
        isAvailable: true,
        isFeatured: false,
      },
    });

    await prisma.dishImage.create({
      data: {
        dishId: dish.id,
        imageUrl: imagePool[imageIdx % imagePool.length]!,
        isMain: true,
      },
    });

    const tags = (
      [
        "Huisgemaakt",
        totalDishes % 3 === 0 ? "Vegetarisch" : null,
        totalDishes % 7 === 0 ? "Pittig" : null,
      ] as (string | null)[]
    )
      .filter((x): x is string => Boolean(x))
      .map((t) => tagByName[t])
      .filter(Boolean) as { id: string }[];

    for (const t of tags) {
      await prisma.dishTag.create({ data: { dishId: dish.id, tagId: t.id } });
    }

    usedNames.add(dName);
    totalDishes++;
    imageIdx++;
  }

  const count = await prisma.dish.count();
  console.log(`Seeded ${count} gerechten (doel: ${TARGET_DISHES}), ${restRows.length} restaurants.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
