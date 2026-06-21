/** Shared "pill" button styling used by category tags and ingredient chips. */
const PILL_BASE =
  'px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-100 dark:focus:ring-offset-slate-900 focus:ring-primary-500';

const PILL_SELECTED =
  'bg-primary-600 text-white shadow-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 scale-105';

const PILL_UNSELECTED =
  'bg-white text-sky-800 hover:bg-sky-100 border border-sky-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:border-slate-600';

export const pillButtonClasses = (isSelected: boolean): string =>
  `${PILL_BASE} ${isSelected ? PILL_SELECTED : PILL_UNSELECTED}`;
