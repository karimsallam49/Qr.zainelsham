import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { appendBranchId, ResturantConfiqURL } from "../EndPoints/EndPoints";
import { useLanguage } from "./LanguageContext/LanguageContext";
import type { ConfiqDTO } from "../DTO/CongigDTO";

interface ResturantConfiqType {
  ResturantConfig: ConfiqDTO;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const ResturantConfiq = createContext<ResturantConfiqType | undefined>(undefined);

export const ResturantConfigProvider = ({ children }: { children: ReactNode }) => {
  const [ResturantConfig, setResturantConfig] = useState<ConfiqDTO>({} as ConfiqDTO);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const { currentLanguage }=useLanguage()

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await axios.get(appendBranchId(ResturantConfiqURL), {
        headers: {
          Authorization: "Bearer null",
          "Branch-id": "1",
          "x-localization":currentLanguage??"en"
        },
      });
      const data = res.data as ConfiqDTO;
setResturantConfig(data);
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
    <ResturantConfiq.Provider value={{ ResturantConfig, loading, error, refetch: fetchMenu }}>
      {children}
    </ResturantConfiq.Provider>
  );
};

export const useresturntData = (): ResturantConfiqType => {
  const context = useContext(ResturantConfiq);
  if (!context) {
    throw new Error("useMenu must be used within a ResturantConfigProvider");
  }
  return context;
};
