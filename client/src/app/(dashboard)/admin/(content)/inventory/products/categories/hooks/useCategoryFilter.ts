import { useState } from "react";

export const useCategoryFilter = () => {
  const [search, setSearch] = useState("");
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  return {
    search,
    handleSearch,
  };
};