import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().optional(),
  amount: z
    .number({ required_error: "Amount is required" })
    .positive("Amount must be positive")
    .min(0.01, "Amount must be at least $0.01"),
  type: z
    .string({ required_error: "Type is required" })
    .min(1, "Type cannot be blank"),
  categoryId: z
    .number({ required_error: "Category is required" })
    .int("Category must be a valid selection"),
});

export const categorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1, "Category name cannot be empty")
    .max(50, "Category name must be less than 50 characters"),
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "Category type is required",
  }),
});

export const budgetSchema = z.object({
  amount: z
    .number({ required_error: "Budget amount is required" })
    .positive("Budget amount must be positive")
    .min(0.01, "Budget amount must be at least ₹0.01"),
  month: z
    .number({ required_error: "Month is required" })
    .int("Month must be a valid number")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  year: z
    .number({ required_error: "Year is required" })
    .int("Year must be a valid number")
    .min(2020, "Year must be 2020 or later")
    .max(2030, "Year must be 2030 or earlier"),
  categoryId: z
    .number({ required_error: "Category is required" })
    .int("Category must be a valid selection"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
