import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { ProductsHeader } from "../components/ProductsHeader";
import { ProductsFilterBar } from "../components/ProductsFilterBar";
import { ProductGrid } from "../components/ProductGrid";
import { ProductListTable } from "../components/ProductListTable";
import { AddProductDialog } from "../components/AddProductDialog";
import { UpdatePricesDialog } from "../components/UpdatePricesDialog";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { ProductHistoryModal } from "../components/ProductHistoryModal";
import { DeleteProductDialog } from "../components/DeleteProductDialog";
import { usePermissions } from "@/hooks/usePermissions";
import { getErrorMessage } from "@/lib/api/errors";
import {
  useProductCatalogs,
  useProductMutations,
  useProducts,
} from "../hooks/useProducts";
import {
  toCreateProductoPayload,
  toUpdateProductoPayload,
} from "../api/products.adapters";
import type {
  ProductItem,
  ProductCategory,
  ProductViewMode,
  NewProductFormData,
  BulkPriceUpdateFormData,
} from "../types/products.types";

export const ProductsPage: React.FC = () => {
  const { products: permissions } = usePermissions();

  // Server state: real API or MSW, depending on VITE_DATA_SOURCE.
  const { products, isLoading, error, refetch } = useProducts();
  const {
    catalogs,
    isLoading: catalogsLoading,
    error: catalogsError,
    refetch: refetchCatalogs,
  } = useProductCatalogs();
  const { create, update, remove } = useProductMutations();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ProductCategory>("Todos");
  const [viewMode, setViewMode] = useState<ProductViewMode>("grid");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductItem | null>(null);
  const [isUpdatePricesOpen, setIsUpdatePricesOpen] = useState(false);
  const [productForDetails, setProductForDetails] =
    useState<ProductItem | null>(null);
  const [productForHistory, setProductForHistory] =
    useState<ProductItem | null>(null);
  const { showToast } = useToast();
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(
    null,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    if (
      permissions.canCreateProduct &&
      (searchParams.get("action") === "new" ||
        searchParams.get("nuevo") === "true" ||
        location.state?.openAddProduct)
    ) {
      setProductToEdit(null);
      setIsAddOpen(true);
      if (searchParams.has("action") || searchParams.has("nuevo")) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("action");
        newParams.delete("nuevo");
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [searchParams, location.state, setSearchParams, permissions.canCreateProduct]);

  // Keep modal product synced with refreshed data
  const currentHistoryProduct = useMemo(() => {
    if (!productForHistory) return null;
    return (
      products.find((p) => p.id === productForHistory.id) || productForHistory
    );
  }, [products, productForHistory]);

  // Calculate counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<ProductCategory, number> = {
      Todos: products.length,
      Anillos: 0,
      Aros: 0,
      Cadenas: 0,
      Pulseras: 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [products]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (activeCategory !== "Todos" && item.category !== activeCategory) {
        return false;
      }

      // Search filter (name or code/SKU)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCode = item.code.toLowerCase().includes(query);
        return matchesName || matchesCode;
      }

      return true;
    });
  }, [products, activeCategory, searchQuery]);

  // Handlers for CRUD (React Query mutations)
  const handleSaveProduct = async (
    formData: NewProductFormData,
    editId?: string,
  ) => {
    if (!catalogs) {
      showToast(
        "No se pudieron cargar las categorías y materiales. Reintentá en unos segundos.",
        "error",
      );
      return;
    }

    try {
      if (editId) {
        const current = products.find((item) => item.id === editId);
        if (!current) throw new Error("El producto ya no existe en el catálogo.");

        await update.mutateAsync({
          id: editId,
          payload: toUpdateProductoPayload(formData, current, catalogs),
        });
        showToast(`Producto "${formData.name}" actualizado con éxito.`, "success");
      } else {
        await create.mutateAsync(toCreateProductoPayload(formData, catalogs));
        showToast(`Producto "${formData.name}" agregado al catálogo.`, "success");
      }
      setProductToEdit(null);
    } catch (err) {
      showToast(`No se pudo guardar el producto: ${getErrorMessage(err)}`, "error");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await remove.mutateAsync(productId);
      showToast("Producto eliminado del catálogo.", "success");
    } catch (err) {
      showToast(`No se pudo eliminar el producto: ${getErrorMessage(err)}`, "error");
    }
  };

  const handleApplyPriceUpdate = async (data: BulkPriceUpdateFormData) => {
    const factor = data.isIncrease
      ? 1 + data.percentage / 100
      : 1 - data.percentage / 100;

    const targets = products.filter(
      (item) => data.applyToAll || item.category === data.category,
    );

    if (targets.length === 0) {
      showToast("No hay productos que coincidan con el filtro.", "warning");
      return;
    }

    try {
      await Promise.all(
        targets.map((item) =>
          update.mutateAsync({
            id: item.id,
            payload: {
              precio: Math.round(item.price * factor * 100) / 100,
            },
          }),
        ),
      );

      showToast(
        `Precios actualizados (${data.isIncrease ? "+" : "-"}${data.percentage}%) en ${
          data.applyToAll ? "todos los productos" : data.category
        }.`,
        "success",
      );
    } catch (err) {
      showToast(`No se pudieron actualizar los precios: ${getErrorMessage(err)}`, "error");
    }
  };

  const handleAdjustStock = async (
    productId: string,
    delta: number,
    _reason: string,
  ) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      showToast("El producto ya no existe en el catálogo.", "error");
      return;
    }

    try {
      await update.mutateAsync({
        id: productId,
        payload: { stock: Math.max(0, product.stock + delta) },
      });
      showToast("Stock actualizado con éxito.", "success");
    } catch (err) {
      showToast(`No se pudo actualizar el stock: ${getErrorMessage(err)}`, "error");
    }
  };

  const handleUpdateProductPrice = async (
    productId: string,
    newPrice: number,
    _reason: string,
  ) => {
    try {
      await update.mutateAsync({ id: productId, payload: { precio: newPrice } });
      showToast(`Precio actualizado con éxito a $${newPrice.toFixed(2)}.`, "success");
    } catch (err) {
      showToast(`No se pudo actualizar el precio: ${getErrorMessage(err)}`, "error");
    }
  };

  const handleToggleRemoteVisibility = async (product: ProductItem) => {
    const nextState = product.isRemoteVisible !== true;

    try {
      await update.mutateAsync({
        id: product.id,
        payload: { visibilidad: nextState },
      });
      showToast(
        nextState
          ? `"${product.name}" ahora es visible en el catálogo remoto.`
          : `"${product.name}" se ocultó del catálogo remoto.`,
        "success",
      );
    } catch (err) {
      showToast(
        `No se pudo cambiar la visibilidad: ${getErrorMessage(err)}`,
        "error",
      );
    }
  };

  const loadError = error ?? catalogsError;

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 animate-fade-in">
      {/* Header: Title & Action Buttons */}
      <ProductsHeader
        onAddProductClick={() => {
          setProductToEdit(null);
          setIsAddOpen(true);
        }}
        onUpdatePricesClick={() => setIsUpdatePricesOpen(true)}
      />

      {/* Data source feedback */}
      {(isLoading || catalogsLoading) && (
        <div
          role="status"
          className="rounded-[var(--radius-card)] border border-[var(--neutral-border-subtle)] bg-[var(--neutral-card)] px-4 py-3 text-xs text-[var(--neutral-muted)]"
        >
          Cargando catálogo…
        </div>
      )}

      {loadError && (
        <div
          role="alert"
          className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-xs text-[var(--neutral-emphasis)] sm:flex-row sm:items-center sm:justify-between"
        >
          <span>
            No se pudo cargar el catálogo: {getErrorMessage(loadError)}
          </span>
          <button
            type="button"
            onClick={() => {
              void refetch();
              void refetchCatalogs();
            }}
            className="self-start rounded-[var(--radius-input)] border border-[var(--neutral-border)] px-3 py-1.5 font-medium hover:bg-[var(--neutral-subtle)] sm:self-auto"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Filter Bar: Search, Category Pills & Segmented Grid/List toggle */}
      <ProductsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryCounts={categoryCounts}
      />

      {/* Main Catalog View: Grid or List */}
      {viewMode === "grid" ? (
        <ProductGrid
          products={filteredProducts}
          onViewDetails={(item) => setProductForDetails(item)}
          onEdit={(item) => {
            setProductToEdit(item);
            setIsAddOpen(true);
          }}
          onDelete={(item) => setProductToDelete(item)}
          onViewHistory={(item) => setProductForHistory(item)}
          onToggleRemoteVisibility={handleToggleRemoteVisibility}
          onResetFilters={() => {
            setSearchQuery("");
            setActiveCategory("Todos");
          }}
        />
      ) : (
        <ProductListTable
          products={filteredProducts}
          onViewDetails={(item) => setProductForDetails(item)}
          onEdit={(item) => {
            setProductToEdit(item);
            setIsAddOpen(true);
          }}
          onDelete={(item) => setProductToDelete(item)}
          onViewHistory={(item) => setProductForHistory(item)}
          onToggleRemoteVisibility={handleToggleRemoteVisibility}
          onResetFilters={() => {
            setSearchQuery("");
            setActiveCategory("Todos");
          }}
        />
      )}

      {/* Modals */}
      <AddProductDialog
        open={isAddOpen}
        onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSaveProduct={handleSaveProduct}
        materials={catalogs?.materiales.map((material) => material.descripcion) ?? []}
      />

      <UpdatePricesDialog
        open={isUpdatePricesOpen}
        onOpenChange={setIsUpdatePricesOpen}
        onApplyPriceUpdate={handleApplyPriceUpdate}
        totalProductsCount={products.length}
      />

      <ProductDetailModal
        open={!!productForDetails}
        onOpenChange={(open) => !open && setProductForDetails(null)}
        product={productForDetails}
        onEditProduct={(item) => {
          setProductToEdit(item);
          setIsAddOpen(true);
        }}
      />

      <ProductHistoryModal
        open={!!currentHistoryProduct}
        onOpenChange={(open) => !open && setProductForHistory(null)}
        product={currentHistoryProduct}
        onAdjustStock={handleAdjustStock}
        onUpdatePrice={handleUpdateProductPrice}
      />

      <DeleteProductDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        product={productToDelete}
        onConfirmDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductsPage;
