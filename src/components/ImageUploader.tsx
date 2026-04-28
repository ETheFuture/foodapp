"use client";

import { useState } from "react";

type Props = {
  name: string;
  defaultValue?: string;
  label?: string;
};

export function ImageUploader({ name, defaultValue, label }: Props) {
  const [url, setUrl] = useState<string>(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onFile(file: File) {
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const j = (await r.json()) as { url?: string; error?: string };
      if (!r.ok || !j.url) throw new Error(j.error ?? "Upload mislukt");
      setUrl(j.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload mislukt");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </label>
      )}
      <input type="hidden" name={name} value={url} />
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="aspect-[4/3] w-full max-w-md rounded-xl object-cover ring-1 ring-zinc-200"
        />
      ) : (
        <div className="flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400">
          Geen afbeelding
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
        <input
          type="url"
          placeholder="Plak een afbeeldings-URL (bv. Unsplash)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm"
        />
        <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">
          {busy ? "Uploaden…" : "Upload bestand"}
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {url && (
        <button
          type="button"
          onClick={() => setUrl("")}
          className="text-xs text-zinc-500 underline-offset-2 hover:underline"
        >
          Afbeelding verwijderen
        </button>
      )}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <p className="text-xs text-zinc-400">
        Bestand uploaden gebruikt Vercel Blob (env var{" "}
        <code>BLOB_READ_WRITE_TOKEN</code>). URL plakken werkt altijd.
      </p>
    </div>
  );
}
