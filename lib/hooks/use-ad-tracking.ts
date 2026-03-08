"use client";

import { useRef, useCallback } from "react";
import { useOpenPanel } from "@openpanel/nextjs";

export function useAdViewTracking(
  eventName: string,
  properties?: Record<string, string>
) {
  const { track } = useOpenPanel();
  const hasTracked = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  return useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            track(eventName, properties);
            observerRef.current?.disconnect();
          }
        },
        { threshold: 0.5 }
      );

      observerRef.current.observe(node);
    },
    [track, eventName, properties]
  );
}

export function useAdClickHandler(
  eventName: string,
  properties?: Record<string, string>
) {
  const { track } = useOpenPanel();

  return useCallback(() => {
    track(eventName, properties);
  }, [track, eventName, properties]);
}
