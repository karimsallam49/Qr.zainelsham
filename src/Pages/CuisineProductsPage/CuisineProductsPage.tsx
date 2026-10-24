import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { cuisineProductsURl } from "../../EndPoints/EndPoints";
import ProductSkeleton from "../../scelton/ProductScelton";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import { GetDataComponent } from "../../Components/GetDataComponents/GetDataComponent";
import "./CuisineProductsPage.css";
import imageplaceholder from "../../assets/BackGround.png";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";

export const CuisineProductsPage = () => {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(1);
  const [mergedData, setMergedData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useLanguage();
  const params = useParams();
  const location = useLocation();
  const cuisineId = params.cuisineId;
  const { name, image } = (location.state as { name?: string; image?: string }) ?? {};

  const APIURL = useMemo(() => {
    return cuisineId
      ? `${cuisineProductsURl}/${cuisineId}?offset=${offset}&limit=10&product_type=all`
      : "";
  }, [cuisineId, offset]);

  const handleDataLoaded = (newData: any[]) => {
    loadingRef.current = false;

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

    if (newData.length < 10) {
      setHasMore(false);
    }
    setIsLoadingMore(false);
  };

  useEffect(() => {
    setMergedData([]);
    setOffset(1);
    setHasMore(true);
    loadingRef.current = false;
  }, [cuisineId, currentLanguage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || mergedData.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setIsLoadingMore(true);
          setOffset((prev) => prev + 1);
        }
      },
      { rootMargin: "150px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, mergedData.length]);

  if (!cuisineId)
    return (
      <div style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
        <ProductSkeleton />
      </div>
    );

  return (
    <div
      className="container py-1 category-page-container"
      style={{ maxHeight: "95vh", overflowY: "auto" }}
    >
      <div
        className="mb-3 d-flex flex-column justify-content-end align-items-start position-relative category-banner"
        style={{
          backgroundImage: `url(${image ?? imageplaceholder})`,
        }}
      >
        <Link
          to="/cuisine"
          className="position-absolute top-0 start-0 m-3 text-white bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: "35px", height: "35px" }}
        >
          <ChevronRight size={20} style={{ transform: "rotate(180deg)" }} />
        </Link>

        <h5 className="text-center text-white w-100 mb-3">{name ?? ""}</h5>
      </div>

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

      {hasMore && <div ref={sentinelRef} style={{ height: "1px" }} />}

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
