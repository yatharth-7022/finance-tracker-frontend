import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../ui";
import { useLogin } from "../../hooks/useAuth";
import type { LoginCredentials } from "../../types/index.js";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await loginMutation.mutateAsync(data);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username or Email"
          placeholder="Enter your username or email"
          error={errors.usernameOrEmail?.message}
          {...register("usernameOrEmail")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        {loginMutation.error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
            {loginMutation.error.message}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loginMutation.isPending}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Demo credentials: demo@example.com / password123
        </p>
      </div>
    </div>
  );
};
