import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { GetCategoriesProductUrl, latestProductUrl } from "../../EndPoints/EndPoints";
import { GetDataComponent } from "../GetDataComponents/GetDataComponent";
import { ProductModal } from "../ProductsDetails/ProductModal";
import type { ProductDTO } from "../../DTO/ProductsDTO";
import type { Category } from "../../DTO/CategoriesDTO";
import { useLanguage } from "../../context/LanguageContext/LanguageContext";

interface Props {
  category?: Category | null;
  isGrid?: boolean;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

const CategorisHomePage: React.FC<Props> = memo(({ category, isGrid, scrollRef }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [currentOffset, setCurrentOffset] = useState(1);
  const [mergedData, setMergedData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { currentLanguage } = useLanguage()
  const isLoadingRef = useRef(isLoading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  useEffect(() => {
    setCurrentOffset(1);
    setMergedData([]);
    setHasMore(true);
  }, [category, currentLanguage]);

  const APIURL = useCallback(() => {
    return category
      ? `${GetCategoriesProductUrl}${category.id}?offset=${currentOffset}&limit=10&product_type=all`
      : `${latestProductUrl}?limit=10&offset=${currentOffset}&sort_by=default_type`;
  }, [category, currentOffset]);

  // ✅ Infinite Scroll logic
  useEffect(() => {
    const isDesktop = window.innerWidth >= 992;
    const target = isDesktop ? window : scrollRef?.current;
    if (!target) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking || isLoadingRef.current || !hasMoreRef.current) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        if (isLoadingRef.current || !hasMoreRef.current) return;

        let shouldLoad = false;
        if (isDesktop) {
          shouldLoad = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
        } else if (scrollRef?.current) {
          const el = scrollRef.current;
          shouldLoad = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
        }

        if (shouldLoad) {
          setCurrentOffset((prev) => prev + 1);
        }
      });
    };

    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  const handleDataLoaded = useCallback(
    (newData: any[]) => {
      if (newData.length === 0) {
        setHasMore(false);
        return;
      }
      setMergedData((prev) => [...prev, ...newData]);
    },
    [] 
  );

  return (
    <div className="menu-products p-4">
      <section className="w-100" id={category ? `cat-${category.id}` : "all-products"}>
        <GetDataComponent
          setIsLoading={setIsLoading}
          currentLanguage={currentLanguage}
          APIURL={APIURL()}
          SelectedProduct={setSelectedProduct}
          setShowModal={setShowModal}
          isGrid={isGrid}
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
      </section>
    </div>
  );
});

CategorisHomePage.displayName = "CategorisHomePage";

export default CategorisHomePage;
