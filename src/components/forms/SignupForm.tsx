import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "../ui";
import { useSignup } from "../../hooks/useAuth";
import type { SignupCredentials } from "../../types/index.js";

const signupSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupCredentials>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupCredentials) => {
    try {
      await signupMutation.mutateAsync(data);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Create account
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Get started with your finance tracker
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Username"
          placeholder="John"
          error={errors.username?.message}
          {...register("username")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {signupMutation.error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
            {signupMutation.error.message}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={signupMutation.isPending}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
