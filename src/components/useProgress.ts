import { useCallback, useSyncExternalStore } from "react";

const KEY = "hedge-fund-roadmap-progress";
const listeners = new Set<() => void>();
let cache = read();

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(done: string[]) {
  cache = done;
  localStorage.setItem(KEY, JSON.stringify(done));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useProgress() {
  const done = useSyncExternalStore(subscribe, () => cache);
  const toggle = useCallback((slug: string) => {
    write(cache.includes(slug) ? cache.filter((s) => s !== slug) : [...cache, slug]);
  }, []);
  const isDone = useCallback((slug: string) => done.includes(slug), [done]);
  return { done, isDone, toggle };
}
