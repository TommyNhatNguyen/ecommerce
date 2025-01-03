import { DataType } from "@/app/(dashboard)/admin/inventory/hooks/useInventory";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { useNotification } from "@/app/contexts/NotificationContext";
import { UpdateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { productService } from "@/app/shared/services/products/productService";
import { useState } from "react";

export function useInventoryDelete() {
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const [deleteSelectedProductsLoading, setDeleteSelectedProductsLoading] =
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
      await Promise.all(
        selectedRows.map(
          async (item) => await handleDeleteProduct(item.id, true),
        ),
      );
      setSelectedRows([]);
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
    } finally {
      setDeleteSelectedProductsLoading(false);
    }
    setSelectedRows([]);
  };
  const handleSelectAllRow = (
    selected: boolean,
    selectedRows: DataType[],
    changeRows: DataType[],
  ) => {
    setSelectedRows(selectedRows);
  };
  const handleSelectRow = (
    record: DataType,
    selected: boolean,
    selectedRows: DataType[],
  ) => {
    setSelectedRows(selectedRows);
  };

  return {
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
