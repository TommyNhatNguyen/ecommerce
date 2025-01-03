import { useNotification } from "@/app/contexts/NotificationContext";
import { UpdateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { ModelStatus } from "@/app/shared/models/others/status.model";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { productService } from "@/app/shared/services/products/productService";
import { useState } from "react";
export interface DataType {
  id: string;
  key: string;
  name: string;
  description: string;
  category: ProductModel["category"];
  price: number;
  quantity: number;
  discounts: ProductModel["discount"];
  totalValue: number;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: string;
  images: string[];
}
export function useInventory() {
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [softDeleteProductLoading, setSoftDeleteProductLoading] =
    useState(false);

  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [
    softDeleteSelectedProductsLoading,
    setSoftDeleteSelectedProductsLoading,
  ] = useState(false);

  const { notificationApi } = useNotification();

  const handleSoftDeleteProduct = async (
    id: string,
    isBulkDelete: boolean = false,
  ) => {
    try {
      !isBulkDelete && setSoftDeleteProductLoading(true);
      const response = await productService.softDeleteProduct(id);
      if (response) {
        notificationApi.success({
          message: "Product deleted successfully",
          description: "Product deleted successfully",
        });
        return response;
      }
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
      return null;
    } catch (error) {
      console.error(error);
      notificationApi.error({
        message: "Failed to delete product",
        description: "Failed to delete product",
      });
      return null;
    } finally {
      !isBulkDelete && setSoftDeleteProductLoading(false);
    }
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

  const handleSoftDeleteSelectedProducts = async () => {
    if (selectedRows.length === 0) return;
    try {
      setSoftDeleteSelectedProductsLoading(true);
      await Promise.all(
        selectedRows.map(
          async (item) => await handleSoftDeleteProduct(item.id, true),
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
      setSoftDeleteSelectedProductsLoading(false);
    }
    setSelectedRows([]);
  };
  const handleClearAllSelectedRows = () => {
    setSelectedRows([]);
  };
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
  const inventoryOverallProps = {};
  const inventoryTableProps = {
    selectedRows,
    handleSelectAllRow,
    handleSelectRow,
    handleClearAllSelectedRows,
    handleSoftDeleteProduct,
    softDeleteProductLoading,
    handleUpdateStatus,
    updateStatusLoading,
    handleSoftDeleteSelectedProducts,
    softDeleteSelectedProductsLoading,
  };
  return {
    inventoryOverallProps,
    inventoryTableProps,
  };
}
