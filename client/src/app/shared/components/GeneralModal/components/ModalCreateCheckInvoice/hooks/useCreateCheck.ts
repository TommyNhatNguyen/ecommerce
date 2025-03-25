import { useState } from "react";

export const useCreateCheck = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all_num");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<string[]>([]);
  const allNum = 0;
  const uncheckNum = 0;
  const checkNum = 0;
  const handleChangeWarehouse = (value: string) => {
    setSelectedWarehouseId(value);
  };
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
  return {
    inventoryTabsProps,
    selectedWarehouseId,
    handleChangeWarehouse,
    selectedInventoryIds,
    handleChangeInventory,  
  };
};
