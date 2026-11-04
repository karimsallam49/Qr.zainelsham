import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Category } from "../../DTO/CategoriesDTO";
import {
  recommendedProductUrL,
  popularProductUrl,
} from "../../EndPoints/EndPoints";
import { useMenu } from "../../context/MenuContext";
import LazyRender from "../../Components/LazyRender/LazyRender";
import V2TopBar from "../../Components/V2/V2TopBar";
import V2SearchBar from "../../Components/V2/V2SearchBar";
import V2HeroSlider from "../../Components/V2/V2HeroSlider";
import V2CategoryGrid from "../../Components/V2/V2CategoryGrid";
import V2MenuList from "../../Components/V2/V2MenuList";
import V2ProductSection from "../../Components/V2/V2ProductSection";
import V2GoodTime from "../../Components/V2/V2GoodTime";
import ChatMealFab from "../../Components/ChatMeal/ChatMealFab";
import "./v2.css";

const HomePageV2 = () => {
  const { t } = useTranslation();
  const { categories } = useMenu();
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeSub, setActiveSub] = useState<Category | null>(null);
  // القايمة مش بتظهر إلا لما اليوزر يختار قسم أو يدوس "الكل"
  const [menuVisible, setMenuVisible] = useState(false);

  const subCats = activeCategory
    ? categories.filter(
        (c) => String(c.parent_id) === String(activeCategory.id)
      )
    : [];
  const menuRef = useRef<HTMLDivElement | null>(null);

  const allActive = menuVisible && activeCategory === null;

  const handlePillSelect = (cat: Category | null) => {
    if (cat === null) {
      // "الكل" — لو قايمة الكل مفتوحة أصلًا يقفلها ويرجع للسكاشن
      if (allActive) {
        setMenuVisible(false);
        return;
      }
      setActiveCategory(null);
      setMenuVisible(true);
    } else {
      setActiveCategory(cat);
      setActiveSub(null);
      setMenuVisible(true);
    }
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="v2-shell">
      <div className="v2-inner">
        <V2TopBar />
        <V2SearchBar />
        <V2HeroSlider />
        <V2CategoryGrid
          categories={categories}
          activeId={activeCategory?.id ?? null}
          allActive={allActive}
          onSelect={handlePillSelect}
        />

        {!menuVisible ? (
          <>
            <LazyRender minHeight={240}>
              <V2ProductSection
                title={t("Recommendation")}
                url={recommendedProductUrL}
                limit={6}
              />
            </LazyRender>

            <LazyRender minHeight={240}>
              <V2GoodTime
                title={t("v2.recommended")}
                url={popularProductUrl}
              />
            </LazyRender>
          </>
        ) : (
          <>
            <div ref={menuRef} />
            {subCats.length > 0 && (
              <div className="v2-sub-pills">
                <button
                  type="button"
                  className={`v2-sub-pill ${activeSub === null ? "active" : ""}`}
                  onClick={() => setActiveSub(null)}
                >
                  {t("v2.all")}
                </button>
                {subCats.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    className={`v2-sub-pill ${
                      activeSub?.id === sub.id ? "active" : ""
                    }`}
                    onClick={() => setActiveSub(sub)}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
            <V2MenuList category={activeSub ?? activeCategory} />
          </>
        )}
      </div>

      <ChatMealFab />
    </div>
  );
};

export default HomePageV2;
