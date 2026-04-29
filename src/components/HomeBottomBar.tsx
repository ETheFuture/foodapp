"use client";

import Link from "next/link";
import { parseHomeRadiusParam } from "@/lib/home-radius";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition, FormEvent } from "react";

const STEPS = [0.5, 1, 2, 5, 10] as const;
const LABELS = ["500m", "1km", "2km", "5km", "10km"] as const;

type Props = { defaultQ: string };

function si(r: number) {
  const i = STEPS.findIndex((x) => Math.abs(x - r) < 0.001);
  return i >= 0 ? i : 1;
}

function toUrl(q: string, km: number) {
  const p = new URLSearchParams();
  if (q.trim()) p.set("q", q.trim());
  if (km !== 1) p.set("radius", String(km));
  const s = p.toString();
  return s ? `/?${s}` : "/";
}

export function HomeBottomBar({ defaultQ }: Props) {
  const router = useRouter();
  const path = usePathname();
  const sp = useSearchParams();
  const [pending, go] = useTransition();
  const [q, setQ] = useState(defaultQ);

  const km = parseHomeRadiusParam(sp.get("radius"));
  const index = si(km);

  useEffect(() => { setQ(sp.get("q")?.trim() ?? ""); }, [sp]);

  const nav = useCallback(
    (nq: string, nk: number) => { go(() => router.push(toUrl(nq, nk), { scroll: false })); },
    [router],
  );

  const submit = (e: FormEvent) => { e.preventDefault(); nav(q, STEPS[index] ?? 1); };

  if (path !== "/") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      <div className="mx-2 rounded-2xl border border-white/20 bg-white/85 shadow-xl shadow-black/8 backdrop-blur-2xl sm:mx-auto sm:max-w-sm">
        <div className="px-3 pb-1.5 pt-2">

          {/* Search — compact */}
          <form onSubmit={submit}>
            <div className="relative">
              <svg className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                <circle cx="10.5" cy="10.5" r="5.5" /><path d="M15 15l5.5 5.5" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Zoek gerecht…"
                className="h-8 w-full rounded-full border-0 bg-zinc-100/70 pl-8 pr-16 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:ring-1 focus:ring-[var(--accent)]/30 focus:outline-hidden"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={pending}
                className="absolute right-0.5 top-0.5 h-7 rounded-full bg-[var(--accent)] px-3 text-[12px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                Zoek
              </button>
            </div>
          </form>

          {/* Slider — compact */}
          <div className="mt-1.5 flex items-center gap-2">
            <span className="shrink-0 text-[10px] font-medium text-zinc-400">
              {LABELS[index]}
            </span>
            <input
              type="range"
              min={0}
              max={STEPS.length - 1}
              step={1}
              value={index}
              onChange={(e) => nav(q, STEPS[Number(e.target.value)] ?? 1)}
              className="feed-slider h-5 min-w-0 flex-1 cursor-pointer appearance-none bg-transparent"
            />
            <span className="shrink-0 text-[10px] font-medium text-zinc-400">
              {LABELS[LABELS.length - 1]}
            </span>
          </div>

          {/* Nav — compact icons */}
          <nav className="mt-1 flex items-center justify-around" aria-label="Navigatie">
            <Tab href="/" icon="home" label="Feed" active />
            <Tab href="/search" icon="search" label="Zoek" />
            <Tab href="/map" icon="map" label="Kaart" />
            <Tab href="/favorites" icon="heart" label="Likes" />
            <Tab href="/me" icon="user" label="Profiel" />
          </nav>
        </div>
      </div>
    </div>
  );
}

function Tab({ href, icon, label, active = false }: {
  href: string; icon: string; label: string; active?: boolean;
}) {
  const c = active ? "text-[var(--accent)]" : "text-zinc-400";
  return (
    <Link href={href} className={`flex flex-col items-center gap-px py-1 ${c}`} title={label}>
      <Ico name={icon} active={active} />
      <span className="text-[9px] font-semibold">{label}</span>
    </Link>
  );
}

function Ico({ name, active }: { name: string; active: boolean }) {
  const s = active ? "var(--accent)" : "currentColor";
  const c = "h-5 w-5";
  const w = 1.7;
  const paths: Record<string, string> = {
    home: "M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z",
    map: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z",
    heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2",
  };
  if (name === "search")
    return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><circle cx="10.5" cy="10.5" r="5.5" /><path d="M15 15l6 6" /></svg>;
  if (name === "user")
    return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><path d={paths.user!} /><circle cx="12" cy="7" r="4" /></svg>;
  if (name === "map")
    return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><path d={paths.map!} /><circle cx="12" cy="9" r="2.5" /></svg>;
  return <svg className={c} fill="none" viewBox="0 0 24 24" stroke={s} strokeWidth={w} aria-hidden><path d={paths[name]!} /></svg>;
}
