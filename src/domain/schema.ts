import { z } from 'zod';
import { languages, categories, tags } from './constants';
export { languages, categories, tags } from './constants';
const text = z.string().trim().min(1);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens');
export const localizedTextSchema = z.object({ cn: text.optional(), en: text.optional(), fr: text.optional() }).strict()
  .refine(value => Object.values(value).some(Boolean), 'Provide at least one language');
const translationSchema = z.object({
  title: text,
  steps: z.array(text).min(1),
  notes: z.array(text).optional(),
}).strict();

export const recipeSchema = z.object({
  $schema: z.string().optional(),
  id,
  draft: z.boolean().optional(),
  hidden: z.boolean().optional(),
  tags: z.array(z.enum(tags)).min(1).refine(items => new Set(items).size === items.length, 'Duplicate tag'),
  difficulty: z.number().min(0).max(5).multipleOf(0.5),
  videoLink: z.string().url().refine(url => /^https?:\/\//.test(url), 'Use an HTTP(S) URL').optional(),
  defaultLanguage: z.enum(languages),
  ingredients: z.array(z.object({
    id,
    ingredient: id,
    name: localizedTextSchema.optional(),
    amount: localizedTextSchema.optional(),
  }).strict()).min(1),
  translations: z.object({ cn: translationSchema.optional(), en: translationSchema.optional(), fr: translationSchema.optional() }).strict(),
}).strict().superRefine((recipe, ctx) => {
  if (!recipe.translations[recipe.defaultLanguage]) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['translations', recipe.defaultLanguage], message: 'Default language translation is required' });
  }
  const seen = new Set<string>();
  recipe.ingredients.forEach((entry, index) => {
    if (seen.has(entry.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['ingredients', index, 'id'], message: 'Duplicate entry ID (ingredient references may repeat)' });
    seen.add(entry.id);
  });
  if (!recipe.draft && /"TODO"/.test(JSON.stringify(recipe))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Replace TODO placeholders before publishing, or keep draft: true' });
  }
});

export const registrySchema = z.record(id, z.object({
  category: z.enum(categories),
  names: localizedTextSchema,
}).strict());

export type Language = typeof languages[number];
export type Category = typeof categories[number];
export type Tag = typeof tags[number];
export type LocalizedText = z.infer<typeof localizedTextSchema>;
export type RecipeSource = z.infer<typeof recipeSchema>;
export type IngredientRegistry = z.infer<typeof registrySchema>;
export interface Catalog { version: 1; recipes: RecipeSource[]; ingredients: IngredientRegistry }
