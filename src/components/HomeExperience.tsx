"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DishListItem } from "@/lib/data/dishes";
import { DishFeedTile } from "@/components/DishFeedTile";
import { HomeBottomBar } from "@/components/HomeBottomBar";
import { CategoryScroller } from "@/components/CategoryScroller";
import {
  parseHomeRadiusParam,
  type HomeRadiusKm,
} from "@/lib/home-radius";

type Cat = { id: string; name: string };

function dishMatches(
  d: DishListItem,
  q: string,
  categoryId: string,
  maxKm: number,
): boolean {
  if (d.distanceKm > maxKm) return false;
  if (categoryId && d.categoryId !== categoryId) return false;
  const s = q.trim().toLowerCase();
  if (!s) return true;
  if (d.name.toLowerCase().includes(s)) return true;
  const desc = d.description?.toLowerCase() ?? "";
  return desc.includes(s);
}

type Props = {
  allDishes: DishListItem[];
  categories: Cat[];
  initialQ: string;
  initialCat: string;
  initialRadiusParam: string | undefined;
};

export function HomeExperience({
  allDishes,
  categories,
  initialQ,
  initialCat,
  initialRadiusParam,
}: Props) {
  const initialRadius = parseHomeRadiusParam(initialRadiusParam);
  const [radiusKm, setRadiusKm] = useState<HomeRadiusKm>(initialRadius);
  const [activeCat, setActiveCat] = useState(initialCat);
  const [filterQ, setFilterQ] = useState(initialQ);
  const [draftQ, setDraftQ] = useState(initialQ);

  const visible = useMemo(
    () =>
      allDishes.filter((d) =>
        dishMatches(d, filterQ, activeCat, radiusKm),
      ),
    [allDishes, filterQ, activeCat, radiusKm],
  );

  useEffect(() => {
    const p = new URLSearchParams();
    if (filterQ.trim()) p.set("q", filterQ.trim());
    if (activeCat) p.set("cat", activeCat);
    if (radiusKm !== 1) p.set("radius", String(radiusKm));
    const qs = p.toString();
    const path = qs ? `/?${qs}` : "/";
    window.history.replaceState(window.history.state, "", path);
  }, [filterQ, activeCat, radiusKm]);

  const applySearch = useCallback(() => {
    setFilterQ(draftQ.trim());
  }, [draftQ]);

  return (
    <>
      {categories.length > 0 && (
        <div className="px-4 pt-5 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text)]">
                All Categories
              </h2>
            </div>
            <CategoryScroller
              categories={categories}
              activeCat={activeCat}
              onSelectCat={setActiveCat}
            />
          </div>
        </div>
      )}

      {visible.length === 0 && (
        <div className="flex min-h-[40vh] items-center justify-center px-8 text-center">
          <div>
            <p className="text-base font-medium text-zinc-500">
              {filterQ
                ? `Geen resultaten voor "${filterQ}"`
                : "Geen gerechten voor deze filters"}
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              Pas categorie, zoekterm of afstand aan.
            </p>
          </div>
        </div>
      )}

      {visible.length > 0 && (
        <div className="mx-auto w-full max-w-3xl px-3 pt-4 sm:px-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-3">
            {visible.map((d, i) => (
              <DishFeedTile key={d.id} dish={d} priority={i < 12} />
            ))}
          </div>
        </div>
      )}

      <HomeBottomBar
        controlled={{
          radiusKm,
          onRadiusKm: setRadiusKm,
          draftQ,
          onDraftQChange: setDraftQ,
          onApplySearch: applySearch,
        }}
      />
    </>
  );
}
