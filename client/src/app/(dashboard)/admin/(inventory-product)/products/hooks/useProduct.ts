import { useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { productService } from "@/app/shared/services/products/productService";

export function useProducts() {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
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

  return {
    handleDeleteProduct,
    loadingDelete,
    errorDelete,
  };
}
