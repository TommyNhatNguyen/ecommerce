import { useMemo, useState } from "react";

export const useCategoryFilter = () => {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const handleSelectLimit = (value: number) => {
    setLimit(value);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const hasSelectedItems = useMemo(() => {
    return search?.length > 0 || limit !== 10;
  }, [search, limit]);
  const handleClearAll = () => {
    setSearch("");
    setLimit(10);
  };
  return {
    search,
    handleSearch,
    limit,
    handleSelectLimit,
    hasSelectedItems,
    handleClearAll,
  };
};