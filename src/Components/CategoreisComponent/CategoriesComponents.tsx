import { memo, useEffect, useMemo, useState } from "react";
import "./categories.css";
import { useTranslation } from "react-i18next";
import CartSkeleton from "../../scelton/CartScelton";
import { SectionName } from "../SectionName/SectionName";
import { CategoriesSideList } from "../CategoriesList/CategoresList";
import { useMenu } from "../../context/MenuContext";
import type { Category } from "../../DTO/CategoriesDTO";
import MobileCategories from "../CategoriesMenu/CategoriesMenu";

interface CategoriesComponentsProps {
  toggleGrid: (action: boolean) => void;
  onSelectCategory: (category: Category) => void;
}

export const CategoriesComponents = memo(({ onSelectCategory, toggleGrid }: CategoriesComponentsProps) => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const { categories, loading, error } = useMenu();

  const sortedCategories = useMemo(() => {
    if (!categories) return [];
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center w-100"
        style={{ height: "400px", overflow: "hidden" }}
      >
        <CartSkeleton />
      </div>
    );

  if (error) return <p>حدث خطأ أثناء تحميل القائمة.</p>;

  return (
    <div className="container py-1 position-relative">
      <SectionName title={t("Categories")} />

      {isMobile ? (
        <div style={{ direction: "ltr", width: "100%" }}>
          <MobileCategories
            OnToggleGrid={toggleGrid}
            categories={sortedCategories}
            onSelectCategory={onSelectCategory}
          />
        </div>
      ) : (
        <CategoriesSideList
          categories={sortedCategories}
          onSelectCategory={onSelectCategory}
        />
      )}
    </div>
  );
});
