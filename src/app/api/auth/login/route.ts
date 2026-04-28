import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

const body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    return NextResponse.json({ error: "E-mail of wachtwoord onjuist" }, { status: 401 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "E-mail of wachtwoord onjuist" }, { status: 401 });
  }
  if (user.role !== "ADMIN" && user.role !== "RESTAURANT") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId,
  });
  await setSessionCookie(token);
  return NextResponse.json({
    ok: true,
    role: user.role,
    restaurantId: user.restaurantId,
  });
}
