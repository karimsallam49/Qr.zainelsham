import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { appendBranchId, GetHeaderBackGrounImagesURl } from "../EndPoints/EndPoints";
import { useLanguage } from "./LanguageContext/LanguageContext";
import type { BranchDTO } from "../DTO/BrachDTO";

interface BranchImagesdata {
  branchImages: BranchDTO;
  Branchloading: boolean;
  Brancherror: string | null;
  refetch: () => void;
}

const BranchImagesContext = createContext<BranchImagesdata | undefined>(undefined);

export const BranchImagesProvider = ({ children }: { children: ReactNode }) => {
  const [branchImages, setBranchImages] = useState<BranchDTO>({} as BranchDTO);
  const [Branchloading, setLoading] = useState(true);
  const [Brancherror, setError] = useState<string | null>(null);
   const { currentLanguage }=useLanguage()

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await axios.get(appendBranchId(GetHeaderBackGrounImagesURl), {
        headers: {
          Authorization: "Bearer null",
          "Branch-id": "1",
          "x-localization":currentLanguage??"en"
        },
      });
      const data = res.data as BranchDTO;
setBranchImages(data);
      setError(null);
    } catch (err: any) {
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [currentLanguage]);

  return (
    <BranchImagesContext.Provider value={{ branchImages, Branchloading, Brancherror, refetch: fetchMenu }}>
      {children}
    </BranchImagesContext.Provider>
  );
};

export const usebranchData = (): BranchImagesdata => {
  const context = useContext(BranchImagesContext);
  if (!context) {
    throw new Error("useMenu must be used within a BranchImagesProvider");
  }
  return context;
};
