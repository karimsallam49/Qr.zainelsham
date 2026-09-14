import { useEffect, useRef, useState } from "react";
import { GetDataComponent } from "../../Components/GetDataComponents/GetDataComponent";
import { ProductModal } from "../../Components/ProductsDetails/ProductModal";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import { GetProductByNameAPI } from "../../EndPoints/EndPoints";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";

const SearchResalutage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query") || "";
  const decodedQuery = decodeURIComponent(query);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [mergedData, setMergedData] = useState<any[]>([]);
  const [offset, setOffset] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const {currentLanguage}=useLanguage()
  const API = `${GetProductByNameAPI}?limit=10&offset=${offset}`;
  const APIBody = { name: decodedQuery, is_halal: 0 };

  useEffect(() => {
    setMergedData([]);
    setOffset(1);
    setHasMoreData(true);
    setIsLoading(false);
  }, [decodedQuery, currentLanguage]);

  const handleDataLoaded = (newData: any[]) => {
    setIsLoading(false);

    if (!newData || newData.length === 0) {
      setHasMoreData(false);
      return;
    }

    setMergedData((prev) => {
      const unique = [...prev, ...newData].filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i
      );
      return unique;
    });

    const div = scrollRef.current;
    if (div && div.scrollHeight <= div.clientHeight && hasMoreData) {
      setOffset((prev) => prev + 1);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    const div = scrollRef.current;
    if (!div) return;

    const handleScroll = () => {
      if (
        div.scrollTop + div.clientHeight >= div.scrollHeight - 100 &&
        hasMoreData &&
        !isLoading
      ) {
        setIsLoading(true);
        setOffset((prev) => prev + 1);
      }
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [hasMoreData, isLoading]);

  return (
    <div
      className="container py-3"
      ref={scrollRef}
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      <h3>
        {t("Search-results")} "{decodedQuery}"
      </h3>

      <GetDataComponent
      currentLanguage={currentLanguage}
        APIURL={API}
        ApiBody={APIBody}
        SelectedProduct={setSelectedProduct}
        setShowModal={setShowModal}
        mergedData={mergedData}
        onDataLoaded={handleDataLoaded}
      />

      {/* 🔄 مؤشر تحميل */}
      {isLoading && hasMoreData && (
        <div className="text-center py-2">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* ⛔ نهاية النتائج */}
      {!hasMoreData && mergedData.length > 0 && (
        <p className="text-center text-secondary py-3">
          {t("No more results found")}
        </p>
      )}

      
      {showModal && selectedProduct && (
        <ProductModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default SearchResalutage;
