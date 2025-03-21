import { warehouseService } from "@/app/shared/services/warehouse/warehouseService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export const useInvoicesFilter = () => {
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([]);
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<string[]>([]);
  const { data: warehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => {
      return warehouseService.getAll();
    },
  });

  const handleSelectWarehouse = (value: string[]) => {
    setSelectedWarehouses(value);
  };

  const handleSelectInvoiceType = (value: string[]) => {
    setSelectedInvoiceType(value);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleSelectLimit = (value: number) => {
    setLimit(value);
  };

  const hasSelectedItems = useMemo(() => {
    return selectedWarehouses.length > 0 || search.length > 0;
  }, [selectedWarehouses, search]);

  const handleClearAll = () => {
    setSelectedWarehouses([]);
    setSearch("");
  };

  return {
    limit,
    search,
    selectedWarehouses,
    warehouses: warehouses?.data,
    handleSelectWarehouse,
    handleSearch,
    handleSelectLimit,
    hasSelectedItems,
    handleClearAll,
    selectedInvoiceType,
    handleSelectInvoiceType,
  };
};
