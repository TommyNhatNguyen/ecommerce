import { useNotification } from "@/app/contexts/NotificationContext";
import { productService } from "@/app/shared/services/products/productService";
import { useState } from "react";

export function useInventory() {
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
  const inventoryOverallProps = {};
  const inventoryTableProps = {
    handleDeleteProduct,
    deleteProductLoading,
  };
  return {
    inventoryOverallProps,
    inventoryTableProps,
  };
}
