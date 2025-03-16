import { useMemo, useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { productService } from "@/app/shared/services/products/productService";
import { ProductConditionDTO } from "@/app/shared/interfaces/products/product.dto";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useProductFilter } from "@/app/(dashboard)/admin/(content)/inventory/products/hooks/useProductFilter";

export function useProducts() {
  const [loadingSoftDelete, setLoadingSoftDelete] = useState(false);
  const [errorSoftDelete, setErrorSoftDelete] = useState<string>("");
  const { notificationApi } = useNotification();
  const handleSoftDeleteProduct = async (id: string) => {
    setLoadingSoftDelete(true);
    try {
      const response = await productService.softDeleteProduct(id);
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
      setErrorSoftDelete(error.message);
    } finally {
      setLoadingSoftDelete(false);
    }
  };
  

  return {
    handleSoftDeleteProduct,
    loadingSoftDelete,
    errorSoftDelete,
  };
}
