import { CheckInventoryInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const useCreateCheck = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all_num");
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>(
    [],
  );
  const [checkInventoryData, setCheckInventoryData] = useState<{
    [key: string]: number;
  }>({});

  const allNum = selectedInventoryIds.length;
  const uncheckNum = 0;
  const checkNum = 0;
  const handleChangeInventory = (value: string[]) => {
    setSelectedInventoryIds(value);
  };

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
  };
  return {
    inventoryTabsProps,
    inventoryTableProps,
    selectedTab,
    selectedInventoryIds,
    handleChangeInventory,
  };
};
