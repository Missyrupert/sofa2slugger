"use client";

const ATTRIBUTION_KEY = "s2s_attribution";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type AttributionProperties = Partial<
  Record<(typeof UTM_KEYS)[number] | "initial_referrer", string>
>;

export function captureAttributionFromUrl(): AttributionProperties {
  if (typeof window === "undefined") return {};

  const existing = getStoredAttribution();
  const url = new URL(window.location.href);
  const next: AttributionProperties = { ...existing };
  let changed = false;

  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value && !next[key]) {
      next[key] = value;
      changed = true;
    }
  }

  if (!next.initial_referrer && document.referrer) {
    next.initial_referrer = document.referrer;
    changed = true;
  }

  if (changed) {
    try {
      window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
    } catch {
      /* Attribution should never block the product. */
    }
  }

  return next;
}

export function getStoredAttribution(): AttributionProperties {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AttributionProperties;
    return filterAttribution(parsed);
  } catch {
    return {};
  }
}

function filterAttribution(input: AttributionProperties): AttributionProperties {
  const output: AttributionProperties = {};

  for (const key of UTM_KEYS) {
    if (typeof input[key] === "string") output[key] = input[key];
  }

  if (typeof input.initial_referrer === "string") {
    output.initial_referrer = input.initial_referrer;
  }

  return output;
}
