import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../services/api";
import type { Transaction, TransactionRequest } from "../types";

export const useTransactions = (params?: {
  type?: string;
  categoryId?: string;
}) => {
  return useQuery({
    queryKey: [
      "transactions",
      params?.type || "all",
      params?.categoryId || "all",
    ],
    queryFn: () => transactionApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.create,
    onSuccess: (newTransaction) => {
      // Invalidate all transaction queries to refresh them
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // Invalidate dashboard stats and summary to refresh
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
    onError: (error) => {
      console.error("Failed to create transaction:", error);
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.delete,
    onSuccess: (_, deletedId) => {
      // Invalidate all transaction queries to refresh them
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      // Invalidate dashboard stats and summary to refresh
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error);
    },
  });
};
