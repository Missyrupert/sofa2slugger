"use client";

import posthog from "posthog-js";

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export function trackEvent(
  eventName: string,
  properties: AnalyticsProperties = {}
) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  try {
    posthog.capture(eventName, properties);
  } catch {
    /* Analytics must never block the product experience. */
  }
}
