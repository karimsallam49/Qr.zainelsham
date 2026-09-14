import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext<{ currentLanguage: "en"|"ar" }>({ currentLanguage: "en" });

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<"en"|"ar">(i18n.language === "ar" ? "ar" : "en");

  useEffect(() => {
    const handleLanguageChange = (lng: "en"|"ar") => {
      setCurrentLanguage(lng === "ar" ? "ar" : "en");
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
