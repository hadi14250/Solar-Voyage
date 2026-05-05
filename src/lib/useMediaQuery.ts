"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query — uses useSyncExternalStore so we don't
 * trip the React 19 "setState in effect" lint and avoid hydration glitches.
 *
 * Default server snapshot is `defaultMatches`, so SSR markup matches the
 * common case (e.g. desktop layout).
 */
export function useMediaQuery(
  query: string,
  defaultMatches: boolean = false
): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => defaultMatches
  );
}

export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 640px)", true);
}
