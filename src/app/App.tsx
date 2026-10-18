import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { Alert, Box, Button, CircularProgress, Container, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { type Appearance, isAppearance, recipeTheme } from './theme';
import { Header } from './Header';
import { useRoute, restoreList, routeHref } from './navigation';
import { isLanguage, messages } from '../shared/i18n';
import { useStoredState } from '../shared/storage';
import { locale, translateRecipe } from '../domain/recipes';
import { useCatalog } from '../features/recipes/useCatalog';
import { RecipeList } from '../features/recipes/RecipeList';
import type { Language } from '../domain/schema';

const RecipeDetail = lazy(() => import('../features/recipes/RecipeDetail'));
export default function App() {
  const [language, setLanguage] = useStoredState<Language>('recipe.language', 'cn', isLanguage);
  const [appearance, setAppearance] = useStoredState<Appearance>('recipe.theme', document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', isAppearance);
  const theme = useMemo(() => recipeTheme(appearance), [appearance]);
  const text = messages[language];
  const route = useRoute();
  const { state, retry } = useCatalog();
  const recipes = useMemo(() => state.status === 'ready' ? state.catalog.recipes.map(source => translateRecipe(source, state.catalog.ingredients, language)) : [], [state, language]);
  const selected = route.recipeId ? recipes.find(recipe => recipe.id === route.recipeId) : undefined;
  const previousId = useRef<string | null>(null);
  useEffect(() => {
    document.documentElement.lang = locale(language);
    document.documentElement.dataset.theme = appearance;
    document.documentElement.style.colorScheme = appearance;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', appearance === 'light' ? '#f4f7fb' : '#181d25');
    document.title = selected ? `${selected.title} · ${text.app}` : `${text.app} · Cooking Recipe`;
  }, [language, appearance, selected, text.app]);
  useEffect(() => {
    if (state.status !== 'ready') return;
    if (route.recipeId) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (previousId.current) restoreList();
    previousId.current = route.recipeId;
  }, [route.recipeId, state.status]);
  const loading = <Box role="status" sx={{ py: 10, textAlign: 'center' }}><CircularProgress size={32} /><Typography sx={{ mt: 2 }}>{text.loading}</Typography></Box>;
  return <ThemeProvider theme={theme}>
    <CssBaseline />
    <Box component="a" className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); }}>{text.skip}</Box>
    <Header language={language} onLanguage={setLanguage} appearance={appearance} onToggle={() => setAppearance(value => value === 'light' ? 'dark' : 'light')} text={text} />
    <Container component="main" id="main" tabIndex={-1} maxWidth="lg" sx={{ minHeight: '65vh', outline: 'none', pb: 4 }}>
      {state.status === 'loading' && loading}
      {state.status === 'error' && <Alert severity="error" sx={{ my: 5 }} action={<Button onClick={retry}>{text.retry}</Button>}><Typography fontWeight={500}>{text.error}</Typography>{text.errorHint}</Alert>}
      {state.status === 'ready' && (route.recipeId ? selected ? <Suspense fallback={loading}>
        <RecipeDetail key={selected.id} recipe={selected} filters={route.filters} language={language} text={text} />
      </Suspense> : <Box sx={{ py: 10, textAlign: 'center' }}><Typography variant="h2" component="h1">{text.notFound}</Typography><Typography color="text.secondary" sx={{ my: 2 }}>{text.notFoundHint}</Typography><Button component="a" href={routeHref(null, route.filters)} variant="contained">{text.back}</Button></Box>
      : <RecipeList catalog={state.catalog} recipes={recipes} filters={route.filters} language={language} text={text} />)}
    </Container>
  </ThemeProvider>;
}
