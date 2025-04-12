import { useNotification } from "@/app/contexts/NotificationContext";
import { useDebounce } from "@/app/shared/hooks/useDebounce";
import { CheckInventoryInvoicesCreateDTO } from "@/app/shared/interfaces/invoices/invoices.dto";
import { invoicesService } from "@/app/shared/services/invoices/invoicesService";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";

export type InventoryCheckSummaryData = {
  total_actual_quantity: number;
  total_difference_quantity: number;
  total_difference_amount: number;
};

export const useCreateCheck = () => {
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);
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
    });
  const { notificationApi } = useNotification();
  const intl = useIntl();
  const allNum = selectedInventoryIds.length;
  const uncheckNum = 0;
  const checkNum = 0;
  const debouncedSearch = useDebounce(search, 500);
  const handleChangeInventory = (value: string[]) => {
    setSelectedInventoryIds(value);
  };
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  const handleChangeInventoryCheckSummaryData = (
    data: InventoryCheckSummaryData,
  ) => {
    setInventoryCheckSummaryData(data);
  };

  const handleCreateCheckInventoryInvoice = async (
    data: CheckInventoryInvoicesCreateDTO,
  ) => {
    setIsCreateLoading(true);
    try {
      const response = await invoicesService.createCheckInventory(data);
      if (response) {
        notificationApi.success({
          message: intl.formatMessage({ id: "announcement" }),
          description: intl.formatMessage({
            id: "create_check_inventory_invoice_success",
          }),
        });
      }
    } catch (error) {
      notificationApi.error({
        message: intl.formatMessage({ id: "announcement" }),
        description: intl.formatMessage({
          id: "create_check_inventory_invoice_error",
        }),
      });
    } finally {
      setIsCreateLoading(false);
    }
  };

  const handleResetFields = () => {
    setSelectedInventoryIds([]);
    setCheckInventoryData({});
    setInventoryCheckSummaryData({
      total_actual_quantity: 0,
      total_difference_quantity: 0,
      total_difference_amount: 0,
    });
    setSelectedTab("all_num");
    setSearch("");
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
    handleCreateCheckInventoryInvoice,
    handleResetFields,
    isCreateLoading,
  };
};
