import { useRef, useState, useMemo } from "react";
import "./menu.css";
import { CategoriesComponents } from "../../Components/CategoreisComponent/CategoriesComponents";
import { HeaderComponent } from "../../Components/HeaderComponent/HeaderComponent";
import { BackGroundImage } from "../../Components/BackGroundImage/BackGrounImage";
import CategorisHomePage from "../../Components/CategoriesHomePage/CategorisHomePage";
import type { Category } from "../../DTO/CategoriesDTO";
import RecommindationSection from "../../Components/RecommendationSection/RecommindationSection";
import LanguageSwitcher from "../../Components/LanguageSwitchButton/LanguageSwitcher";
import BannerComponent from "../../Components/BannerComponent/BannerComponent";
import SearchComponent from "../../Components/SearchComponent/SearchComponent";
import CategoriesBoxs from "../../Components/CategoriesBoxs/CategoriesBoxs";

const MenuPage = () => {
  const [CurrentCategory, setCurrentCategory] = useState<Category>();
  const [ToggleView, settoggleView] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const MemoizedBanner = useMemo(() => <BannerComponent BannerType="banner" />, []);
  const MemoizedAdsBanner = useMemo(() => <BannerComponent BannerType="ads" />, []);
  const MemoizedRecommindation = useMemo(() => <RecommindationSection />, []);
  const MemoizedCategoryBoxes = useMemo(() => <CategoriesBoxs />, []);


  const MemoizedCategoriesHome = useMemo(() => (
    <CategorisHomePage
      isGrid={ToggleView}
      category={CurrentCategory}
      scrollRef={scrollRef}
    />
  ), [ToggleView, CurrentCategory]);

  return (
    <div className="menu-page-container container position-relative p-0">
      <div
        ref={scrollRef}
        className="menu-page-content w-100 d-flex flex-column align-items-center position-relative"
        style={{ overflowY: "auto", maxHeight: "100vh", padding: "0" }}
      >
        <div className="menu-banner w-100">
          <BackGroundImage />
        </div>

        <div style={{ left: "1%", top: "1%" }} className="position-absolute">
          <div className="w-100 d-lg-none d-md-block d-sm-block">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="menu-content w-100">
          <div className="menu-header">
            <HeaderComponent />
          </div>

          <div className="w-100 menu-home-body d-flex flex-column align-items-center">
            <div style={{ marginTop: "2rem" }} className="w-100 d-lg-none d-md-block d-sm-block">
              <SearchComponent />
            </div>

            {MemoizedBanner}
            {MemoizedCategoryBoxes}
            {MemoizedRecommindation}
            {MemoizedAdsBanner}

            <div className="menu-categories-mobile w-100">
              <CategoriesComponents
                toggleGrid={settoggleView}
                onSelectCategory={(category) => setCurrentCategory(category)}
              />
            </div>

            <div className="w-100 d-flex justify-content-center">
              <div className="menu-categories-descktop">
                <CategoriesComponents
                  toggleGrid={settoggleView}
                  onSelectCategory={(category) => setCurrentCategory(category)}
                />
              </div>

              {MemoizedCategoriesHome}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
