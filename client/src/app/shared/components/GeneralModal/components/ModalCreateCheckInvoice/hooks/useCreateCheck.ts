import { useState } from "react";

export const useCreateCheck = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all_num");
  const allNum = 0;
  const uncheckNum = 0;
  const checkNum = 0;
  const inventoryTabsProps = {
    selectedTab,
    setSelectedTab,
    allNum,
    uncheckNum,
    checkNum,
  };
  return {
    inventoryTabsProps,
  };
};
