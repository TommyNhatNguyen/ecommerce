import { DISCOUNT_SCOPE } from "@/app/constants/enum";
import { useDebounce } from "@/app/shared/hooks/useDebounce";
import { brandService } from "@/app/shared/services/brands/brandService";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { optionService } from "@/app/shared/services/variant/optionService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useProductFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return categoriesService.getCategories({
        include_all: true,
      });
    },
  });
  const { data: options } = useQuery({
    queryKey: ["options"],
    queryFn: () => {
      return optionService.getAllOptions({ include_option_values: true });
    },
  });
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => {
      return brandService.getAllBrands();
    },
  });
  const {
    data: discounts,
    isLoading: isLoadingDiscounts,
    refetch: refetchDiscounts,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["discounts-infinite"],
    queryFn: (p) =>
      discountsService.getDiscounts({
        scope: DISCOUNT_SCOPE.PRODUCT,
        page: p.pageParam,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page === lastPage.meta.total_page) {
        return undefined;
      }
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
  });
  const handleSelectCategory = (value: string[]) => {
    setSelectedCategories(value);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const handleSelectOption = (value: string[]) => {
    setSelectedOptions(value);
  };
  const handleSelectBrand = (value: string[]) => {
    setSelectedBrands(value);
  };
  const handleSelectStatus = (value: string[]) => {
    setSelectedStatuses(value);
  };
  const handleSelectDiscount = (value: string[]) => {
    setSelectedDiscounts(value);
  };
  const handleLoadMoreDiscount = () => {
    hasNextPage && fetchNextPage();
  };
  const handleSearchDiscount = (value: string) => {
    console.log("🚀 ~ handleSearchDiscount ~ value:", value);
  };
  const handleSelectLimit = (value: number) => {
    setLimit(value);
  };
  const hasSelectedItems = useMemo(() => {
    return (
      selectedCategories.length > 0 ||
      selectedOptions.length > 0 ||
      selectedBrands.length > 0 ||
      selectedStatuses.length > 0 ||
      selectedDiscounts.length > 0 ||
      search.length > 0
    );
  }, [selectedCategories, selectedOptions, selectedBrands, selectedStatuses, selectedDiscounts, search]);
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedOptions([]);
    setSelectedBrands([]);
    setSelectedStatuses([]);
    setSelectedDiscounts([]);
    setSearch("");
  };
  return {
    categories: categories?.data,
    options: options?.data,
    brands: brands?.data,
    discounts: discounts?.pages?.flatMap((page) => page.data),
    selectedCategories,
    search,
    selectedOptions,
    selectedBrands,
    selectedStatuses,
    selectedDiscounts,
    hasNextDiscountPage: hasNextPage,
    handleSelectCategory,
    handleSearch,
    handleSelectOption,
    handleSelectBrand,
    handleSelectStatus,
    handleSelectDiscount,
    handleLoadMoreDiscount,
    handleSearchDiscount,
    hasSelectedItems,
    handleClearAll,
    limit,
    handleSelectLimit,
  };
};
