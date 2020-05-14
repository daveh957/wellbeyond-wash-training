import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import english from './en';
import swahili from './sw';

const resources = {
  en: english,
  sw: swahili
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true,
    resources: resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
