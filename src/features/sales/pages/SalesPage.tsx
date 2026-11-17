import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { useSales } from '@/context/SalesContext'
import { SalesHeader } from '../components/SalesHeader'
import { SalesKpiRow } from '../components/SalesKpiRow'
import { SalesFilters } from '../components/SalesFilters'
import { SalesTable } from '../components/SalesTable'
import { NewSaleDialog } from '../components/NewSaleDialog'
import { SaleDetailDialog } from '../components/SaleDetailDialog'
import { ProductExchangeDialog } from '../components/ProductExchangeDialog'
import { getErrorMessage } from '@/lib/api/errors'
import type {
  SaleRecord,
  NewSaleFormData,
  RegistrarCambioFormData,
} from '../types/sales.types'

export const SalesPage: React.FC = () => {
  const { sales, kpis, createSale, confirmExchange, isLoading, error, refetch } = useSales()
  const [searchQuery, setSearchQuery] = useState('')
  const [activePaymentFilter, setActivePaymentFilter] = useState('all')

  // Modals state
  const { showToast } = useToast()
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false)
  const [selectedSaleForDetail, setSelectedSaleForDetail] = useState<SaleRecord | null>(null)
  const [saleForExchange, setSaleForExchange] = useState<SaleRecord | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  useEffect(() => {
    if (searchParams.get('action') === 'new' || searchParams.get('nuevo') === 'true' || location.state?.openNewSale) {
      setIsNewSaleOpen(true)
      if (searchParams.has('action') || searchParams.has('nuevo')) {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('action')
        newParams.delete('nuevo')
        setSearchParams(newParams, { replace: true })
      }
    }
  }, [searchParams, location.state, setSearchParams])

  // Filter sales based on search and payment method
  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      // Payment method filter
      if (activePaymentFilter !== 'all' && item.pago !== activePaymentFilter) {
        return false
      }

      // Search query (cliente, fecha, producto, ticketNumber)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesClient = item.cliente.toLowerCase().includes(query)
        const matchesDate = item.fecha.toLowerCase().includes(query)
        const matchesFullDate = item.fechaCompleta.toLowerCase().includes(query)
        const matchesProduct = item.productosTexto.toLowerCase().includes(query)
        const matchesTicket = item.ticketNumber.toLowerCase().includes(query)

        return matchesClient || matchesDate || matchesFullDate || matchesProduct || matchesTicket
      }

      return true
    })
  }, [sales, activePaymentFilter, searchQuery])

  // Register a new sale (POST /api/ventas; stock is discounted by the backend)
  const handleCreateSale = async (formData: NewSaleFormData) => {
    try {
      const newSale = await createSale(formData)
      showToast(
        `Venta ${newSale.ticketNumber} registrada con éxito por $${newSale.total.toLocaleString('es-AR')}.`,
        'success'
      )
      setIsNewSaleOpen(false)
    } catch (err) {
      showToast(`No se pudo registrar la venta: ${getErrorMessage(err)}`, 'error')
    }
  }

  // Product exchanges are not supported by the current backend
  const handleConfirmExchange = async (data: RegistrarCambioFormData) => {
    try {
      await confirmExchange(data)
      showToast(`Cambio de producto registrado para el ticket #${data.saleId}.`, 'success')
      setSaleForExchange(null)
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header: Title, "Registrar venta" & Notification Bell */}
      <SalesHeader
        onNewSaleClick={() => setIsNewSaleOpen(true)}
      />

      {/* Data source feedback */}
      {isLoading && (
        <div
          role="status"
          className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] px-4 py-3 text-xs text-[var(--neutral-muted)]"
        >
          Cargando ventas…
        </div>
      )}

      {error != null && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-xs text-[var(--neutral-emphasis)] sm:flex-row sm:items-center sm:justify-between"
        >
          <span>No se pudieron cargar las ventas: {getErrorMessage(error)}</span>
          <button
            type="button"
            onClick={refetch}
            className="self-start rounded-[var(--radius-input)] border border-[var(--neutral-border)] px-3 py-1.5 font-medium hover:bg-[var(--neutral-subtle)] sm:self-auto"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <SalesKpiRow
        kpis={kpis}
      />

      {/* Filters: Search & Payment Method */}
      <SalesFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activePaymentFilter={activePaymentFilter}
        onPaymentFilterChange={setActivePaymentFilter}
      />

      {/* Sales History Table */}
      <SalesTable
        sales={filteredSales}
        onViewSale={(sale) => setSelectedSaleForDetail(sale)}
        onExchangeSale={(sale) => setSaleForExchange(sale)}
        onResetFilters={() => {
          setSearchQuery('')
          setActivePaymentFilter('all')
        }}
      />

      {/* Interactive Modals */}
      <NewSaleDialog
        open={isNewSaleOpen}
        onOpenChange={setIsNewSaleOpen}
        onSubmit={handleCreateSale}
      />

      <SaleDetailDialog
        open={!!selectedSaleForDetail}
        onOpenChange={(open) => !open && setSelectedSaleForDetail(null)}
        sale={selectedSaleForDetail}
        onExchangeSale={(sale) => setSaleForExchange(sale)}
      />

      <ProductExchangeDialog
        open={!!saleForExchange}
        onOpenChange={(open) => !open && setSaleForExchange(null)}
        sale={saleForExchange}
        onSubmitExchange={handleConfirmExchange}
      />
    </div>
  )
}

export default SalesPage
