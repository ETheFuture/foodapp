"use client";

import Link from "next/link";
import { parseHomeRadiusParam } from "@/lib/home-radius";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition, FormEvent } from "react";

const RADII_KM = [0.5, 1, 2, 5, 10] as const;
const LABELS = ["500 m", "1 km", "2 km", "5 km", "10 km"] as const;

type Props = {
  defaultQ: string;
};

function parseRadiusParam(s: string | null) {
  return parseHomeRadiusParam(s);
}

function indexForRadius(r: number): number {
  const i = RADII_KM.findIndex(
    (x) => Math.abs(x - r) < 0.001,
  );
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

  const km = parseRadiusParam(searchParams.get("radius"));
  const sliderIndex = indexForRadius(km);

  useEffect(() => {
    setQ(searchParams.get("q")?.trim() ?? "");
  }, [searchParams]);

  const applyUrl = useCallback(
    (nextQ: string, nextKm: number) => {
      const path = buildPath(nextQ, nextKm);
      startTransition(() => {
        router.push(path, { scroll: false });
      });
    },
    [router],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    applyUrl(q, parseRadiusParam(searchParams.get("radius")));
  };

  const onSliderInput = (idx: number) => {
    const n = Math.max(0, Math.min(RADII_KM.length - 1, idx));
    const nextKm = RADII_KM[n] ?? 1;
    applyUrl(q, nextKm);
  };

  if (pathname !== "/") {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200/90 bg-[var(--bg)]/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] backdrop-blur-md"
    >
      <div className="mx-auto w-full max-w-lg px-3 sm:px-4">
        <form onSubmit={onSubmit} className="mb-2">
          <label htmlFor="home-feed-q" className="sr-only">
            Zoek gerechten
          </label>
          <div className="flex gap-2">
            <input
              id="home-feed-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Zoek op gerecht, keuken…"
              className="h-11 min-w-0 flex-1 rounded-2xl border border-zinc-200 bg-white px-3.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2 focus:ring-[var(--accent)]/20 focus:outline-hidden"
              autoComplete="off"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-2xl bg-[var(--accent)] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
              disabled={pending}
            >
              Zoek
            </button>
          </div>
        </form>

        <div className="mb-2 px-0.5">
          <div className="mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-zinc-500">
            <span>Afstand</span>
            <span className="text-[var(--text)]">
              {LABELS[sliderIndex] ?? "1 km"}
            </span>
          </div>
          <div className="flex gap-0.5">
            {RADII_KM.map((v, i) => (
              <div
                key={String(v)}
                className={`h-1.5 flex-1 rounded-sm ${
                  i === sliderIndex ? "bg-[var(--accent)]" : "bg-zinc-200/80"
                }`}
                aria-hidden
              />
            ))}
          </div>
          <input
            type="range"
            min={0}
            max={RADII_KM.length - 1}
            step={1}
            value={sliderIndex}
            onChange={(e) => onSliderInput(Number(e.target.value))}
            className="feed-distance-slider mt-0.5 h-9 w-full cursor-pointer appearance-none bg-transparent [-webkit-tap-highlight-color:transparent]"
            aria-label="Maximale afstand tot restaurant"
            aria-valuemin={0}
            aria-valuemax={RADII_KM.length - 1}
            aria-valuenow={sliderIndex}
          />
          <div className="flex justify-between text-[9px] text-zinc-400 sm:text-[10px]">
            {LABELS.map((lab) => (
              <span key={lab}>{lab}</span>
            ))}
          </div>
        </div>

        <nav
          className="flex items-center justify-around border-t border-zinc-100 pt-1.5"
          aria-label="Hoofdnavigatie"
        >
          <NavIcon href="/" label="Feed" title="Feed" icon="home" isActive />
          <NavIcon href="/search" label="Zoek" title="Zoeken" icon="search" />
          <NavIcon href="/map" label="Kaart" title="Kaart" icon="map" />
          <NavIcon
            href="/favorites"
            label="Likes"
            title="Favorieten"
            icon="heart"
          />
          <NavIcon href="/me" label="Profiel" title="Profiel" icon="user" />
        </nav>
      </div>
    </div>
  );
}

function NavIcon({
  href,
  label,
  title,
  isActive = false,
  icon,
}: {
  href: string;
  label: string;
  title: string;
  isActive?: boolean;
  icon: "home" | "search" | "map" | "heart" | "user";
}) {
  const active = isActive;
  const className = `flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[9px] font-medium sm:text-[10px] ${
    active
      ? "text-[var(--accent)]"
      : "text-zinc-500 hover:text-zinc-800"
  }`;
  return (
    <Link href={href} className={className} title={title}>
      <Icon name={icon} active={active} />
      <span>{label}</span>
    </Link>
  );
}

function Icon({
  name,
  active,
}: {
  name: "home" | "search" | "map" | "heart" | "user";
  active: boolean;
}) {
  const c = "h-6 w-6";
  const stroke = active ? "var(--accent)" : "currentColor";
  if (name === "home")
    return (
      <svg
        className={c}
        fill="none"
        viewBox="0 0 24 24"
        stroke={stroke}
        strokeWidth={1.8}
        aria-hidden
      >
        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z" />
      </svg>
    );
  if (name === "search")
    return (
      <svg
        className={c}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <circle cx="10.5" cy="10.5" r="5.5" />
        <path d="M15 15 21 21" />
      </svg>
    );
  if (name === "map")
    return (
      <svg
        className={c}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path d="M3 4.5 8 3.5V19L3 18.5V4.5Z" />
        <path d="M8 3.5 16 2V16.5L8 19V3.5Z" />
        <path d="M16 2 21 1V16l-5 2.5" />
        <path d="M8 7l4 2" />
        <path d="M8 12l3 1" />
      </svg>
    );
  if (name === "heart")
    return (
      <svg
        className={c}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  return (
    <svg
      className={c}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
