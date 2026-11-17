import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { ApiError } from '@/lib/api/errors'
import type { CreateVentaPayload } from '@/lib/api/types/db.types'
import { productKeys } from '@/features/products/hooks/useProducts'
import { salesApi } from '@/features/sales/api/sales.api'
import {
  buildCreatedSaleRecord,
  computeSalesKpis,
  resolveVendedorId,
  toCreateVentaPayload,
  toSaleRecord,
} from '@/features/sales/api/sales.adapters'
import type {
  SaleRecord,
  SalesKpiData,
  NewSaleFormData,
  RegistrarCambioFormData,
} from '@/features/sales/types/sales.types'

const salesKeys = {
  list: ['ventas', 'list'] as const,
}

const EMPTY_KPIS: SalesKpiData = {
  ventasEsteMes: 0,
  ventasMesPasado: 0,
  ventasVariacionPct: 0,
  ingresosTotales: 0,
  ingresosMesPasado: 0,
  ingresosVariacionPct: 0,
}

interface SalesContextValue {
  sales: SaleRecord[]
  kpis: SalesKpiData
  isLoading: boolean
  error: unknown
  refetch: () => void
  createSale: (formData: NewSaleFormData) => Promise<SaleRecord>
  /**
   * Kept for API compatibility with the exchange dialog. The current backend
   * has no exchange table/endpoint, so this always rejects with a 501 error.
   */
  confirmExchange: (data: RegistrarCambioFormData) => Promise<void>
}

const SalesContext = createContext<SalesContextValue | undefined>(undefined)

async function fetchSalesBundle() {
  const [ventas, usuarios, clientes] = await Promise.all([
    salesApi.list(),
    salesApi.usuarios(),
    salesApi.clientes(),
  ])

  const lookups = { usuarios, clientes }

  return {
    sales: ventas.map((row) => toSaleRecord(row, lookups)),
    kpis: computeSalesKpis(ventas),
  }
}

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  const { profile } = useAuth()

  const vendedorId = useMemo(() => resolveVendedorId(profile?.id), [profile?.id])
  const vendedorNombre = useMemo(() => {
    const full = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()
    return full || profile?.email || 'Usuario'
  }, [profile?.first_name, profile?.last_name, profile?.email])

  const query = useQuery({
    queryKey: salesKeys.list,
    queryFn: fetchSalesBundle,
    staleTime: 30_000,
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateVentaPayload) => salesApi.create(payload),
  })

  const createSale = useCallback(
    async (formData: NewSaleFormData): Promise<SaleRecord> => {
      const payload = toCreateVentaPayload(formData, vendedorId)
      const response = await createMutation.mutateAsync(payload)

      // Both queries change: a new sale and the discounted stock.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: salesKeys.list }),
        queryClient.invalidateQueries({ queryKey: productKeys.list }),
      ])

      return buildCreatedSaleRecord(formData, response.data, vendedorNombre)
    },
    [createMutation.mutateAsync, queryClient, vendedorId, vendedorNombre]
  )

  const confirmExchange = useCallback(
    async (_data: RegistrarCambioFormData): Promise<void> => {
      throw new ApiError(
        'El backend todavía no soporta registrar cambios de producto (no existe tabla ni endpoint de cambios).',
        { status: 501 }
      )
    },
    []
  )

  const value = useMemo<SalesContextValue>(
    () => ({
      sales: query.data?.sales ?? [],
      kpis: query.data?.kpis ?? EMPTY_KPIS,
      isLoading: query.isPending,
      error: query.error,
      refetch: () => {
        void query.refetch()
      },
      createSale,
      confirmExchange,
    }),
    [query.data, query.isPending, query.error, query.refetch, createSale, confirmExchange]
  )

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>
}

export const useSales = (): SalesContextValue => {
  const context = useContext(SalesContext)
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider')
  }
  return context
}
