import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '../services/api'
import type { Category, CategoryRequest } from '../types'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes (categories change less frequently)
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: (newCategory) => {
      // Update categories list
      queryClient.setQueryData<Category[]>(['categories'], (old) => {
        return old ? [...old, newCategory] : [newCategory]
      })
    },
    onError: (error) => {
      console.error('Failed to create category:', error)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove category from list
      queryClient.setQueryData<Category[]>(['categories'], (old) => {
        return old ? old.filter(category => category.id !== deletedId) : []
      })
      
      // Invalidate transactions as they might reference this category
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (error) => {
      console.error('Failed to delete category:', error)
    },
  })
}
