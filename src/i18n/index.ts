import i18n from "i18next";
import Backend from 'i18next-http-backend';
import {initReactI18next} from "react-i18next";
import {isPlatform} from '@ionic/react';

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true,
    defaultNS: 'translation',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
      format: function(value, format, lng) {
        if (value) {
          if (format === 'uppercase') return value.toUpperCase();
          if (format === 'date' && value.toDate) {
            return Intl.DateTimeFormat(lng, {month: "long", day: "numeric", year: "numeric"}).format(value.toDate());
          }
          if (format === 'dateAndTime' && value.toDate) {
            return Intl.DateTimeFormat(lng, {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true
            }).format(value.toDate());
          }
          if (format === 'date' && value instanceof Date) {
            return Intl.DateTimeFormat(lng, {month: "long", day: "numeric", year: "numeric"}).format(value);
          }
          if (format === 'dateAndTime' && value instanceof Date) {
            return Intl.DateTimeFormat(lng, {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true
            }).format(value);
          }
        }
        return value;
      }
    }
  }).then((t) => {
    console.log('initialized i18n ok')
    i18n.loadNamespaces('translation')
});


export default i18n;
