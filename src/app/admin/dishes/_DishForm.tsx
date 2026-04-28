import { ImageUploader } from "@/components/ImageUploader";

type Cat = { id: string; name: string };
type Rest = { id: string; name: string };
type Tag = { id: string; name: string };

type DishLike = {
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  restaurantId: string;
  isAvailable: boolean;
  isFeatured: boolean;
};

type Props = {
  action: (formData: FormData) => Promise<void>;
  dish?: DishLike;
  mainImageUrl?: string;
  categories: Cat[];
  restaurants: Rest[];
  tags: Tag[];
  selectedTagIds?: string[];
  submitLabel?: string;
};

export function DishForm({
  action,
  dish,
  mainImageUrl,
  categories,
  restaurants,
  tags,
  selectedTagIds = [],
  submitLabel = "Opslaan",
}: Props) {
  const selected = new Set(selectedTagIds);
  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
        <Field label="Naam" required>
          <input
            name="name"
            required
            defaultValue={dish?.name ?? ""}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Beschrijving">
          <textarea
            name="description"
            rows={4}
            defaultValue={dish?.description ?? ""}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Prijs (€)" required>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={dish?.price ?? ""}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Categorie" required>
            <select
              name="categoryId"
              required
              defaultValue={dish?.categoryId ?? ""}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Kies een categorie
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Restaurant" required>
          <select
            name="restaurantId"
            required
            defaultValue={dish?.restaurantId ?? ""}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Kies een restaurant
            </option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex flex-wrap gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isAvailable"
              defaultChecked={dish?.isAvailable ?? true}
              className="rounded border-zinc-300"
            />
            Zichtbaar op de site
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={dish?.isFeatured ?? false}
              className="rounded border-zinc-300"
            />
            Uitgelicht op homepage
          </label>
        </div>
        <Field label="Tags">
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <label
                key={t.id}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm"
              >
                <input
                  type="checkbox"
                  name="tagIds"
                  value={t.id}
                  defaultChecked={selected.has(t.id)}
                  className="rounded border-zinc-300"
                />
                {t.name}
              </label>
            ))}
            {tags.length === 0 && (
              <span className="text-xs text-zinc-500">Geen tags gedefinieerd.</span>
            )}
          </div>
        </Field>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <ImageUploader
            name="mainImageUrl"
            defaultValue={mainImageUrl}
            label="Hoofdfoto"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white"
        >
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
