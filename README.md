# CookingRecipe
Easy personal cooking recipe manager since I start to get old and forget recipes

## Private recipes

Recipes you don't want published live in:

```
public/data/recipes/private/<your-recipe>.json
```

- **Local dev** (`npm run dev`): private recipes are included and shown in the app.
- **Source repo**: the whole `public/data/recipes/private/` folder is git-ignored, so private recipes are never committed to GitHub.
- **Live site** (`npm run deploy`): private recipes are excluded from the index and stripped from the build output, so they never reach the public site.

A private recipe file uses the exact same format as a public one (see any file in
`public/data/recipes/`). Its internal `"id"` can be any unique slug; the loader
fetches it from the `private/` subfolder automatically.

> `public/data/index.json` is generated on every `dev`/`build` and is git-ignored.
