import { prisma } from "@/lib/prisma";

type EventType = "view" | "click" | "route_click";

export async function trackEvent(
  type: EventType,
  entityType: "dish" | "restaurant",
  entityId: string,
) {
  try {
    await prisma.analyticsEvent.create({
      data: { type, entityType, entityId },
    });
  } catch {
    // non-blocking
  }
}

export async function getViewCount(entityType: string, entityId: string) {
  return prisma.analyticsEvent.count({
    where: { entityType, entityId, type: "view" },
  });
}
