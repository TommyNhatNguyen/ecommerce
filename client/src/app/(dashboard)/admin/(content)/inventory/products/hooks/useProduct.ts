import { useMemo, useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { productService } from "@/app/shared/services/products/productService";
import { ProductConditionDTO } from "@/app/shared/interfaces/products/product.dto";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useProductFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProductFilter";
import { useIntl } from "react-intl";
import { variantServices } from "@/app/shared/services/variant/variantService";
import { ModelStatus } from "@/app/shared/models/others/status.model";
export function useProducts() {
  const intl = useIntl();
  const [loadingDeleteVariant, setLoadingDeleteVariant] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const { notificationApi } = useNotification();
  const handleDeleteProduct = async (id: string) => {
    setLoadingDelete(true);
    try {
      const response = await productService.deleteProduct(id);
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
      setErrorDelete(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };
  const handleDeleteProducts = async (ids: string[], callback?: () => void) => {
    setLoadingDelete(true);
    try {
      const response = await productService.bulkDelete(ids);
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
      setLoadingDelete(false);
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
      setSelectedVariants([]);
      callback?.();
    }
  };
  const handleSelectProducts = (
    selectedRowKeys: string[],
    selectedRows: any[],
  ) => {
    setSelectedProducts(selectedRowKeys);
  };
  const handleSelectVariants = (
    selectedRowKeys: string[],
    selectedRows: any[],
  ) => {
    setSelectedVariants(selectedRowKeys);
  };
  const handleChangeStatus = async (id: string, status: ModelStatus) => {
    try {
      const response = await productService.update(id, {
        status,
      });
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "change_status_success" }),
          description: intl.formatMessage({ id: "change_status_success" }),
        });
      }
    } catch (error) {
      notificationApi.error({
        message: intl.formatMessage({ id: "change_status_error" }),
        description: intl.formatMessage({ id: "change_status_error" }),
      });
    }
  };
  const handleChangeVariantStatus = async (id: string, status: ModelStatus) => {
    try {
      const response = await variantServices.update(id, { status });
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "change_status_success" }),
          description: intl.formatMessage({ id: "change_status_success" }),
        });
      }
    } catch (error) {
      notificationApi.error({
        message: intl.formatMessage({ id: "change_status_error" }),
        description: intl.formatMessage({ id: "change_status_error" }),
      });
    }
  };

  return {
    handleDeleteProduct,
    loadingDelete,
    errorDelete,
    selectedProducts,
    handleSelectProducts,
    handleDeleteProducts,
    handleDeleteVariant,
    selectedVariants,
    handleSelectVariants,
    loadingDeleteVariant,
    handleChangeStatus,
    handleChangeVariantStatus,
  };
}
