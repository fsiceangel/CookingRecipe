import { AppBar, Box, Container, FormControl, IconButton, MenuItem, Select, Toolbar, Tooltip, Typography } from '@mui/material';
import type { Language } from '../domain/schema';
import type { Messages } from '../shared/i18n';
import { BookIcon, MoonIcon, SunIcon } from '../shared/icons';
import type { Appearance } from './theme';

interface Props { language: Language; onLanguage: (language: Language) => void; appearance: Appearance; onToggle: () => void; text: Messages }
export function Header({ language, onLanguage, appearance, onToggle, text }: Props) {
  return <AppBar position="sticky" color="transparent" elevation={0} className="app-header"
    sx={{ bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
    <Container maxWidth="lg">
      <Toolbar disableGutters sx={{ gap: 1.5, minHeight: { xs: 72, sm: 80 } }}>
        <Box component="a" href="#/" aria-label={text.app} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary', textDecoration: 'none', flex: 1, minWidth: 0 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: 'primary.light', color: 'primary.main', display: 'grid', placeItems: 'center', flexShrink: 0 }}><BookIcon /></Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography component="span" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500, fontSize: 20, lineHeight: 1.35 }}>{text.app}</Typography>
            <Typography component="span" sx={{ display: { xs: 'block', sm: 'none' }, fontWeight: 500, fontSize: 16, lineHeight: 1.35 }}>{text.appShort}</Typography>
            <Typography component="span" sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 10, letterSpacing: '.16em', color: 'text.secondary', mt: .25 }}>COOKING RECIPE</Typography>
          </Box>
        </Box>
        <Tooltip title={appearance === 'light' ? text.dark : text.light}>
          <IconButton onClick={onToggle} aria-label={appearance === 'light' ? text.dark : text.light} color="inherit">{appearance === 'light' ? <MoonIcon /> : <SunIcon />}</IconButton>
        </Tooltip>
        <FormControl size="small" sx={{ minWidth: { xs: 76, sm: 104 } }}>
          <Select value={language} onChange={event => onLanguage(event.target.value)} inputProps={{ 'aria-label': text.language }} sx={{ '& .MuiSelect-select': { py: 1.3, fontSize: 14 } }}>
            <MenuItem value="cn">中文</MenuItem><MenuItem value="en">English</MenuItem><MenuItem value="fr">Français</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
    </Container>
  </AppBar>;
}
