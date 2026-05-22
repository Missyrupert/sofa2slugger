"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { trackEvent } from "@/lib/analytics";

let posthogInitialized = false;
let posthogDebugLogged = false;
const playedAudio = new WeakSet<HTMLAudioElement>();

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (!ensurePostHogInitialized()) return;

    const url = new URL(window.location.href);
    const properties = {
      path: pathname,
      url: url.toString(),
      title: document.title,
    };

    posthog.capture("$pageview", {
      $current_url: url.toString(),
      path: pathname,
      title: document.title,
    });

    if (pathname === "/progress") {
      trackEvent("Progress page visited", properties);
    }

    if (
      process.env.NODE_ENV === "development" &&
      pathname === "/" &&
      url.searchParams.get("debugPostHog") === "1"
    ) {
      trackEvent("PostHog debug test", {
        path: pathname,
        debug: true,
      });
    }
  }, [pathname]);

  useEffect(() => {
    function handleTrackedClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trackedElement = target.closest<HTMLElement>(
        "[data-analytics-event]"
      );
      if (!trackedElement) return;

      const eventName = trackedElement.dataset.analyticsEvent;
      if (!eventName) return;

      trackEvent(eventName, {
        label: trackedElement.dataset.analyticsLabel,
        href:
          trackedElement instanceof HTMLAnchorElement
            ? trackedElement.href
            : undefined,
      });
    }

    function handleAudioPlay(event: Event) {
      const target = event.target;
      if (!(target instanceof HTMLAudioElement)) return;
      if (playedAudio.has(target)) return;

      playedAudio.add(target);
      trackEvent("Audio play started", {
        source: target.currentSrc || target.src,
        audio_type: target.dataset.analyticsAudioType ?? "html_audio",
      });
    }

    document.addEventListener("click", handleTrackedClick);
    document.addEventListener("play", handleAudioPlay, true);

    return () => {
      document.removeEventListener("click", handleTrackedClick);
      document.removeEventListener("play", handleAudioPlay, true);
    };
  }, []);

  return null;
}

function ensurePostHogInitialized() {
  if (posthogInitialized) return true;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (process.env.NODE_ENV === "development" && !posthogDebugLogged) {
    posthogDebugLogged = true;
    console.info("[PostHog debug]", {
      hasPostHogKey: Boolean(key),
      hasPostHogHost: Boolean(host),
      isClient: typeof window !== "undefined",
    });
  }

  if (!key) return false;

  try {
    posthog.init(key, {
      api_host: host ?? "https://us.i.posthog.com",
      defaults: "2026-01-30",
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      person_profiles: "identified_only",
      persistence: "localStorage",
      respect_dnt: true,
      ip: false,
      mask_all_element_attributes: true,
      session_recording: {
        maskAllInputs: true,
        recordHeaders: false,
        recordBody: false,
        maskCapturedNetworkRequestFn: (request) => {
          if (request.name) {
            request.name = request.name.split("?")[0];
          }
          return request;
        },
      },
    });
    posthogInitialized = true;
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[PostHog debug] init failed", error);
    }
    return false;
  }
}
