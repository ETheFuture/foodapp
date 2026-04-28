import Link from "next/link";
import { RestaurantForm } from "../_RestaurantForm";
import { createRestaurantAction } from "../../actions";

export default function NewRestaurantPage() {
  return (
    <div>
      <p className="text-sm text-zinc-500">
        <Link href="/admin/restaurants" className="hover:underline">
          ← Restaurants
        </Link>
      </p>
      <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
        Nieuw restaurant
      </h1>
      <div className="mt-6">
        <RestaurantForm
          action={createRestaurantAction}
          submitLabel="Aanmaken"
        />
      </div>
    </div>
  );
}
