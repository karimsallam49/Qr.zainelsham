import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import type { CategoryListResponse, Category } from "../DTO/CategoriesDTO";
import { appendBranchId, categoriesurl } from "../EndPoints/EndPoints";
import { useLanguage } from "./LanguageContext/LanguageContext";
import { useOrderType } from "./OrderTypeContext/OrderTypeContext";

interface MenuContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();
  const { orderType } = useOrderType();

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await axios.get(appendBranchId(categoriesurl), {
        headers: {
          Authorization: "Bearer null",
          "Branch-id": "1",
          "x-localization":currentLanguage??"en"
        },
      });
      const data = res.data as CategoryListResponse;
      const flattened = (data.categories || []).flatMap((cat) => [
        cat,
        ...(cat.childes ?? []),
      ]);
      const merged = flattened.filter(
        (cat, index, arr) => arr.findIndex((c) => c.id === cat.id) === index
      );
setCategories(merged);
      setError(null);
    } catch (err: any) {
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [currentLanguage, orderType]);

  return (
    <MenuContext.Provider value={{ categories, loading, error, refetch: fetchMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
