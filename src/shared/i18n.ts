import type { Language } from '../domain/schema';

const cn = {
  app: '我的食谱', appShort: '我的食谱', clearSearch: '清空搜索',
  search: '搜索菜名或食材', searchHint: '试试「牛肉」或「蛋糕」',
  all: '全部食谱', dish: '家常菜', bakery: '烘焙', dessert: '甜点',
  filters: '配料筛选', filterHint: '查找同时包含这些配料的食谱。', ingredientSearch: '查找配料',
  meat: '肉类、鱼与蛋', veggie: '蔬菜与果仁', dairy: '乳制品', pantry: '粮食与常备品', seasoning: '调味料',
  clear: '清空筛选', done: '查看食谱', close: '关闭', remove: '移除', results: '份食谱', of: '/',
  sort: '排序', default: '默认顺序', difficulty: '难度', difficultySort: '难度从低到高', titleSort: '按名称',
  steps: '步骤', ingredients: '配料', notes: '烹饪笔记', more: '项配料', back: '返回食谱',
  video: '观看原视频', prepared: '已备齐', completed: '已完成', reset: '重置进度',
  empty: '暂时没有匹配的食谱', emptyHint: '试试更短的关键词，或减少配料条件。',
  loading: '正在翻开食谱…', error: '食谱暂时未能加载', errorHint: '请检查网络连接，再试一次。', retry: '重新加载',
  notFound: '没有找到这份食谱', notFoundHint: '这份食谱可能已更名，返回列表看看吧。',
  light: '切换到浅色模式', dark: '切换到深色模式', language: '语言',
  fallback: '这份食谱尚未提供当前语言，显示原文。', print: '打印食谱', skip: '跳到主要内容',
  noIngredients: '没有匹配的配料',
  filterCount: '项已选', progress: '烹饪进度', ready: '准备开做', finished: '这道菜完成了，享用吧。',
};
export type Messages = { [Key in keyof typeof cn]: string };
const en: Messages = {
  app: 'My recipe book', appShort: 'Recipes', clearSearch: 'Clear search',
  search: 'Search recipes or ingredients', searchHint: 'Try “beef” or “cake”',
  all: 'All recipes', dish: 'Dishes', bakery: 'Baking', dessert: 'Desserts',
  filters: 'Ingredients', filterHint: 'Find recipes containing every selected ingredient.', ingredientSearch: 'Find an ingredient',
  meat: 'Meat, fish & eggs', veggie: 'Vegetables & nuts', dairy: 'Dairy', pantry: 'Pantry', seasoning: 'Seasonings',
  clear: 'Clear filters', done: 'View recipes', close: 'Close', remove: 'Remove', results: 'recipes', of: '/',
  sort: 'Sort', default: 'Original order', difficulty: 'Difficulty', difficultySort: 'Easiest first', titleSort: 'By name',
  steps: 'Steps', ingredients: 'Ingredients', notes: 'Kitchen notes', more: 'more ingredients', back: 'Back to recipes',
  video: 'Watch original video', prepared: 'prepared', completed: 'completed', reset: 'Reset progress',
  empty: 'No recipes found', emptyHint: 'Try a shorter search or select fewer ingredients.',
  loading: 'Opening the recipe book…', error: 'Could not load the recipes', errorHint: 'Check your connection and try again.', retry: 'Try again',
  notFound: 'Recipe not found', notFoundHint: 'It may have been renamed. Explore the collection instead.',
  light: 'Switch to light mode', dark: 'Switch to dark mode', language: 'Language',
  fallback: 'This recipe is not yet available in your language. Showing the original.', print: 'Print recipe', skip: 'Skip to content',
  noIngredients: 'No matching ingredients',
  filterCount: 'selected', progress: 'Cooking progress', ready: 'Ready to cook', finished: 'All done. Enjoy your meal.',
};
const fr: Messages = {
  app: 'Mon livre de recettes', appShort: 'Recettes', clearSearch: 'Effacer la recherche',
  search: 'Rechercher un plat ou un ingrédient', searchHint: 'Essayez « bœuf » ou « gâteau »',
  all: 'Toutes', dish: 'Plats', bakery: 'Boulangerie', dessert: 'Desserts',
  filters: 'Ingrédients', filterHint: 'Trouvez les recettes contenant tous les ingrédients choisis.', ingredientSearch: 'Rechercher un ingrédient',
  meat: 'Viande, poisson et œufs', veggie: 'Légumes et fruits à coque', dairy: 'Produits laitiers', pantry: 'Épicerie', seasoning: 'Assaisonnements',
  clear: 'Effacer les filtres', done: 'Voir les recettes', close: 'Fermer', remove: 'Retirer', results: 'recettes', of: '/',
  sort: 'Trier', default: 'Ordre initial', difficulty: 'Difficulté', difficultySort: 'Les plus faciles', titleSort: 'Par nom',
  steps: 'Étapes', ingredients: 'Ingrédients', notes: 'Notes de cuisine', more: 'autres ingrédients', back: 'Retour aux recettes',
  video: 'Voir la vidéo originale', prepared: 'préparés', completed: 'terminées', reset: 'Réinitialiser',
  empty: 'Aucune recette trouvée', emptyHint: 'Essayez une recherche plus courte ou moins d’ingrédients.',
  loading: 'Ouverture du livre…', error: 'Impossible de charger les recettes', errorHint: 'Vérifiez votre connexion et réessayez.', retry: 'Réessayer',
  notFound: 'Recette introuvable', notFoundHint: 'Elle a peut-être été renommée. Retrouvez toutes les recettes.',
  light: 'Passer au thème clair', dark: 'Passer au thème sombre', language: 'Langue',
  fallback: 'Cette recette n’est pas encore disponible dans votre langue. Voici l’original.', print: 'Imprimer la recette', skip: 'Aller au contenu',
  noIngredients: 'Aucun ingrédient correspondant',
  filterCount: 'sélectionnés', progress: 'Progression', ready: 'À vos fourneaux', finished: 'C’est prêt. Bon appétit !',
};
export const messages: Record<Language, Messages> = { cn, en, fr };
export function recipeCount(count: number, language: Language) {
  return language === 'cn' ? `${count} 份食谱` : language === 'fr' ? `${count} recette${count > 1 ? 's' : ''}` : `${count} recipe${count === 1 ? '' : 's'}`;
}
export function isLanguage(value: unknown): value is Language { return value === 'cn' || value === 'en' || value === 'fr'; }
