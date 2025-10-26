import * as productService from '@/api/productService.ts'
import type { Product } from '@/types'
import { useMutation, useQueryCache, defineQueryOptions } from '@pinia/colada'

export const PRODUCT_QUERY_KEYS = {
  root: ['products'] as const,
  list: () => [...PRODUCT_QUERY_KEYS.root, 'list'] as const,
  byCategory: (categoryId: string) => [...PRODUCT_QUERY_KEYS.root, 'byCategory', categoryId] as const,
} as const


export const productsByCategoryQuery = (categoryId: string) => {
  return defineQueryOptions({
    key: PRODUCT_QUERY_KEYS.byCategory(categoryId),
    query: async (): Promise<Product[]> => {
      return await productService.getProductsByCategory(categoryId)
    },
  })
}

export const useCreateProductMutation = () => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: async (product: Product) => {
      await productService.addProduct(product)
      return product
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: PRODUCT_QUERY_KEYS.root })
    },
  })
}

export const useUpdateProductMutation = () => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: async (product: Product) => {
      await productService.updateProduct(product)
      return product
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: PRODUCT_QUERY_KEYS.root })
    },
  })
}


export const useDeleteProductMutation = () => {
  const queryCache = useQueryCache()
  return useMutation({
    mutation: async (id: string) => {
      await productService.deleteProduct(id)
      return id
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: PRODUCT_QUERY_KEYS.root })
    },
  })
}
