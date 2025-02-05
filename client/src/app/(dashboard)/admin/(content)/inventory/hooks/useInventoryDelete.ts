import { ModelStatus } from "@/app/shared/models/others/status.model";
import { useNotification } from "@/app/contexts/NotificationContext";
import { UpdateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { productService } from "@/app/shared/services/products/productService";
import { useState } from "react";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { variantServices } from "@/app/shared/services/variant/variantService";

export function useInventoryDelete() {
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<ProductModel[]>([]);
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const [deleteSelectedProductsLoading, setDeleteSelectedProductsLoading] =
    useState(false);
  const [deleteVariantLoading, setDeleteVariantLoading] = useState(false);
  const [updateVariantStatusLoading, setUpdateVariantStatusLoading] =
    useState(false);
  const { notificationApi } = useNotification();
  const handleUpdateStatus = async (id: string, status: ModelStatus) => {
    setUpdateStatusLoading(true);
    const payload: UpdateProductDTO = {
      status,
    };
    try {
      const response = await productService.updateProduct(id, payload);
      if (response) {
        notificationApi.success({
          message: "Product status updated successfully",
          description: "Product status updated successfully",
        });
        return true;
      }
      notificationApi.error({
        message: "Failed to update product status",
        description: "Failed to update product status",
      });
      return false;
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to update product status",
        description: "Failed to update product status",
      });
      return false;
    } finally {
      setUpdateStatusLoading(false);
    }
  };
  const handleDeleteProduct = async (
    id: string,
    isBulkDelete: boolean = false,
  ) => {
    try {
      !isBulkDelete && setDeleteProductLoading(true);
      const response = await productService.deleteProduct(id);
      if (response) {
        notificationApi.success({
          message: "Product deleted successfully",
          description: "Product deleted successfully",
        });
        return true;
      }
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
      return false;
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
      return false;
    } finally {
      !isBulkDelete && setDeleteProductLoading(false);
    }
  };
  const handleDeleteSelectedProducts = async () => {
    if (selectedRows.length === 0) return;
    try {
      setDeleteSelectedProductsLoading(true);
      const response =  await Promise.all(
        selectedRows.map(
          async (item) => await handleDeleteProduct(item.id, true),
        ),
      );
      if (response) {
        notificationApi.success({
          message: "Product deleted successfully",
          description: "Product deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
    } finally {
      setDeleteSelectedProductsLoading(false);
      setSelectedRows([]);
    }
  };
  const handleSelectAllRow = (
    selected: boolean,
    selectedRows: ProductModel[],
    changeRows: ProductModel[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const handleSelectRow = (
    record: ProductModel,
    selected: boolean,
    selectedRows: ProductModel[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const handleDeleteVariant = async (id: string) => {
    setDeleteVariantLoading(true);
    try {
      const response = await variantServices.delete(id);
      if (response) {
        notificationApi.success({
          message: "Variant deleted successfully",
          description: "Variant deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to delete variant",
        description: "Failed to delete variant",
      });
    }
    setDeleteVariantLoading(false);
  };
  const handleUpdateVariantStatus = async (id: string, status: ModelStatus) => {
    setUpdateVariantStatusLoading(true);
    try {
      const response = await variantServices.updateStatus(id, status);
      if (response) {
        notificationApi.success({
          message: "Variant status updated successfully",
          description: "Variant status updated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to update variant status",
        description: "Failed to update variant status",
      });
    } finally {
      setUpdateVariantStatusLoading(false);
    }
  };
  return {
    handleDeleteVariant,
    deleteVariantLoading,
    handleUpdateVariantStatus,
    updateVariantStatusLoading,
    handleUpdateStatus,
    handleDeleteProduct,
    handleDeleteSelectedProducts,
    handleSelectAllRow,
    handleSelectRow,
    selectedRows,
    updateStatusLoading,
    deleteProductLoading,
    deleteSelectedProductsLoading,
  };
}
