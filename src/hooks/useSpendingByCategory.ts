import { useQuery } from "@tanstack/react-query";
import { transactionApi } from "../services/api";

export const useSpendingByCategory = () => {
  return useQuery({
    queryKey: ["transactions", "spending-by-category"],
    queryFn: transactionApi.getSpendingByCategory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
