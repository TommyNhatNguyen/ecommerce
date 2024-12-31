import { useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { CreateProductDTO } from "@/app/shared/interfaces/products/product.dto";
import { productService } from "@/app/shared/services/products/productService";

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
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
  return { loading, error, hanldeCreateProduct };
}
