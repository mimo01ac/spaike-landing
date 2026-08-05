"use client";

import { useEffect } from "react";

const WEBSITE_ID = "0b7517b0-d5a4-4785-aaff-009e05e85ba7";
const SEND_URL = "https://analytics.spaike.dk/api/send";

// Events på samme-fane-links sendes med sendBeacon i stedet for Umamis
// data-umami-event-interception: den preventDefault'er og venter på svar fra
// analytics-serveren før den navigerer, så et nede endpoint blokerer al
// navigation. sendBeacon overlever page unload og kan aldrig holde et klik
// tilbage. _blank-links interceptes ikke og beholder data-umami-event.
function beacon(name: string, data?: Record<string, string | number>) {
  try {
    // Track kun produktionsdomænet: localhost/preview/E2E-tests må ikke
    // forurene statistikken (spejler data-domains på Umami-script-tagget).
    if (!/(^|\.)spaike\.dk$/.test(location.hostname)) return;
    const payload = {
      type: "event",
      payload: {
        website: WEBSITE_ID,
        hostname: location.hostname,
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        title: document.title,
        url: location.pathname + location.search,
        referrer: document.referrer,
        name,
        ...(data && Object.keys(data).length ? { data } : {}),
      },
    };
    // Ren streng sendes som text/plain: ingen CORS-preflight, saa beaconen er
    // et enkelt POST der overlever page unload. Umami parser body'en som JSON
    // uanset content-type.
    navigator.sendBeacon(SEND_URL, JSON.stringify(payload));
  } catch {
    // Analytics må aldrig kunne vælte siden.
  }
}

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
          beacon("scroll_depth", { percent: threshold });
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
      beacon(name, data);
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
