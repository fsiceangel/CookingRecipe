import { useCallback, useEffect, useState } from 'react';
import type { Catalog } from '../../domain/schema';

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; catalog: Catalog };
export function useCatalog() {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    void fetch(`${import.meta.env.BASE_URL}data/catalog.json`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);
        const catalog = await response.json() as Catalog;
        if (catalog.version !== 1 || !Array.isArray(catalog.recipes) || !catalog.ingredients) throw new Error('Invalid catalog');
        if (!controller.signal.aborted) setState({ status: 'ready', catalog });
      })
      .catch(() => { if (!controller.signal.aborted) setState({ status: 'error' }); });
    return () => controller.abort();
  }, [attempt]);
  return { state, retry: useCallback(() => setAttempt(value => value + 1), []) };
}
