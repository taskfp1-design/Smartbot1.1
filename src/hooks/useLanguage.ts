import { useState, useEffect } from 'react';
import { translations, Translation } from '../i18n/translations';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [t, setT] = useState<Translation>(translations['en']);

  useEffect(() => {
    setT(translations['en']);
  }, []);

  const setLanguage = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setT(translations[languageCode] || translations['en']);
  };

  return {
    currentLanguage,
    setLanguage,
    t,
  };
};