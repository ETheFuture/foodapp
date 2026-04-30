"use client";

type Cat = { id: string; name: string };

const CATEGORY_EMOJI: Record<string, string> = {
  Pizza: "🍕",
  Sushi: "🍣",
  Burgers: "🍔",
  Pasta: "🍝",
  Ramen: "🍜",
  Tacos: "🌮",
  Ontbijt: "🥐",
  Salade: "🥗",
  Steak: "🥩",
  Indisch: "🍛",
  Midden: "🧆",
  Aziatisch: "🥢",
};

export function CategoryScroller({
  categories,
  activeCat,
  onSelectCat,
}: {
  categories: Cat[];
  activeCat: string;
  onSelectCat: (categoryId: string) => void;
}) {
  return (
    <div className="category-scroll flex gap-3 pb-2 pt-2">
      <button
        type="button"
        onClick={() => onSelectCat("")}
        className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition ${
          !activeCat
            ? "bg-[var(--accent)] text-white shadow-md shadow-orange-200"
            : "bg-white text-zinc-600 shadow-sm ring-1 ring-black/[0.04] hover:shadow-md"
        }`}
      >
        <span className="text-2xl">🔥</span>
        <span className="text-xs font-semibold">All</span>
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() =>
            onSelectCat(activeCat === c.id ? "" : c.id)
          }
          className={`flex shrink-0 flex-col items-center gap-1.5 rounded-2xl px-4 py-3 transition ${
            activeCat === c.id
              ? "bg-[var(--accent)] text-white shadow-md shadow-orange-200"
              : "bg-white text-zinc-600 shadow-sm ring-1 ring-black/[0.04] hover:shadow-md"
          }`}
        >
          <span className="text-2xl">{CATEGORY_EMOJI[c.name] ?? "🍽️"}</span>
          <span className="text-xs font-semibold">{c.name}</span>
        </button>
      ))}
    </div>
  );
}
