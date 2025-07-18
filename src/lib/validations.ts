import { z } from 'zod'

export const transactionSchema = z.object({
  description: z.string().optional(),
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be positive')
    .min(0.01, 'Amount must be at least $0.01'),
  type: z
    .string({ required_error: 'Type is required' })
    .min(1, 'Type cannot be blank'),
  categoryId: z
    .number({ required_error: 'Category is required' })
    .int('Category must be a valid selection'),
})

export const categorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .min(1, 'Category name cannot be empty')
    .max(50, 'Category name must be less than 50 characters'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Category type is required',
  }),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
