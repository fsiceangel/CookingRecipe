
import React from 'react';

type Language = 'en' | 'cn';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLanguage, setLanguage }) => {
  const commonClasses = "px-3 py-1.5 text-sm font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900";
  const activeClasses = "bg-primary-600 text-white";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <div className="flex items-center bg-gray-800 rounded-lg p-1 space-x-1">
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
    </div>
  );
};

export default LanguageSwitcher;
