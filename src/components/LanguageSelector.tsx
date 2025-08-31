import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { languages } from '../i18n/translations';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage } = useLanguage();

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {/* Horizontal language buttons */}
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <div className="flex items-center gap-2 mr-4">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-300 font-semibold text-sm">Language:</span>
        </div>
        
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
              language.code === currentLanguage
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-300/50'
                : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 text-gray-200 hover:from-purple-400/80 hover:to-blue-400/80 hover:text-white border border-gray-500/50 hover:border-purple-400/50'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="font-semibold">{language.name}</span>
            {language.code === currentLanguage && (
              <span className="text-green-300 font-bold animate-pulse">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};