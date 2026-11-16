import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CatalogosResponse,
  CreateProductoPayload,
  UpdateProductoPayload,
} from '@/lib/api/types/db.types'
import { productsApi } from '../api/products.api'
import { toProductItem } from '../api/products.adapters'

export const productKeys = {
  list: ['productos', 'list'] as const,
  catalogs: ['productos', 'catalogos'] as const,
}

/** Server-state for the product catalog (React Query). */
export function useProducts() {
  const query = useQuery({
    queryKey: productKeys.list,
    queryFn: () => productsApi.list(),
    select: (rows) => rows.map(toProductItem),
    staleTime: 30_000,
  })

  return {
    products: query.data ?? [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/** Categories/materials/taxes required to create or edit products. */
export function useProductCatalogs() {
  const query = useQuery<CatalogosResponse>({
    queryKey: productKeys.catalogs,
    queryFn: productsApi.catalogs,
    staleTime: 5 * 60_000,
  })

  return {
    catalogs: query.data,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useProductMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: productKeys.list })

  const create = useMutation({
    mutationFn: (payload: CreateProductoPayload) => productsApi.create(payload),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpdateProductoPayload }) =>
      productsApi.update(id, payload),
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: (id: string | number) => productsApi.remove(id),
    onSuccess: invalidate,
  })

  return { create, update, remove }
}
