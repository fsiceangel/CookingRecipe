import { useCallback, useState } from 'react';

export function readStored<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
    return validate(parsed) ? parsed : fallback;
  } catch { return fallback; }
}
export function writeStored(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage is optional (private browsing, quota). */ }
}
export function useStoredState<T>(key: string, fallback: T, validate: (value: unknown) => value is T) {
  const [value, setValue] = useState<T>(() => readStored(key, fallback, validate));
  const update = useCallback((next: T | ((previous: T) => T)) => {
    setValue(previous => {
      const result = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;
      writeStored(key, result);
      return result;
    });
  }, [key]);
  return [value, update] as const;
}
