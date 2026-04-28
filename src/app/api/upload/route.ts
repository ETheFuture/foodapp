import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { readSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const s = await readSession();
  if (!s || (s.role !== "ADMIN" && s.role !== "RESTAURANT")) {
    return NextResponse.json({ error: "Geen toegang" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob is niet geconfigureerd. Maak een Blob store in Vercel (Storage → Blob) en voeg BLOB_READ_WRITE_TOKEN toe als env var.",
      },
      { status: 503 },
    );
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Geen bestand" }, { status: 400 });
    }
    const f = file as File;
    if (f.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `Te groot (max ${MAX_BYTES / 1024 / 1024} MB)` },
        { status: 400 },
      );
    }
    if (!f.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Alleen afbeeldingen zijn toegestaan" },
        { status: 400 },
      );
    }
    const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 64);
    const key = `dishes/${Date.now()}-${safeName}`;
    const blob = await put(key, f, {
      access: "public",
      addRandomSuffix: true,
      contentType: f.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload faalde";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
