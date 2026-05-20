type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: AnalyticsPayload }) => void;
    gtag?: (command: "event", eventName: string, params?: AnalyticsPayload) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("s2s:analytics", {
      detail: { eventName, payload },
    })
  );

  window.plausible?.(eventName, { props: payload });
  window.gtag?.("event", eventName, payload);
  window.dataLayer?.push({ event: eventName, ...payload });
}