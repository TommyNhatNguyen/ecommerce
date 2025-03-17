import { variantServices } from "@/app/shared/services/variant/variantService";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

type Props = {};

const InventoryTable = (props: Props) => {
  const {
    data: variantData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["variant_with_inventory"],
    queryFn: ({ pageParam = 1 }) => {
      return variantServices.getList({
        page: pageParam,
        limit: 10,
        include_product_sellable: true,
        include_inventory: true,
        include_warehouse: true,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.meta.total_page > lastPage.meta.current_page
        ? lastPage.meta.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
  });
  console.log(variantData);
  return <div>InventoryTable</div>;
};

export default InventoryTable;
