import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useCategory = () => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [limit, setLimit] = useState(10);
  const {
    data: categoriesData,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["categories-infinite"],
    queryFn: ({ pageParam = 1 }) =>
      categoriesService.getCategories({
        include_image: true,
        page: pageParam,
        limit: limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
  });
  const categories = useMemo(() => {
    return categoriesData?.pages?.flatMap((page) => page.data) || [];
  }, [categoriesData]);

  return {
    categories,
    fetchNextPage,
    refetch,
    hasNextPage,
    isLoading,
    isFetching,
  };
};
