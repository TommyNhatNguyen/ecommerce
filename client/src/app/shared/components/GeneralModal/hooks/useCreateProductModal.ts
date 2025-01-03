import { useNotification } from "@/app/contexts/NotificationContext";
import { CreateProductBodyDTO } from "@/app/shared/interfaces/products/product.dto";
import { productService } from "@/app/shared/services/products/productService";
import { useState } from "react";

export function useCreateProductModal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const { notificationApi } = useNotification();
  const hanldeCreateProduct = async (data: CreateProductBodyDTO) => {
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
  
  return { hanldeCreateProduct, loading, error };
}
