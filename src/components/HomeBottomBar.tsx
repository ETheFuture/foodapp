"use client";

import Link from "next/link";
import { parseHomeRadiusParam } from "@/lib/home-radius";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition, FormEvent } from "react";

const RADII_KM = [0.5, 1, 2, 5, 10] as const;
const LABELS = ["500m", "1km", "2km", "5km", "10km"] as const;

type Props = { defaultQ: string };

function indexForRadius(r: number): number {
  const i = RADII_KM.findIndex((x) => Math.abs(x - r) < 0.001);
  return i >= 0 ? i : 1;
}

function buildPath(q: string, km: number): string {
  const p = new URLSearchParams();
  if (q.trim()) p.set("q", q.trim());
  if (km !== 1) p.set("radius", String(km));
  const s = p.toString();
  return s ? `/?${s}` : "/";
}

export function HomeBottomBar({ defaultQ }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState(defaultQ);
  const km = parseHomeRadiusParam(searchParams.get("radius"));
  const sliderIndex = indexForRadius(km);

  useEffect(() => {
    setQ(searchParams.get("q")?.trim() ?? "");
  }, [searchParams]);

  const applyUrl = useCallback(
    (nextQ: string, nextKm: number) => {
      startTransition(() => {
        router.push(buildPath(nextQ, nextKm), { scroll: false });
      });
    },
    [router],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    applyUrl(q, parseHomeRadiusParam(searchParams.get("radius")));
  };

  const onSlider = (idx: number) => {
    const n = Math.max(0, Math.min(RADII_KM.length - 1, idx));
    applyUrl(q, RADII_KM[n] ?? 1);
  };

  if (pathname !== "/") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-1px_0_rgba(0,0,0,0.06)] backdrop-blur-xl">
      <div className="mx-auto w-full max-w-md px-4">
        {/* Search */}
        <form onSubmit={onSubmit} className="mb-3">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden
              >
                <circle cx="10.5" cy="10.5" r="5.5" />
                <path d="M15 15l6 6" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Zoek gerecht…"
                className="h-10 w-full rounded-xl border-0 bg-zinc-100 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-zinc-50 focus:ring-2 focus:ring-[var(--accent)]/25 focus:outline-hidden"
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="h-10 shrink-0 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              disabled={pending}
            >
              Zoek
            </button>
          </div>
        </form>

        {/* Distance slider */}
        <div className="mb-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-medium text-zinc-400">Afstand</span>
            <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-700">
              {LABELS[sliderIndex]}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={RADII_KM.length - 1}
            step={1}
            value={sliderIndex}
            onChange={(e) => onSlider(Number(e.target.value))}
            className="feed-distance-slider h-6 w-full cursor-pointer appearance-none bg-transparent"
          />
          <div className="flex justify-between px-0.5 text-[9px] text-zinc-400">
            {LABELS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Nav icons */}
        <nav className="flex items-center justify-around" aria-label="Navigatie">
          <NavIcon href="/" icon="home" label="Feed" isActive />
          <NavIcon href="/search" icon="search" label="Zoek" />
          <NavIcon href="/map" icon="map" label="Kaart" />
          <NavIcon href="/favorites" icon="heart" label="Likes" />
          <NavIcon href="/me" icon="user" label="Profiel" />
        </nav>
      </div>
    </div>
  );
}

function NavIcon({
  href, icon, label, isActive = false,
}: {
  href: string; icon: string; label: string; isActive?: boolean;
}) {
  const color = isActive ? "text-[var(--accent)]" : "text-zinc-400 hover:text-zinc-700";
  return (
    <Link href={href} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 ${color}`} title={label}>
      <NavSvg name={icon} active={isActive} />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

function NavSvg({ name, active }: { name: string; active: boolean }) {
  const c = "h-[22px] w-[22px]";
  const s = active ? "var(--accent)" : "currentColor";
  const w = 1.6;
  if (name === "home")
    return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" /></svg>;
  if (name === "search")
    return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><circle cx="10.5" cy="10.5" r="5.5" /><path d="M15 15l6 6" /></svg>;
  if (name === "map")
    return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" /><circle cx="12" cy="9" r="2.5" /></svg>;
  if (name === "heart")
    return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>;
  return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
