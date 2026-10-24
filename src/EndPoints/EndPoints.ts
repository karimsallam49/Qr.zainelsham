const baseUrl = import.meta.env.VITE_BaseUrl;

export const getBranchId = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("branchid") || "";
};

export const getServiceType = () => {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get("service_type") ||
    sessionStorage.getItem("order_type") ||
    "hall"
  );
};

export const appendBranchId = (url: string): string => {
  const branchId = getBranchId();
  const serviceType = getServiceType();
  let result = url;

  if (branchId) {
    const separator = result.includes("?") ? "&" : "?";
    result = `${result}${separator}branch_id=${branchId}`;
  }

  if (serviceType) {
    const separator = result.includes("?") ? "&" : "?";
    result = `${result}${separator}service_type=${serviceType}`;
  }

  return result;
};
export const  latestProductUrl = `${baseUrl}api/v1/products/latest`;
export const  popularProductUrl = `${baseUrl}api/v1/products/popular`;
export const  setMenuUrl = `${baseUrl}api/v1/products/set-menu`;
export const  recommendedProductUrL = `${baseUrl}api/v1/products/recommended`;
export const  ALLproductUrl = `${baseUrl}api/v1/products/latest?`;
export const ImageUrl= `${baseUrl}storage/app/public/product`;
export const CategoryImg= `${baseUrl}storage/app/public/category`;
export const ResturantIMG= `${baseUrl}storage/app/public/restaurant`;
export const categoriesurl = `${baseUrl}api/v1/categories?limit=240&offset=1&name=`;
export const GetCategoriesProductUrl = `${baseUrl}api/v1/categories/products/`;
export const GetBannersURL = `${baseUrl}api/v1/banners`;
export const BannerImg= `${baseUrl}storage/app/public/banner`;
export const HeaderUrl= `${baseUrl}api/v1/config`;
export const BannnerUrl= `${baseUrl}api/v1/banners`;
export const SearchSuggestionAPI= `${baseUrl}api/v1/products/search-suggestion?`;
export const GetProductByNameAPI= `${baseUrl}api/v1/products/search?`;
export const ResturantConfiqURL= `${baseUrl}api/v1/config`;
export const cuisineProductsURl=`${baseUrl}api/v1/cuisine/products`
export const cuisineListUrl=`${baseUrl}api/v1/cuisine/list`
export const GetHeaderBackGrounImagesURl=`${baseUrl}api/v1/branch/show`
