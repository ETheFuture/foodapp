import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";

export default async function ProfilePage() {
  const s = await readSession();
  if (!s?.restaurantId) notFound();
  const r = await prisma.restaurant.findUnique({ where: { id: s.restaurantId } });
  if (!r) redirect("/");
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Profiel</h1>
      <p className="text-sm text-zinc-500">Basinformatie (MVP: tekst, geen maps).</p>
      <div className="mt-6">
        <ProfileForm
          id={r.id}
          name={r.name}
          description={r.description}
          address={r.address}
          phone={r.phone}
          website={r.website}
          instagram={r.instagram}
          priceRange={r.priceRange}
          cuisineType={r.cuisineType}
          openingHoursJson={r.openingHours}
        />
      </div>
    </div>
  );
}
