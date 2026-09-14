import { useParams, Link } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { GetCategoriesProductUrl } from "../../EndPoints/EndPoints";
import { useMenu } from "../../context/MenuContext";
import ProductSkeleton from "../../scelton/ProductScelton";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import { GetDataComponent } from "../../Components/GetDataComponents/GetDataComponent";
import "./CategoryPage.css";
import imageplaceholder from "../../assets/BackGround.png";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";

export const CategoryPage = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState<number | null>(null);
  const [offset, setOffset] = useState(1);
  const [mergedData, setMergedData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const {currentLanguage}=useLanguage()
  const params = useParams();
  const categoryId = params.categoryId;
  const { categories, loading, error } = useMenu();

  const data = useMemo(
    () => categories.filter((cat) => cat.id.toString() === categoryId),
    [categories, categoryId]
  );

  const subcategories = useMemo(
    () => categories.filter((cat) => cat.parent_id.toString() === categoryId),
    [categories, categoryId]
  );

  const APIURL = useMemo(() => {
    const idToUse = currentSubcategory || categoryId;
    return idToUse
      ? `${GetCategoriesProductUrl}${idToUse}?offset=${offset}&limit=10&product_type=all`
      : "";
  }, [currentSubcategory, categoryId, offset]);

  const handleDataLoaded = (newData: any[]) => {
    if (newData.length === 0) {
      setHasMore(false);
      setIsLoadingMore(false);
      return;
    }

    setMergedData((prev) => {
      const unique = [...prev, ...newData].filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      );
      return unique;
    });

    setIsLoadingMore(false);
  };

  useEffect(() => {
    setMergedData([]);
    setOffset(1);
    setHasMore(true);
  }, [currentSubcategory, categoryId, currentLanguage]);

  useEffect(() => {
    const div = scrollRef.current;
    if (!div) return;

    const handleScroll = () => {
      if (
        div.scrollTop + div.clientHeight >= div.scrollHeight - 150 &&
        hasMore &&
        !isLoadingMore
      ) {
        setIsLoadingMore(true);
        setOffset((prev) => prev + 1);
      }
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore]);

  if (loading)
    return (
      <div style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
        <ProductSkeleton />
      </div>
    );

  if (error) return <p>حدث خطأ أثناء تحميل القائمة.</p>;

  return (
    <div
      className="container py-1 category-page-container"
      ref={scrollRef}
      style={{ maxHeight: "95vh", overflowY: "auto" }}
    >
      <div
        className="mb-3 d-flex flex-column justify-content-end align-items-start position-relative category-banner"
        style={{
          backgroundImage: `url(${data[0]?.banner_image_full_path ?? imageplaceholder})`,
        }}
      >
        <Link
          to="/"
          className="position-absolute top-0 start-0 m-3 text-white bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "35px", height: "35px" }}
        >
          <ChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
        </Link>

        <h5 className="text-center text-white w-100 mb-3">{data[0]?.name}</h5>
      </div>

      {subcategories.length > 0 && (
        <div className="subcategory-tabs-wrapper mb-4">
          <button
            onClick={() => setCurrentSubcategory(null)}
            className={`subcategory-tab-btn ${
              currentSubcategory === null ? "active" : ""
            }`}
          >
            {t("All")}
          </button>

          {subcategories.map((sub,index) => (
            <button
              key={index}
              onClick={() => setCurrentSubcategory(sub.id)}
              className={`subcategory-tab-btn ${
                currentSubcategory === sub.id ? "active" : ""
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      
      <GetDataComponent
      currentLanguage={currentLanguage}
        APIURL={APIURL}
        SelectedProduct={setSelectedProduct}
        setShowModal={setShowModal}
        onDataLoaded={handleDataLoaded}
        mergedData={mergedData}
      />

      
      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}

      {isLoadingMore && hasMore && (
        <p className="text-center text-muted py-2">{t("Loading more...")}</p>
      )}

      {!hasMore && (
        <p className="text-center text-secondary py-3">
          {t("No more products to show")}
        </p>
      )}
    </div>
  );
};
