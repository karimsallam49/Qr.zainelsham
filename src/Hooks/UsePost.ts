import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { appendBranchId } from "../EndPoints/EndPoints";

export const usePost = <TResponse, TBody = any>(
  currentLang: "ar" | "en",
  url: string
) => {
  const postData = async (body: TBody): Promise<TResponse> => {
    const res = await axios.post(appendBranchId(url), body, {
      headers: {
        Authorization: "Bearer null",
        "Branch-id": "1",
        "x-localization": currentLang ?? "en",
      },
    });
    return res.data;
  };

  return useMutation<TResponse, Error, TBody>({
    mutationFn: postData,
  });
};
