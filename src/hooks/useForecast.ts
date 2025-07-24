import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { forecastApi } from "../services/api";
import { useCurrentUser } from "./useAuth";
import { useTransactions } from "./useTransactions";
import type { MonthlyForecast } from "../types";

export const useForecast = () => {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: transactions, isLoading: transactionsLoading } =
    useTransactions();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if user has sufficient transaction history (minimum 5 transactions)
  const hasMinimumTransactions = transactions && transactions.length >= 5;
  const shouldFetchForecast = !!user?.id && hasMinimumTransactions;

  const forecastQuery = useQuery({
    queryKey: ["forecast", "monthly", user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error("User ID is required for forecast");
      }
      return forecastApi.getMonthlyForecast(user.id);
    },
    enabled: shouldFetchForecast,
    staleTime: 10 * 60 * 1000, // 10 minutes - forecasts don't change frequently
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2; // Limit retries for forecast API
    },
  });

  // Auto-refresh functionality - refetch every 30 minutes when user is active
  useEffect(() => {
    if (!shouldFetchForecast || !forecastQuery.data) {
      return;
    }

    // Set up auto-refresh interval (30 minutes)
    intervalRef.current = setInterval(() => {
      // Only refetch if the document is visible (user is actively using the app)
      // and if we're not already loading data
      if (
        !document.hidden &&
        shouldFetchForecast &&
        !forecastQuery.isFetching
      ) {
        console.log("Auto-refreshing AI forecast data...");
        forecastQuery.refetch();
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [shouldFetchForecast, forecastQuery.data, forecastQuery.isFetching]);

  // Handle page visibility changes - pause auto-refresh when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && intervalRef.current) {
        // Clear interval when tab becomes hidden
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      } else if (
        !document.hidden &&
        shouldFetchForecast &&
        forecastQuery.data
      ) {
        // Restart interval when tab becomes visible again
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            if (
              !document.hidden &&
              shouldFetchForecast &&
              !forecastQuery.isFetching
            ) {
              console.log("Auto-refreshing AI forecast data...");
              forecastQuery.refetch();
            }
          }, 30 * 60 * 1000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [shouldFetchForecast, forecastQuery.data, forecastQuery.isFetching]);

  return {
    ...forecastQuery,
    hasMinimumTransactions,
    transactionCount: transactions?.length || 0,
    isCheckingRequirements: userLoading || transactionsLoading,
  };
};
