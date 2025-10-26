import * as categoryService from '@/api/categoryService.ts'
import type { Category } from '@/types'
import { useMutation, useQueryCache, defineQueryOptions } from '@pinia/colada'

export const CATEGORY_QUERY_KEYS = {
  root: ['categories'] as const,
  list: () => [...CATEGORY_QUERY_KEYS.root, 'list'] as const,
  detail: (categoryId: string) => [...CATEGORY_QUERY_KEYS.root, 'detail', categoryId] as const,
} as const

export const categoriesListQuery = () => {
  return defineQueryOptions({
    key: CATEGORY_QUERY_KEYS.list(),
    query: async (): Promise<Category[]> => {
      return await categoryService.getCategories()
    },
  })
}

export const categoryDetailQuery = (categoryId: string) => {
  return defineQueryOptions({
    key: CATEGORY_QUERY_KEYS.detail(categoryId),
    query: async (): Promise<Category> => {
      return await categoryService.getCategoryById(categoryId)
    },
  })
}

export const useCreateCategoryMutation = () => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: async (category: Category) => {
      await categoryService.CreateCategory(category)
      return category
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: CATEGORY_QUERY_KEYS.root })
    },
  })
}

export const useUpdateCategoryMutation = () => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: async (category: Category) => {

      await categoryService.updateCategory(category)
      return category
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: CATEGORY_QUERY_KEYS.root })
    },
  })
}


export const useDeleteCategoryMutation = () => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: async (id: string) => {
      await categoryService.deleteCategory(id)
      return id
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: CATEGORY_QUERY_KEYS.root })
    },
  })
}
