import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { appendBranchId } from "../EndPoints/EndPoints";
import { useOrderType } from "../context/OrderTypeContext/OrderTypeContext";

export const useFetch = <T>(currrentlang:"ar"|"en",url: string, options?: { enabled?: boolean }) => {
  const { orderType } = useOrderType();

  const fetchData = async (): Promise<T> => {
    const res = await axios.get(appendBranchId(url), {
      headers: {
        Authorization: "Bearer null",
        "Branch-id": "1",
        "x-localization":currrentlang??"en"
      },
    });
    return res.data;
  };

  return useQuery<T>({
    queryKey: ["fetch", url, currrentlang, orderType],
    queryFn: fetchData,
    enabled: options?.enabled ?? true,
  });
};
