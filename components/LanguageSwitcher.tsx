
import React from 'react';

type Language = 'en' | 'cn' | 'fr';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, setLanguage }) => {
  const commonClasses = "px-3 py-1.5 text-sm font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background";
  const activeClasses = "bg-accent text-white shadow-sm";
  const inactiveClasses = "text-button-secondary-text hover:bg-button-secondary-hover/60";

  return (
    <div className="flex items-center bg-card-header rounded-lg p-1 space-x-1 backdrop-blur-sm border border-white/20 dark:border-border">
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