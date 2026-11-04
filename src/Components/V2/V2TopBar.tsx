import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useV2Theme } from "../../Hooks/useV2Theme";
import { useresturntData } from "../../context/ResturantConfid";
import Zainlogo from "../../assets/zainupdatedlogo.jpeg";

const V2TopBar = () => {
  const { i18n } = useTranslation();
  const { mode, toggle } = useV2Theme();
  const { ResturantConfig } = useresturntData();
  const isAr = i18n.language === "ar";

  const switchTo = (lang: "ar" | "en") => {
    if (lang === i18n.language) return;
    // الـ LanguageProvider بيسمع "languageChanged" وبيحدّث الـ context لوحده
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = document.dir;
  };

  const logo = ResturantConfig?.restaurant_logo
    ? `${ResturantConfig.base_urls?.restaurant_image_url ?? ""}/${ResturantConfig.restaurant_logo}`
    : null;

  return (
    <div className="v2-topbar">
      <Link to="/" className="v2-brand">
        <img
          src={logo || Zainlogo}
          alt={ResturantConfig?.restaurant_name || ""}
          className="v2-brand-logo"
        />
      </Link>

      <div className="v2-topbar-actions">
        <button
          type="button"
          className="v2-icon-btn v2-lang-btn"
          onClick={() => switchTo(isAr ? "en" : "ar")}
        >
          {isAr ? "EN" : "ع"}
        </button>

        <button
          type="button"
          className="v2-icon-btn"
          onClick={toggle}
          aria-label="toggle theme"
        >
          {mode === "v2" ? (
            <Sun size={22} strokeWidth={1.8} />
          ) : (
            <Moon size={22} strokeWidth={1.8} />
          )}
        </button>
      </div>
    </div>
  );
};

export default V2TopBar;
