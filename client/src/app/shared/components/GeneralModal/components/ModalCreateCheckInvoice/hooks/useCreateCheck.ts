import { useDebounce } from "@/app/shared/hooks/useDebounce";
import { CheckInventoryInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { useState } from "react";
import { useForm } from "react-hook-form";

export type InventoryCheckSummaryData = {
  total_actual_quantity: number;
  total_difference_quantity: number;
  total_difference_amount: number;
};

export const useCreateCheck = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all_num");
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>(
    [],
  );
  const [checkInventoryData, setCheckInventoryData] = useState<{
    [key: string]: number;
  }>({});
  const [search, setSearch] = useState<string>("");
  const [inventoryCheckSummaryData, setInventoryCheckSummaryData] =
    useState<InventoryCheckSummaryData>({
      total_actual_quantity: 0,
      total_difference_quantity: 0,
      total_difference_amount: 0,
    },
  );
  const allNum = selectedInventoryIds.length;
  const uncheckNum = 0;
  const checkNum = 0;
  const handleChangeInventory = (value: string[]) => {
    setSelectedInventoryIds(value);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const handleChangeInventoryCheckSummaryData = (data: InventoryCheckSummaryData) => {
    setInventoryCheckSummaryData(data);
  };
  const debouncedSearch = useDebounce(search, 500);

  const inventoryTabsProps = {
    selectedTab,
    setSelectedTab,
    allNum,
    uncheckNum,
    checkNum,
  };

  const inventoryTableProps = {
    checkInventoryData,
    setCheckInventoryData,
    handleChangeInventoryCheckSummaryData,
  };

  const inventoryCheckSummaryProps = {
    inventoryCheckSummaryData,
  };
  return {
    inventoryTabsProps,
    inventoryTableProps,
    inventoryCheckSummaryProps,
    selectedTab,
    selectedInventoryIds,
    handleChangeInventory,
    handleSearch,
    debouncedSearch,
    search,
  };
};
