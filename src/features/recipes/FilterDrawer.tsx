import { useMemo, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Drawer, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import type { Catalog, Language } from '../../domain/schema';
import { categories } from '../../domain/constants';
import { availableIngredients, filterRecipes, normalizeSearch, type Filters, type Recipe } from '../../domain/recipes';
import type { Messages } from '../../shared/i18n';
import { CheckIcon, CloseIcon, ExpandIcon, SearchIcon } from '../../shared/icons';

interface Props { open: boolean; close: () => void; catalog: Catalog; recipes: Recipe[]; filters: Filters; onChange: (filters: Filters) => void; language: Language; text: Messages; resultCount: number }
export function FilterDrawer({ open, close, catalog, recipes, filters, onChange, language, text, resultCount }: Props) {
  const [query, setQuery] = useState('');
  const ingredients = useMemo(() => availableIngredients(catalog, language), [catalog, language]);
  const visible = ingredients.filter(ingredient => normalizeSearch(ingredient.name).includes(normalizeSearch(query)));
  function toggle(key: string) {
    onChange({ ...filters, ingredients: filters.ingredients.includes(key) ? filters.ingredients.filter(value => value !== key) : [...filters.ingredients, key] });
  }
  return <Drawer anchor="right" open={open} onClose={close} slotProps={{ paper: { role: 'dialog', 'aria-modal': true, 'aria-labelledby': 'filter-heading', sx: { width: { xs: '100%', sm: 440 }, borderRadius: { xs: 0, sm: '28px 0 0 28px' } } } }}>
    <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography id="filter-heading" component="h2" variant="h2">{text.filters}</Typography><IconButton aria-label={text.close} onClick={close}><CloseIcon /></IconButton>
    </Box>
    <Box sx={{ px: 3, pb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{text.filterHint}</Typography>
      <TextField fullWidth size="small" label={text.ingredientSearch} value={query} onChange={event => setQuery(event.target.value)}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }} />
    </Box>
    <Box sx={{ overflowY: 'auto', flex: 1, px: 3, pb: 2 }}>
      {visible.length === 0 && <Typography color="text.secondary">{text.noIngredients}</Typography>}
      {categories.map(category => {
        const group = visible.filter(ingredient => ingredient.category === category);
        if (!group.length) return null;
        return <Accordion key={`${category}-${Boolean(query)}`} defaultExpanded={category !== 'seasoning' || Boolean(query)} disableGutters elevation={0} sx={{ '&::before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'divider' }}>
          <AccordionSummary expandIcon={<ExpandIcon />} sx={{ px: 0 }}><Typography fontWeight={500}>{text[category]}</Typography></AccordionSummary>
          <AccordionDetails sx={{ p: 0, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {group.map(ingredient => {
              const selected = filters.ingredients.includes(ingredient.key);
              const count = filterRecipes(recipes, { ...filters, ingredients: [...new Set([...filters.ingredients, ingredient.key])] }, language).length;
              return <Chip key={ingredient.key} label={`${ingredient.name} · ${count}`} onClick={() => toggle(ingredient.key)}
                aria-pressed={selected} icon={selected ? <CheckIcon /> : undefined} color={selected ? 'primary' : 'default'} variant={selected ? 'filled' : 'outlined'} sx={{ height: 40 }} />;
            })}
          </AccordionDetails>
        </Accordion>;
      })}
    </Box>
    <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1.5, alignItems: 'center' }}>
      <Button onClick={() => onChange({ ...filters, ingredients: [] })} disabled={!filters.ingredients.length}>{text.clear}</Button>
      <Button variant="contained" onClick={close} sx={{ flex: 1 }}>{text.done} ({resultCount})</Button>
    </Box>
  </Drawer>;
}
