import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../services/api";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
