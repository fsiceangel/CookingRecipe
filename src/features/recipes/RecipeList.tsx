import { useMemo, useState } from 'react';
import { Badge, Box, Button, Chip, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import type { Catalog, Language } from '../../domain/schema';
import { tags } from '../../domain/constants';
import { emptyFilters, filterRecipes, localized, type Filters, type Recipe } from '../../domain/recipes';
import { changeFilters } from '../../app/navigation';
import { recipeCount, type Messages } from '../../shared/i18n';
import { CheckIcon, CloseIcon, FilterIcon, SearchIcon } from '../../shared/icons';
import { FilterDrawer } from './FilterDrawer';
import { RecipeCard } from './RecipeCard';

interface Props { catalog: Catalog; recipes: Recipe[]; filters: Filters; language: Language; text: Messages }
export function RecipeList({ catalog, recipes, filters, language, text }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const filtered = useMemo(() => filterRecipes(recipes, filters, language), [recipes, filters, language]);
  const hasFilters = Boolean(filters.query || filters.tag !== 'all' || filters.ingredients.length);
  return <>
    <Typography component="h1" id="page-title" sx={{ position: 'absolute', width: '1px', height: '1px', p: 0, m: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>{text.app}</Typography>
    <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, mt: { xs: 3, sm: 4 }, mb: 2.5 }}>
      <TextField fullWidth label={text.search} placeholder={text.searchHint} value={filters.query} onChange={event => changeFilters({ ...filters, query: event.target.value })}
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper', borderRadius: '18px' } }}
        slotProps={{ input: {
          startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>,
          endAdornment: filters.query ? <InputAdornment position="end"><IconButton size="small" aria-label={text.clearSearch} onClick={() => changeFilters({ ...filters, query: '' })}><CloseIcon fontSize="small" /></IconButton></InputAdornment> : undefined,
        } }} />
      <Button variant="outlined" onClick={() => setDrawerOpen(true)} aria-label={`${text.filters}${filters.ingredients.length ? ` (${filters.ingredients.length})` : ''}`} sx={{ borderRadius: '18px', flexShrink: 0, minWidth: { xs: 56, sm: 140 }, px: { xs: 1.5, sm: 2 }, borderColor: 'divider', bgcolor: 'background.paper', gap: 1 }}>
        <Badge badgeContent={filters.ingredients.length} color="primary"><FilterIcon /></Badge><Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{text.filters}</Box>
      </Button>
    </Box>
    <Box role="group" aria-label={text.all} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {(['all', ...tags] as const).map(tag => <Chip key={tag} label={`${text[tag]} ${tag === 'all' ? recipes.length : recipes.filter(recipe => recipe.tags.includes(tag)).length}`}
        icon={filters.tag === tag ? <CheckIcon /> : undefined} aria-pressed={filters.tag === tag} onClick={() => changeFilters({ ...filters, tag })}
        color={filters.tag === tag ? 'primary' : 'default'} variant={filters.tag === tag ? 'filled' : 'outlined'} sx={{ height: 40, bgcolor: filters.tag === tag ? undefined : 'background.paper' }} />)}
    </Box>
    {filters.ingredients.length > 0 && <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
      {filters.ingredients.map(key => <Chip key={key} label={localized(catalog.ingredients[key]?.names, language) || key}
        onDelete={() => changeFilters({ ...filters, ingredients: filters.ingredients.filter(item => item !== key) })} />)}
    </Box>}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography color="text.secondary" variant="body2" role="status">{recipeCount(filtered.length, language)}</Typography>
        {hasFilters && <Button size="small" onClick={() => changeFilters(emptyFilters)} sx={{ px: 1, minWidth: 0 }}>{text.clear}</Button>}
      </Box>
      <FormControl size="small" sx={{ minWidth: 138 }}>
        <InputLabel id="sort-label">{text.sort}</InputLabel>
        <Select labelId="sort-label" label={text.sort} value={filters.sort} onChange={event => changeFilters({ ...filters, sort: event.target.value })} sx={{ fontSize: 13, bgcolor: 'background.paper' }}>
          <MenuItem value="default">{text.default}</MenuItem><MenuItem value="difficulty">{text.difficultySort}</MenuItem><MenuItem value="title">{text.titleSort}</MenuItem>
        </Select>
      </FormControl>
    </Box>
    {filtered.length > 0 ? <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,minmax(0,1fr))', md: 'repeat(3,minmax(0,1fr))' }, gap: 2.5 }}>
      {filtered.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} filters={filters} text={text} />)}
    </Box> : <Box sx={{ textAlign: 'center', bgcolor: 'background.paper', borderRadius: '24px', py: 8, px: 3 }}>
      <SearchIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h2" sx={{ mb: 1 }}>{text.empty}</Typography><Typography color="text.secondary" sx={{ mb: 3 }}>{text.emptyHint}</Typography>
      <Button variant="contained" onClick={() => changeFilters(emptyFilters)}>{text.clear}</Button>
    </Box>}
    <FilterDrawer open={drawerOpen} close={() => setDrawerOpen(false)} catalog={catalog} recipes={recipes} filters={filters} onChange={changeFilters} language={language} text={text} resultCount={filtered.length} />
  </>;
}
