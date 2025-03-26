import { useMemo, useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { productService } from "@/app/shared/services/products/productService";
import { ProductConditionDTO } from "@/app/shared/interfaces/products/product.dto";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useProductFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProductFilter";
import { useIntl } from "react-intl";
import { variantServices } from "@/app/shared/services/variant/variantService";
export function useProducts() {
  const intl = useIntl()
  const [loadingDeleteVariant, setLoadingDeleteVariant] = useState(false);
  const [loadingSoftDelete, setLoadingSoftDelete] = useState(false);
  const [errorSoftDelete, setErrorSoftDelete] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const { notificationApi } = useNotification();
  const handleSoftDeleteProduct = async (id: string) => {
    setLoadingSoftDelete(true);
    try {
      const response = await productService.softDeleteProduct(id);
      if (response) {
        notificationApi.success({
          message: "Delete product success",
          description: "Product deleted successfully",
        });
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Delete product failed",
        description: "Please try again",
      });
      setErrorSoftDelete(error.message);
    } finally {
      setLoadingSoftDelete(false);
    }
  };
  const handleBulkSoftDeleteProduct = async (ids: string[], callback?: () => void) => {
    setLoadingSoftDelete(true);
    try {
      const response = await productService.bulkSoftDeleteProduct(ids);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "delete_products_success" }),
          description: intl.formatMessage({ id: "delete_products_success" }),
        });
      }
    } catch (error: any) {
      notificationApi.error({
        message: intl.formatMessage({ id: "delete_products_error" }),
        description: intl.formatMessage({ id: "delete_products_error" }),
      });
    } finally {
      setLoadingSoftDelete(false);
      setSelectedProducts([]);
      callback?.();
    }
  };
  const handleDeleteVariant = async (ids: string[], callback?: () => void) => {
    setLoadingDeleteVariant(true);
    try {
      const response = await variantServices.bulkDelete({ ids });
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "delete_variants_success" }),
          description: intl.formatMessage({ id: "delete_variants_success" }),
        });
      }
    } catch (error: any) {
      notificationApi.error({
        message: intl.formatMessage({ id: "delete_variants_error" }),
        description: intl.formatMessage({ id: "delete_variants_error" }),
      });
    } finally {
      setLoadingDeleteVariant(false);
      callback?.();
    }
  };
  const handleSelectProducts = (
    selectedRowKeys: string[],
    selectedRows: any[],
  ) => {
    setSelectedProducts(selectedRowKeys);
  };

  return {
    handleSoftDeleteProduct,
    loadingSoftDelete,
    errorSoftDelete,
    selectedProducts,
    handleSelectProducts,
    handleBulkSoftDeleteProduct,
    handleDeleteVariant,
    loadingDeleteVariant,
  };
}
