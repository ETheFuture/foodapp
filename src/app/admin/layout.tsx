import Link from "next/link";
import { readSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/dashboard/actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await readSession();
  if (s?.role !== "ADMIN") {
    redirect("/login?next=/admin");
  }
  return (
    <div className="min-h-full bg-zinc-100">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <span className="text-sm font-semibold text-zinc-900">Beheer</span>
          <div className="flex gap-3 text-sm">
            <Link href="/" className="text-zinc-500 hover:text-zinc-800">
              Publiek
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="text-zinc-500 hover:text-zinc-800">
                Uitloggen
              </button>
            </form>
          </div>
        </div>
        <div className="mx-auto max-w-5xl border-t border-zinc-100 px-4 py-2 sm:px-6">
          <nav className="flex gap-4 text-sm">
            <Link className="text-zinc-600 hover:text-zinc-900" href="/admin">
              Overzicht
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-900" href="/admin/restaurants">
              Restaurants
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-900" href="/admin/dishes">
              Gerechten
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-900" href="/admin/categories">
              Categorieën
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-900" href="/admin/stats">
              Cijfers
            </Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
    </div>
  );
}
