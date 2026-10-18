import { useSyncExternalStore } from 'react';
import { emptyFilters, type Filters } from '../domain/recipes';

export interface Route { recipeId: string | null; filters: Filters }
export function parseRoute(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  const params = new URLSearchParams(query);
  const tag = params.get('tag');
  const sort = params.get('sort');
  let recipeId: string | null = null;
  if (path.startsWith('/recipes/')) {
    try { recipeId = decodeURIComponent(path.slice('/recipes/'.length)); } catch { recipeId = '__invalid__'; }
  }
  return { recipeId, filters: {
    query: params.get('q') ?? '',
    tag: tag === 'dish' || tag === 'bakery' || tag === 'dessert' ? tag : 'all',
    ingredients: [...new Set(params.getAll('ingredient'))],
    sort: sort === 'difficulty' || sort === 'title' ? sort : 'default',
  } };
}
export function routeHref(recipeId: string | null, filters: Filters = emptyFilters) {
  const query = new URLSearchParams();
  if (filters.query) query.set('q', filters.query);
  if (filters.tag !== 'all') query.set('tag', filters.tag);
  for (const ingredient of filters.ingredients) query.append('ingredient', ingredient);
  if (filters.sort !== 'default') query.set('sort', filters.sort);
  return `#/${recipeId ? `recipes/${encodeURIComponent(recipeId)}` : ''}${query.size ? `?${query}` : ''}`;
}
const eventName = 'recipe:navigation';
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  window.addEventListener('popstate', callback);
  window.addEventListener(eventName, callback);
  return () => {
    window.removeEventListener('hashchange', callback);
    window.removeEventListener('popstate', callback);
    window.removeEventListener(eventName, callback);
  };
}
export function useRoute() {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash);
  return parseRoute(hash);
}
export function changeFilters(filters: Filters) {
  history.replaceState(history.state, '', routeHref(null, filters));
  window.dispatchEvent(new Event(eventName));
}

let listPosition: { y: number; id: string } | undefined;
export function rememberList(id: string) { listPosition = { y: window.scrollY, id }; }
export function restoreList() {
  if (!listPosition) return;
  document.getElementById(`recipe-${listPosition.id}`)?.focus({ preventScroll: true });
  window.scrollTo({ top: listPosition.y, behavior: 'instant' });
}
