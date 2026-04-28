"use client";

import { useEffect } from "react";

type Props = {
  entityType: "dish" | "restaurant";
  entityId: string;
};

export function TrackView({ entityType, entityId }: Props) {
  useEffect(() => {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "view", entityType, entityId }),
    });
  }, [entityType, entityId]);
  return null;
}
