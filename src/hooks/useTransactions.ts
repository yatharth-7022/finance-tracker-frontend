import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionApi } from "../services/api";
import type { Transaction, TransactionRequest } from "../types";

export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: transactionApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionApi.create,
    onSuccess: (newTransaction) => {
      // Update transactions list
      queryClient.setQueryData<Transaction[]>(["transactions"], (old) => {
        return old ? [newTransaction, ...old] : [newTransaction];
      });

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
      // Remove transaction from list
      queryClient.setQueryData<Transaction[]>(["transactions"], (old) => {
        return old
          ? old.filter((transaction) => transaction.id !== deletedId)
          : [];
      });

      // Invalidate dashboard stats and summary to refresh
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error);
    },
  });
};
