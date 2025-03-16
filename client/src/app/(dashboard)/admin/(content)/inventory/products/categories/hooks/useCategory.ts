import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
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
    queryKey: ["categories"],
    queryFn: ({ pageParam = 1 }) => {
      return categoriesService.getCategories({
        include_image: true,
        page: pageParam,
        limit: limit,
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
  const categories = useMemo(() => {
    return categoriesData?.pages?.flatMap((page) => page.data) || [];
  }, [categoriesData]);
  const handleSelectLimit = (value: number) => {
    setLimit(value);
  };

  return {
    categories,
    fetchNextPage,
    refetch,
    hasNextPage,
    isLoading,
    isFetching,
    limit,
    handleSelectLimit,
  };
};
