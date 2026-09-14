import { memo, useEffect, useRef } from "react";
import type { ProductListResponse } from "../../DTO/ProductsDTO";
import { ProductsCArd } from "../ProductsCards/ProductsCArd";
import { ProducList } from "../ProductsList/ProductsList";
import type { Props } from "../../DTO/GenralDTO";
import ProductScelton from "../../scelton/ProductScelton";
import { useFetch } from "../../Hooks/useFetch";
import { usePost } from "../../Hooks/UsePost";
import { useLocation } from "react-router";

interface GetDataProps extends Props {
  isGrid?: boolean;
  ApiBody?: any;
  onDataLoaded?: (newData: any[]) => void;
  mergedData?: any[];
  currentLanguage: "ar" | "en";
  setIsLoading?: (loading: boolean) => void;
}

export const GetDataComponent = memo(
  ({
    APIURL,
    SelectedProduct,
    setShowModal,
    currentLanguage,
    isGrid = true,
    ApiBody,
    setIsLoading,
    onDataLoaded,
    mergedData = [],
  }: GetDataProps) => {

    const {
      data: fetchData,
      isLoading: fetchLoading,
      error: fetchError,
      refetch: refetchData,
    } = useFetch<ProductListResponse>(currentLanguage, APIURL, {
      enabled: !ApiBody, 
    });

    
    const {
      mutate,
      data: postData,
      isPending: postLoading,
      error: postError,
    } = usePost<ProductListResponse, object>(currentLanguage, APIURL);

    const location = useLocation();
    const isHome = location.pathname === "/";
    const onDataLoadedRef = useRef(onDataLoaded);

    useEffect(() => {
      onDataLoadedRef.current = onDataLoaded;
    });

    
    useEffect(() => {
      if (ApiBody) {
        // POST
        mutate(ApiBody);
      } else {
        // GET
        refetchData();
      }
    }, [ApiBody, APIURL, currentLanguage]); 

   
    const data = ApiBody ? postData : fetchData;
    const isLoading = ApiBody ? postLoading : fetchLoading;
    const error = ApiBody ? postError : fetchError;

   
    useEffect(() => {
      if (data?.products && onDataLoadedRef.current) {
        onDataLoadedRef.current(data.products);
      }
    }, [data]);

    useEffect(() => {
      const isLoading = ApiBody ? postLoading : fetchLoading;
      setIsLoading?.(isLoading); 
    }, [fetchLoading, postLoading, ApiBody]);
   
    if (isLoading && mergedData.length === 0)
      return (
        <div
          className="d-flex justify-content-center align-items-center w-100"
          style={{ height: "400px", overflow: "hidden" }}
        >
          <ProductScelton />
        </div>
      );

    if (error) return <p>حدث خطأ أثناء تحميل القائمة.</p>;

    const allProducts = mergedData.length > 0 ? mergedData : data?.products ?? [];
    return (
      <>
        {isGrid ? (
          <div className="row g-4">
            {allProducts.map((product, index) => (
              <div key={index}   className={`col-6 col-sm-6 col-md-4 col-lg-${isHome ? "3" : "2"}`}
>
                <ProductsCArd
                  records={product}
                  setProductInfo={SelectedProduct}
                  setopen={setShowModal}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {allProducts.map((product, index) => (
              <ProducList
                key={index}
                records={product}
                setProductInfo={SelectedProduct}
                setopen={setShowModal}
              />
            ))}
          </div>
        )}

        
        {isLoading && (
          <div className="d-flex justify-content-center align-items-center mt-4 mb-5">
            <div
              className="spinner-border"
              role="status"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                color: "#722914",
              }}
            />
          </div>
        )}
      </>
    );
  }
);
