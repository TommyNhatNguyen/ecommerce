import { useMemo, useState } from "react";
import { useNotification } from "@/app/contexts/NotificationContext";
import { productService } from "@/app/shared/services/products/productService";
import { ProductConditionDTO } from "@/app/shared/interfaces/products/product.dto";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export function useProducts() {
  const [loadingSoftDelete, setLoadingSoftDelete] = useState(false);
  const [errorSoftDelete, setErrorSoftDelete] = useState<string>("");
  const [limit, setLimit] = useState<number>(10);
  const { notificationApi } = useNotification();

  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam = 1 }) =>
      productService.getProducts({
        // includeCategory: true,
        includeDiscount: true,
        includeImage: true,
        includeVariant: true,
        includeVariantInfo: true,
        includeVariantOption: true,
        includeVariantOptionType: true,
        includeVariantImage: true,
        limit: limit,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  
  });

  const products = useMemo(() => {
    return productsData?.pages?.flatMap((page) => page.data) || [];
  }, [productsData]);
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
  const handleSelectLimit = (value: number) => {
    setLimit(value);
  };

  return {
    handleSoftDeleteProduct,
    loadingSoftDelete,
    errorSoftDelete,
    products,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    limit,
    handleSelectLimit,
  };
}
