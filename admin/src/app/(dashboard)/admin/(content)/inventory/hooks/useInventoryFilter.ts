import { useQuery } from "@tanstack/react-query";
import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import { useMemo, useState } from "react";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { brandService } from "@/app/shared/services/brands/brandService";

export const useInventoryFilter = () => {
  const [isApplyFilters, setIsApplyFilters] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [selectedStockStatuses, setSelectedStockStatuses] = useState<string[]>(
    [],
  );
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const { data: warehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => {
      return warehouseService.getAll();
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return categoriesService.getCategories({
        include_all: true,
      });
    },
  });
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => {
      return brandService.getAllBrands();
    },
  });

  const handleSelectWarehouse = (value: string[]) => {
    setSelectedWarehouses(value);
  };
  const handleSelectCategory = (value: string[]) => {
    setSelectedCategories(value);
  };
  const handleSelectBrand = (value: string[]) => {
    setSelectedBrands(value);
  };
  const handleSelectStockStatus = (value: string[]) => {
    setSelectedStockStatuses(value);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const handleSelectLimit = (value: number) => {
    setLimit(value);
  };

  const hasSelectedItems = useMemo(() => {
    return (
      selectedWarehouses.length > 0 ||
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      selectedStockStatuses.length > 0 ||
      search.length > 0 ||
      isApplyFilters
    );
  }, [
    selectedWarehouses,
    selectedCategories,
    selectedBrands,
    selectedStockStatuses,
    search,
  ]);
  const handleClearAll = () => {
    setSelectedWarehouses([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedStockStatuses([]);
    setSearch("");
    setLimit(10);
    setIsApplyFilters((prev) => !prev);
  };
  const handleApplyFilters = () => {
    setIsApplyFilters((prev) => !prev);
  };
  return {
    warehouses: warehouses?.data,
    categories: categories?.data,
    brands: brands?.data,
    limit,
    search,
    selectedStockStatuses,
    selectedWarehouses,
    selectedCategories,
    selectedBrands,
    isApplyFilters,
    hasSelectedItems,
    handleClearAll,
    handleSelectLimit,
    handleSearch,
    handleSelectWarehouse,
    handleSelectCategory,
    handleSelectBrand,
    handleSelectStockStatus,
    handleApplyFilters,
  };
};
