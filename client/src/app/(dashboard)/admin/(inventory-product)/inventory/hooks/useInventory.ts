import { useNotification } from "@/app/contexts/NotificationContext";
import { productService } from "@/app/shared/services/products/productService";
import { useState } from "react";
export interface DataType {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string[];
  price: number;
  quantity: number;
  discount: number;
  totalValue: number;
  status: "ACTIVE" | "INACTIVE" | "DELETED";
  createdAt: string;
  images: string[];
}
export function useInventory() {
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);
  const [deleteProductLoading, setDeleteProductLoading] = useState(false);
  const { notificationApi } = useNotification();
  const handleDeleteProduct = async (id: string) => {
    try {
      setDeleteProductLoading(true);
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
      setDeleteProductLoading(false);
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
  const handleDeleteSelectedProducts = async () => {
    if (selectedRows.length === 0) return;
    await Promise.all(
      selectedRows.map(async (item) => await handleDeleteProduct(item.id)),
    );
    setSelectedRows([]);
  };
  const handleClearAllSelectedRows = () => {
    setSelectedRows([]);
  };
  const inventoryOverallProps = {};
  const inventoryTableProps = {
    selectedRows,
    handleDeleteProduct,
    deleteProductLoading,
    handleSelectAllRow,
    handleSelectRow,
    handleDeleteSelectedProducts,
    handleClearAllSelectedRows,
  };
  return {
    inventoryOverallProps,
    inventoryTableProps,
  };
}
