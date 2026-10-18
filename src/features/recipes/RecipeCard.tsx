import { Box, Card, CardActionArea, Chip, Typography } from '@mui/material';
import type { Recipe, Filters } from '../../domain/recipes';
import type { Messages } from '../../shared/i18n';
import { ArrowIcon, BakeryIcon, CakeIcon, DishIcon } from '../../shared/icons';
import { rememberList, routeHref } from '../../app/navigation';

interface Props { recipe: Recipe; filters: Filters; text: Messages }
export function RecipeCard({ recipe, filters, text }: Props) {
  const Icon = recipe.tags.includes('bakery') ? BakeryIcon : recipe.tags.includes('dessert') ? CakeIcon : DishIcon;
  const mainIngredients = recipe.ingredients.filter(ingredient => ingredient.category !== 'seasoning');
  const preview = (mainIngredients.length ? mainIngredients : recipe.ingredients).slice(0, 3);
  return <Card component="article" variant="outlined" sx={{ height: '100%', borderColor: 'divider', transition: 'border-color .18s, box-shadow .18s', '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 16px #12385410' } }}>
    <CardActionArea component="a" id={`recipe-${recipe.id}`} href={routeHref(recipe.id, filters)} onClick={() => rememberList(recipe.id)}
      sx={{ p: { xs: 2.5, sm: 3 }, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'start' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.3 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: recipe.tags.includes('dish') ? 'primary.light' : 'secondary.light', color: recipe.tags.includes('dish') ? 'primary.main' : 'secondary.main', display: 'grid', placeItems: 'center' }}><Icon /></Box>
          <Typography variant="body2" color="text.secondary">{text[recipe.tags[0]]}</Typography>
        </Box>
        <Chip size="small" label={`${text.difficulty} ${recipe.difficulty}/5`} variant="outlined" sx={{ fontSize: 11, borderColor: 'divider' }} />
      </Box>
      <Typography variant="h3" component="h2" sx={{ mb: 1, overflowWrap: 'anywhere' }}>{recipe.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>{preview.map(ingredient => ingredient.name).join(' · ')}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'divider', pt: 1.7 }}>
        <Typography variant="body2" color="text.secondary">{recipe.ingredients.length} {text.ingredients} <Box component="span" sx={{ mx: .7 }}>·</Box> {recipe.steps.length} {text.steps}</Typography>
        <ArrowIcon fontSize="small" color="primary" />
      </Box>
    </CardActionArea>
  </Card>;
}
