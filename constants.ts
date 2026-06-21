import { IngredientCategory, Language, TagFilterValue } from './types';

/** Category filter buttons, in display order. */
export const TAG_CATEGORIES: TagFilterValue[] = ['all', 'dish', 'bakery', 'dessert'];

/** BCP-47 locale used for locale-aware ingredient sorting per language. */
export const LOCALE_MAP: Record<Language, string> = {
  en: 'en-US',
  cn: 'zh-CN',
  fr: 'fr-FR',
};

/** Ingredient categories intentionally hidden from the ingredient filter UI. */
export const HIDDEN_FILTER_CATEGORIES: IngredientCategory[] = ['seasoning'];
