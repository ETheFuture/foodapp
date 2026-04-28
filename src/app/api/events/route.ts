import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  type: z.enum(["view", "click", "route_click"]),
  entityType: z.enum(["dish", "restaurant"]),
  entityId: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldig" }, { status: 400 });
  }
  await prisma.analyticsEvent.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
