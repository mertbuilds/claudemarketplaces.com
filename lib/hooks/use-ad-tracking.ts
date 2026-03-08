"use client";

import { useRef, useCallback } from "react";
import { useOpenPanel } from "@openpanel/nextjs";

export function useAdViewTracking(
  eventName: string,
  properties?: Record<string, string>
) {
  const { track } = useOpenPanel();
  const hasTracked = useRef(false);
  const hasIntersected = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  return useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (!node) return;

      const isOpAvailable = () =>
        typeof window !== "undefined" && typeof window.op === "function";

      const tryTrack = () => {
        if (hasTracked.current) return;
        if (!isOpAvailable()) return;
        hasTracked.current = true;
        track(eventName, properties);
        observerRef.current?.disconnect();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            hasIntersected.current = true;
            tryTrack();
          }
        },
        { threshold: 0.5 }
      );

      observerRef.current.observe(node);

      // Poll every 500ms for elements already in viewport on load
      // when window.op isn't available yet (SDK loads afterInteractive)
      intervalRef.current = setInterval(() => {
        if (hasTracked.current) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return;
        }
        if (hasIntersected.current && isOpAvailable()) {
          tryTrack();
        }
      }, 500);
    },
    [track, eventName, properties]
  );
}
