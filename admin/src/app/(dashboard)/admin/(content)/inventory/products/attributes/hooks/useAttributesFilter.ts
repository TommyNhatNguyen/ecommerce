import { useMemo, useState } from "react";

export const useAttributesFilter = () => {
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const handleSelectLimit = (value: number) => {
    setLimit(value);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const handleClearAll = () => {
    setSearch("");
    setLimit(10);
  };
  const hasSelectedItems = useMemo(() => {
    return search.length > 0 || limit !== 10;
  }, [search, limit]);
  return {
    limit,
    search,
    handleSelectLimit,
    handleSearch,
    handleClearAll,
    hasSelectedItems,
  };
};
