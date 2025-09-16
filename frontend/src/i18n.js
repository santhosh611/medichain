// medichain/frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import ta from './locales/ta.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  bn: { translation: bn },
  te: { translation: te },
  hi: { translation: hi }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;