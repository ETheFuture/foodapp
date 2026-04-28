type RestaurantLike = {
  name: string;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  priceRange: string;
  cuisineType: string;
  openingHours: string | null;
  isActive: boolean;
};

type Props = {
  action: (formData: FormData) => Promise<void>;
  restaurant?: RestaurantLike;
  submitLabel?: string;
};

export function RestaurantForm({
  action,
  restaurant,
  submitLabel = "Opslaan",
}: Props) {
  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-5 max-w-3xl">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Naam" required>
          <input
            name="name"
            required
            defaultValue={restaurant?.name ?? ""}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Keuken" required>
          <input
            name="cuisineType"
            required
            defaultValue={restaurant?.cuisineType ?? ""}
            placeholder="bv. Italiaans"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
      </div>
      <Field label="Beschrijving">
        <textarea
          name="description"
          rows={3}
          defaultValue={restaurant?.description ?? ""}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Adres" required>
        <input
          name="address"
          required
          defaultValue={restaurant?.address ?? ""}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Latitude" required>
          <input
            name="latitude"
            type="number"
            step="any"
            required
            defaultValue={restaurant?.latitude ?? 52.3676}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Longitude" required>
          <input
            name="longitude"
            type="number"
            step="any"
            required
            defaultValue={restaurant?.longitude ?? 4.9041}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Prijsklasse">
          <select
            name="priceRange"
            defaultValue={restaurant?.priceRange ?? "€€"}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          >
            <option>€</option>
            <option>€€</option>
            <option>€€€</option>
            <option>€€€€</option>
          </select>
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Telefoon">
          <input
            name="phone"
            defaultValue={restaurant?.phone ?? ""}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Website">
          <input
            name="website"
            type="url"
            defaultValue={restaurant?.website ?? ""}
            placeholder="https://..."
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Instagram">
          <input
            name="instagram"
            defaultValue={restaurant?.instagram ?? ""}
            placeholder="@handle"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
      </div>
      <Field label="Openingstijden (vrije tekst)">
        <textarea
          name="openingHours"
          rows={3}
          defaultValue={restaurant?.openingHours ?? ""}
          placeholder="bv. Ma–Vr 12:00–22:00, Wo gesloten"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </Field>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={restaurant?.isActive ?? true}
          className="rounded border-zinc-300"
        />
        Actief (zichtbaar voor publiek)
      </label>
      <div>
        <button className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </p>
      {children}
    </div>
  );
}
