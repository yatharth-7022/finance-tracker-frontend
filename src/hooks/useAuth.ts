import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      queryClient.setQueryData(["user"], data.user);
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);
      queryClient.setQueryData(["user"], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getCurrentUser,
    enabled: !!localStorage.getItem("auth_token"),
    retry: false,
    staleTime: Infinity, // Keep cached user data fresh indefinitely
  });
};

export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
};
