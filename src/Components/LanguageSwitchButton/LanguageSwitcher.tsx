import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr"; 
  };

  return (
    <button className="btn text-light fw-bold rounded p-2" onClick={toggleLanguage} style={{backgroundColor:"#722914"}}>
      {i18n.language === "ar" ? "EN" : "Ar"}
    </button>
  );
};

export default LanguageSwitcher;
