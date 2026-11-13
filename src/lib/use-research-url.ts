"use client";

import { useSyncExternalStore } from "react";
import { updateSearchParams } from "@/lib/research-context";

const locationChangeEvent = "siderospace:locationchange";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(locationChangeEvent, callback);

  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(locationChangeEvent, callback);
  };
}

function getSearch() {
  return window.location.search;
}

function getServerSearch() {
  return "";
}

export function useResearchUrl() {
  return useSyncExternalStore(subscribe, getSearch, getServerSearch);
}

export function setResearchSearchParam(key: string, value: string | null) {
  setResearchSearchParams([[key, value]], "push");
}

export function setResearchSearchParams(
  updates: readonly (readonly [string, string | null])[],
  historyMode: "push" | "replace" = "push",
) {
  const query = updateSearchParams(window.location.search, updates);
  const nextUrl = `${window.location.pathname}${query}${window.location.hash}`;

  if (`${window.location.pathname}${window.location.search}${window.location.hash}` === nextUrl) {
    return;
  }

  if (historyMode === "replace") {
    window.history.replaceState(null, "", nextUrl);
  } else {
    window.history.pushState(null, "", nextUrl);
  }
  window.dispatchEvent(new Event(locationChangeEvent));
}

export function replaceResearchSearchParam(key: string, value: string | null) {
  setResearchSearchParams([[key, value]], "replace");
}
