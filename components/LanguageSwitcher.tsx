
import React from 'react';

type Language = 'en' | 'cn' | 'fr';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, setLanguage }) => {
  const commonClasses = "px-3 py-1.5 text-sm font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800";
  const activeClasses = "bg-primary-600 text-white dark:bg-primary-500 shadow-sm";
  const inactiveClasses = "text-slate-500 hover:bg-slate-300/60 dark:text-slate-400 dark:hover:bg-slate-700";

  return (
    <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 rounded-lg p-1 space-x-1">
      <button 
        onClick={() => setLanguage('en')}
        className={`${commonClasses} ${currentLanguage === 'en' ? activeClasses : inactiveClasses}`}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('cn')}
        className={`${commonClasses} ${currentLanguage === 'cn' ? activeClasses : inactiveClasses}`}
      >
        中文
      </button>
      <button 
        onClick={() => setLanguage('fr')}
        className={`${commonClasses} ${currentLanguage === 'fr' ? activeClasses : inactiveClasses}`}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;