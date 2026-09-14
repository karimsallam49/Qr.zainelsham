import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

const params = new URLSearchParams(window.location.search);
const urlLang = params.get("lang");
const initialLang: "ar" | "en" = urlLang === "en" ? "en" : "ar";

document.documentElement.lang = initialLang;
document.documentElement.dir = initialLang === "ar" ? "rtl" : "ltr";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: initialLang,
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      lookupQuerystring: "lang",
    },
  });

export default i18n;
