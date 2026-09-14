import { Link } from "react-router-dom";
import SearchComponent from "../SearchComponent/SearchComponent";
import "./AppdesckTop.css";
import { ResturantConfiqURL, ResturantIMG } from "../../EndPoints/EndPoints";
import { useFetch } from "../../Hooks/useFetch";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";
import LanguageSwitcher from "../LanguageSwitchButton/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useMenu } from "../../context/MenuContext";

const AppdesckTopHeader = () => {
  const { currentLanguage } = useLanguage();
  const { data } = useFetch<any>(currentLanguage, ResturantConfiqURL);
  const logoImage = `${ResturantIMG}/${data?.restaurant_logo}`;
  const { t } = useTranslation();
  const { categories } = useMenu();
  const MainCategories = categories.filter((el) => el.parent_id === 0);

  return (
    <div
      className="w-100 desctop-header container justify-content-between align-items-center px-3"
      style={{ height: "100px", padding: "0 6rem" }}
    >
      {/* اليسار */}
      <div className="d-flex align-items-center" style={{ flex: 1 }}>
        <div className="descktop-lodo me-3">
          <Link to="/">
            <img
              src={logoImage}
              alt="شعار المطعم"
              style={{ width: "120px", objectFit: "contain" }}
            />
          </Link>
        </div>

        <Link
          to="/"
          className="mx-3 text-decoration-none Grarcolor"
          style={{ color: "gray" }}
        >
          {t("home")}
        </Link>

        <div className="dropdown-custom mx-3 position-relative">
          <span className="text-decoration-none Grarcolor dropdown-toggle-custom" style={{ color: "gray", cursor: "pointer" }}>
            {t("categories")}
          </span>

          <div className="dropdown-menu-custom shadow-sm">
            {MainCategories.map((cat,index) => (
              <Link
                key={index}
                to={`/category/${cat.id}/${cat.name}`}
                className="dropdown-item-custom text-decoration-none text-dark"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* السيرش */}
      <div
        className="d-flex justify-content-center Grarcolor align-items-center"
        style={{ flex: 2 }}
      >
        <SearchComponent />
      </div>

      <LanguageSwitcher />
    </div>
  );
};

export default AppdesckTopHeader;
