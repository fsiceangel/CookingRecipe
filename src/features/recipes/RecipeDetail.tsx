import { useEffect, useMemo } from 'react';
import { Alert, Box, Button, Checkbox, Chip, FormControlLabel, LinearProgress, Paper, Typography } from '@mui/material';
import { type Filters, type Recipe, locale } from '../../domain/recipes';
import type { Language } from '../../domain/schema';
import type { Messages } from '../../shared/i18n';
import { BackIcon, CheckIcon, NotesIcon, PrintIcon, ResetIcon, VideoIcon } from '../../shared/icons';
import { useStoredState } from '../../shared/storage';
import { routeHref } from '../../app/navigation';

interface Props { recipe: Recipe; filters: Filters; language: Language; text: Messages }
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string');
export default function RecipeDetail({ recipe, filters, language, text }: Props) {
  useEffect(() => { document.getElementById('page-title')?.focus({ preventScroll: true }); }, [recipe.id]);
  // RecipeDetail is keyed by recipe ID. Step text is part of the key so edited steps do not remain checked.
  const [checked, setChecked] = useStoredState<string[]>(`recipe.progress.${recipe.id}`, [], isStringArray);
  const ingredientIds = useMemo(() => recipe.ingredients.map(entry => `ingredient:${entry.id}`), [recipe.ingredients]);
  const stepIds = useMemo(() => recipe.steps.map((step, index) => `step:${recipe.language}:${index}:${step}`), [recipe.steps, recipe.language]);
  const prepared = ingredientIds.filter(id => checked.includes(id)).length;
  const completed = stepIds.filter(id => checked.includes(id)).length;
  const percent = Math.round((completed / recipe.steps.length) * 100);
  function toggle(id: string) { setChecked(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]); }
  return <Box sx={{ py: { xs: 3, sm: 4 } }}>
    <Box className="no-print" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 3 }}>
      <Button component="a" href={routeHref(null, filters)} startIcon={<BackIcon />} sx={{ px: 1 }}>{text.back}</Button>
      <Button onClick={() => window.print()} startIcon={<PrintIcon />} sx={{ px: 1 }}>{text.print}</Button>
    </Box>
    {recipe.language !== language && <Alert severity="info" sx={{ mb: 3 }}>{text.fallback}</Alert>}
    <Box component="header" sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>{recipe.tags.map(tag => <Chip key={tag} label={text[tag]} color="primary" variant="outlined" size="small" />)}<Chip size="small" label={`${text.difficulty} ${recipe.difficulty}/5`} /></Box>
      <Typography id="page-title" tabIndex={-1} component="h1" variant="h1" lang={locale(recipe.language)} sx={{ fontSize: { xs: '2rem', sm: '2.65rem' }, maxWidth: 900, overflowWrap: 'anywhere', outline: 'none !important', mb: 2 }}>{recipe.title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>{recipe.ingredients.length} {text.ingredients} · {recipe.steps.length} {text.steps}</Typography>
      {recipe.videoLink && <Button className="no-print" component="a" href={recipe.videoLink} target="_blank" rel="noopener noreferrer" startIcon={<VideoIcon />} variant="contained">{text.video}</Button>}
    </Box>
    <Box className="no-print" component="nav" aria-label={text.ready} sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, flexWrap: 'wrap', mb: 3 }}>
      {[['ingredients', text.ingredients], ['steps', text.steps], ...(recipe.notes.length ? [['notes', text.notes]] : [])].map(([id, label]) =>
        <Button key={id} variant="outlined" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })}>{label}</Button>)}
    </Box>
    <Box className="recipe-layout" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '340px minmax(0,1fr)' }, gap: { xs: 3, md: 4 }, alignItems: 'start' }}>
      <Paper component="section" variant="outlined" id="ingredients" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: '24px', scrollMarginTop: 96 }}>
        <Typography component="h2" variant="h2" sx={{ mb: .75 }}>{text.ingredients}</Typography>
        <Typography variant="body2" color="text.secondary" className="no-print" role="status" sx={{ mb: 2 }}>{prepared}/{recipe.ingredients.length} {text.prepared}</Typography>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {recipe.ingredients.map((ingredient, index) => <Box component="li" key={ingredient.id} sx={{ borderBottom: index < recipe.ingredients.length - 1 ? '1px solid' : 'none', borderColor: 'divider', py: .75 }}>
            <FormControlLabel sx={{ m: 0, width: '100%', alignItems: 'start', '.MuiFormControlLabel-label': { flex: 1, minWidth: 0, py: 1.1 } }}
              control={<Checkbox checked={checked.includes(ingredientIds[index])} onChange={() => toggle(ingredientIds[index])} size="small" sx={{ ml: -1 }} />}
              label={<Box lang={locale(recipe.language)} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ textDecoration: checked.includes(ingredientIds[index]) ? 'line-through' : 'none' }}>{ingredient.name}</Typography>
                {ingredient.amount && <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>{ingredient.amount}</Typography>}
              </Box>} />
          </Box>)}
        </Box>
      </Paper>
      <Box>
        <Paper variant="outlined" className="no-print" sx={{ p: 2.5, mb: 3, bgcolor: 'primary.light', borderColor: 'transparent', borderRadius: '20px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography fontWeight={500}>{completed === recipe.steps.length ? text.finished : text.progress}</Typography>
            <Typography variant="body2">{completed}/{recipe.steps.length}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={percent} aria-label={text.progress} sx={{ height: 6, borderRadius: 6, mb: 1 }} />
          <Button size="small" startIcon={<ResetIcon />} onClick={() => setChecked([])} disabled={!checked.length} sx={{ px: 0 }}>{text.reset}</Button>
        </Paper>
        <Box component="section" id="steps" sx={{ scrollMarginTop: 96 }}>
          <Typography component="h2" variant="h2" sx={{ mb: 2 }}>{text.steps}</Typography>
          <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {recipe.steps.map((step, index) => {
              const done = checked.includes(stepIds[index]);
              return <Paper component="li" variant="outlined" key={stepIds[index]} sx={{ mb: 2, borderRadius: '20px', borderColor: done ? 'primary.main' : 'divider' }}>
                <FormControlLabel sx={{ width: '100%', m: 0, p: { xs: 2, sm: 2.5 }, gap: 2, alignItems: 'flex-start', '.MuiFormControlLabel-label': { flex: 1, minWidth: 0 } }}
                  control={<Checkbox checked={done} onChange={() => toggle(stepIds[index])} aria-label={`${text.steps} ${index + 1}`} data-step={index + 1}
                    icon={<Box className="step-number" sx={{ width: 36, height: 36, borderRadius: '12px', bgcolor: 'primary.light', color: 'primary.main', display: 'grid', placeItems: 'center', fontSize: 16 }}>{index + 1}</Box>}
                    checkedIcon={<Box className="step-number" sx={{ width: 36, height: 36, borderRadius: '12px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center' }}><CheckIcon fontSize="small" /></Box>} sx={{ p: .5 }} />}
                  label={<Typography lang={locale(recipe.language)} sx={{ pt: .6, color: done ? 'text.secondary' : 'text.primary' }}>{step}</Typography>} />
              </Paper>;
            })}
          </Box>
        </Box>
        {recipe.notes.length > 0 && <Paper component="section" id="notes" elevation={0} sx={{ p: 3, mt: 3, bgcolor: 'secondary.light', borderRadius: '24px', scrollMarginTop: 96 }}>
          <Typography variant="h3" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><NotesIcon />{text.notes}</Typography>
          {recipe.notes.map((note, index) => <Typography key={index} lang={locale(recipe.language)} variant="body2" sx={{ mb: index < recipe.notes.length - 1 ? 1.5 : 0 }}>{note}</Typography>)}
        </Paper>}
      </Box>
    </Box>
  </Box>;
}
