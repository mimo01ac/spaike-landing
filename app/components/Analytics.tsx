"use client";

import { useEffect } from "react";
import { trackEvent } from "./track";

// Events på samme-fane-links sendes med sendBeacon (trackEvent) i stedet for
// Umamis data-umami-event-interception: den preventDefault'er og venter på
// svar fra analytics-serveren før den navigerer, så et nede endpoint blokerer
// al navigation. _blank-links interceptes ikke og beholder data-umami-event.

export default function Analytics() {
  useEffect(() => {
    const fired = new Set<number>();
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return;
      const pct = ((doc.scrollTop + doc.clientHeight) / doc.scrollHeight) * 100;
      [25, 50, 75, 100].forEach((threshold) => {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackEvent("scroll_depth", { percent: threshold });
        }
      });
    }

    function onClick(e: MouseEvent) {
      const target = e.target instanceof Element ? e.target : null;
      const el = target?.closest("[data-track-event]");
      if (!(el instanceof HTMLElement)) return;
      const name = el.getAttribute("data-track-event");
      if (!name) return;
      const data: Record<string, string> = {};
      for (const attr of el.getAttributeNames()) {
        const m = attr.match(/^data-track-(?!event$)(.+)/);
        if (m) data[m[1]] = el.getAttribute(attr) ?? "";
      }
      trackEvent(name, data);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
