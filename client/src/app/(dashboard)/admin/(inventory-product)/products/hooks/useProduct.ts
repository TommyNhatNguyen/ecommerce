import { useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { CreateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { productService } from "@/app/shared/services/products/productService";

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string>("");
  const { notificationApi } = useNotification();
  const hanldeCreateProduct = async (data: CreateProductDTO) => {
    setLoading(true);
    try {
      const response = await productService.createProduct(data);
      if (response) {
        notificationApi.success({
          message: "Create product success",
          description: "Product created successfully",
        });
        return response;
      }
    } catch (error: any) {
      notificationApi.error({
        message: "Create product failed",
        description: "Please try again",
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
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
    loading,
    error,
    hanldeCreateProduct,
    handleDeleteProduct,
    loadingDelete,
    errorDelete,
  };
}
