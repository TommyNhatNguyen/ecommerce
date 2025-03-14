import { useDebounce } from "@/app/shared/hooks/useDebounce";
import { categoriesService } from "@/app/shared/services/categories/categoriesService";
import { optionService } from "@/app/shared/services/variant/optionService";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useProductFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const handleSelectCategory = (value: string[]) => {
    setSelectedCategories(value);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const handleSelectOption = (value: string[]) => {
    setSelectedOptions(value);
  };
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
  console.log("🚀 ~ useProductFilter ~ options:", options);
  return {
    categories: categories?.data,
    options: options?.data,
    selectedCategories,
    search,
    selectedOptions,
    handleSelectCategory,
    handleSearch,
    handleSelectOption,
  };
};
