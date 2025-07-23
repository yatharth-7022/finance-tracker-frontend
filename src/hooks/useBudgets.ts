import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { budgetApi } from '../services/api'
import type { Budget, BudgetRequest } from '../types'

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: budgetApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: budgetApi.create,
    onSuccess: (newBudget) => {
      // Update budgets list
      queryClient.setQueryData<Budget[]>(['budgets'], (old) => {
        return old ? [...old, newBudget] : [newBudget]
      })

      // Invalidate dashboard data to refresh budget-related stats
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      console.error('Failed to create budget:', error)
    },
  })
}

export const useUpdateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, budget }: { id: number; budget: BudgetRequest }) =>
      budgetApi.update(id, budget),
    onSuccess: (updatedBudget) => {
      // Update budgets list
      queryClient.setQueryData<Budget[]>(['budgets'], (old) => {
        return old
          ? old.map((budget) =>
              budget.id === updatedBudget.id ? updatedBudget : budget
            )
          : [updatedBudget]
      })

      // Invalidate dashboard data to refresh budget-related stats
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      console.error('Failed to update budget:', error)
    },
  })
}

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: budgetApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove budget from list
      queryClient.setQueryData<Budget[]>(['budgets'], (old) => {
        return old ? old.filter((budget) => budget.id !== deletedId) : []
      })

      // Invalidate dashboard data to refresh budget-related stats
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      console.error('Failed to delete budget:', error)
    },
  })
}
