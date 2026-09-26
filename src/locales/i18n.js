import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
  // debug: true,
  fallbackLng: "en",
  // React fa gia' l'escape del testo renderizzato: con l'escape di i18next
  // attivo le date interpolate uscivano come "06&#x2F;10&#x2F;2026".
  // Le chiamate che finiscono in dangerouslySetInnerHTML devono passare
  // { interpolation: { escapeValue: true } } esplicitamente.
  interpolation: { escapeValue: false },
});
export default i18n;
