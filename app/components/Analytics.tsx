"use client";

import { useEffect } from "react";

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
          window.umami?.track("scroll_depth", { percent: threshold });
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
