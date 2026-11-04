// AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { CategoryPage } from "../Pages/CategoryPage/CategoryPage";
import HomePageV2 from "../Pages/HomePageV2/HomePageV2";
import SearchResalutage from "../Pages/SearchResultPage/SearchResalutage";
import AllCategoriesPage from "../Pages/AllCategoriesPage/AllCategoriesPage";
import AllCuisinePage from "../Pages/CuisinePage/CuisinePage";
import { CuisineProductsPage } from "../Pages/CuisineProductsPage/CuisineProductsPage";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePageV2 />} />
      <Route path="/categories" element={<AllCategoriesPage />} />
      <Route path="/category/:categoryId/:name/" element={<CategoryPage />} />
      <Route path="/search" element={< SearchResalutage/>} />
      <Route path="/cuisine" element={< AllCuisinePage/>} />
      <Route path="/CuisineProductsPage/:cuisineId" element={<CuisineProductsPage />} />
    </Routes>
  );
}
