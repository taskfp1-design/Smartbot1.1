import { useState, useEffect } from 'react';
import { translations, Translation } from '../i18n/translations';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  useEffect(() => {
    setT(translations['en']);
  }, []);


  return {
    currentLanguage: 'en',
    t,
  };
};