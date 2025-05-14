// import i18n from 'i18next';
// import {initReactI18next} from 'react-i18next';
// import {NativeModules,} from 'react-native';

// import en from './en.json';
// import fr from './fr.json';
// import ar from './ar.json';
// import de from './de.json';

// const languageDetector = {
//   type: 'languageDetector',
//   async: true,
//   detect: callback => {
//     const locale = NativeModules.I18nManager.localeIdentifier;
//     callback(locale);
//   },
//   init: () => {},
//   cacheUserLanguage: () => {},
// };

// i18n
//   .use(languageDetector)
//   .use(initReactI18next)
//   .init({
//     fallbackLng: 'en',
//     resources: {
//       en: {translation: en},
//       fr: {translation: fr},
//       ar: {translation: ar},
//       de: {translation: de},
//     },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {NativeModules, I18nManager} from 'react-native';

import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';
import de from './de.json';

// Normalize locale to ensure it matches one of your supported languages
const normalizeLocale = locale => {
  if (!locale) return 'en';
  return locale.split(/[_-]/)[0];
};

// Language detector using I18nManager from NativeModules
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    if (NativeModules.I18nManager) {
      const locale = NativeModules.I18nManager.localeIdentifier;
      callback(locale);
    } else {
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {translation: en},
      fr: {translation: fr},
      ar: {translation: ar},
      de: {translation: de},
    },
    interpolation: {
      escapeValue: false, // Disable escaping values (for React)
    },
  });

// // // Handle RTL for Arabic
// if (i18n.language === 'ar') {
//   I18nManager.forceRTL(false); // Force RTL layout if the language is Arabic
// } else {
//   I18nManager.forceRTL(false); // Default to LTR layout
// }

export default i18n;
