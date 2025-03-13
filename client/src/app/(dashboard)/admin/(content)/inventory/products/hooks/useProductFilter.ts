import { useDebounce } from "@/app/shared/hooks/useDebounce";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useProductFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const handleSelectCategory = (value: string[]) => {
    setSelectedCategories(value);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return categoriesService.getCategories({
        include_all: true,
      });
    },
  });
  return {
    categories: categories?.data,
    selectedCategories,
    search,
    handleSelectCategory,
    handleSearch,
  };
};