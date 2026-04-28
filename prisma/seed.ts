import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { dishNamesByCategory, imagePool } from "./seed-dishes";

const prisma = new PrismaClient();

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

async function main() {
  await prisma.analyticsEvent.deleteMany();
  await prisma.dishImage.deleteMany();
  await prisma.dishTag.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.user.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();

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

  const adminHash = await bcrypt.hash("admin123", 12);
  const restHash = await bcrypt.hash("rest123", 12);
  await prisma.user.create({
    data: {
      email: "admin@foodapp.local",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });
  await prisma.user.create({
    data: {
      email: "restaurant@foodapp.local",
      passwordHash: restHash,
      role: "RESTAURANT",
      restaurantId: restRows[0]!.id,
    },
  });

  let imageIdx = 0;
  let dishIndex = 0;
  for (const [catName, dishNames] of Object.entries(dishNamesByCategory)) {
    const cat = categoryByName[catName];
    if (!cat) continue;
    for (const dName of dishNames) {
      const restaurant = restRows[dishIndex % restRows.length]!;
      const base = 6 + (dName.length % 5) * 0.5 + (dishIndex % 4);
      const price = Math.round((base + Math.sin(dishIndex) * 2) * 10) / 10;
      const isFeatured = dishIndex % 5 === 0;
      const tags =
        [
          "Huisgemaakt",
          dishIndex % 3 === 0 ? "Vegetarisch" : null,
          dishIndex % 7 === 0 ? "Pittig" : null,
          dishIndex % 11 === 0 ? "Vegan" : null,
        ]
          .filter((x): x is string => Boolean(x))
          .map((n) => tagByName[n])
          .filter(Boolean) as { id: string; name: string }[];

      const desc = `Signature bereiding — ${dName} bij ${restaurant.name}. Foto- en smaakfokus.`;

      const dish = await prisma.dish.create({
        data: {
          name: dName,
          description: desc,
          price,
          categoryId: cat.id,
          restaurantId: restaurant.id,
          isAvailable: true,
          isFeatured,
        },
      });

      await prisma.dishImage.create({
        data: {
          dishId: dish.id,
          imageUrl: imagePool[imageIdx % imagePool.length]!,
          isMain: true,
        },
      });
      if (dishIndex % 4 === 0) {
        imageIdx += 1;
        await prisma.dishImage.create({
          data: {
            dishId: dish.id,
            imageUrl: imagePool[(imageIdx + 1) % imagePool.length]!,
            isMain: false,
          },
        });
      }
      for (const t of tags) {
        await prisma.dishTag.create({
          data: { dishId: dish.id, tagId: t.id },
        });
      }
      dishIndex += 1;
      imageIdx += 1;
    }
  }

  const count = await prisma.dish.count();
  console.log(`Seeded ${count} dishes, ${restRows.length} restaurants.`);
  console.log("Logins: admin@foodapp.local / admin123");
  console.log("        restaurant@foodapp.local / rest123 (Casa Riva)");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
