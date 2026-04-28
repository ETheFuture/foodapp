"use client";

import { useState, useTransition } from "react";
import { updateProfileAction } from "@/app/dashboard/profile-actions";

export function ProfileForm(props: {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  priceRange: string;
  cuisineType: string;
  openingHoursJson: string | null;
}) {
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      className="max-w-md space-y-3 rounded-2xl border border-zinc-200 bg-white p-4"
      action={(f) => {
        setErr(null);
        start(async () => {
          const r = await updateProfileAction({
            id: props.id,
            name: String(f.get("name") ?? "").trim(),
            description: String(f.get("description") ?? "").trim() || null,
            address: String(f.get("address") ?? "").trim(),
            phone: String(f.get("phone") ?? "").trim() || null,
            website: String(f.get("website") ?? "").trim() || null,
            instagram: String(f.get("instagram") ?? "").trim() || null,
            priceRange: String(f.get("priceRange") ?? "").trim() || "€€",
            cuisineType: String(f.get("cuisineType") ?? "").trim(),
            openingHoursJson: String(f.get("openingJson") ?? "").trim() || null,
          });
          if (r && "error" in r) setErr(r.error ?? "Fout");
        });
      }}
    >
      {[
        { k: "name", label: "Naam", type: "text" as const, d: props.name, req: true },
        { k: "description", label: "Beschrijving", type: "textarea" as const, d: props.description },
        { k: "address", label: "Adres", type: "text" as const, d: props.address, req: true },
        { k: "phone", label: "Telefoon", type: "text" as const, d: props.phone },
        { k: "website", label: "Website", type: "url" as const, d: props.website },
        { k: "instagram", label: "Instagram", type: "text" as const, d: props.instagram },
        { k: "cuisineType", label: "Keuken", type: "text" as const, d: props.cuisineType, req: true },
        { k: "priceRange", label: "Prijs (€, €€, …)", type: "text" as const, d: props.priceRange, req: true },
      ].map((field) =>
        field.type === "textarea" ? (
          <div key={field.k}>
            <label className="text-xs text-zinc-500">{field.label}</label>
            <textarea
              name={field.k}
              className="mt-0.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              rows={3}
              defaultValue={field.d ?? ""}
            />
          </div>
        ) : (
          <div key={field.k}>
            <label className="text-xs text-zinc-500">{field.label}</label>
            <input
              name={field.k}
              type={field.type}
              className="mt-0.5 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              defaultValue={field.d ?? ""}
              required={field.req}
            />
          </div>
        ),
      )}
      <div>
        <label className="text-xs text-zinc-500">Openingstijden (JSON, optioneel)</label>
        <textarea
          name="openingJson"
          className="mt-0.5 w-full rounded-lg border border-zinc-200 px-3 py-2 font-mono text-xs"
          rows={3}
          defaultValue={props.openingHoursJson ?? `{"ma":"12-22", "zo":"10-20"}`}
        />
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
      >
        {pending ? "…" : "Opslaan"}
      </button>
    </form>
  );
}
