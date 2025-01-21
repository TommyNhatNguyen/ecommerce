import { useNotification } from "@/app/contexts/NotificationContext";
import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { costService } from "@/app/shared/services/cost/costService";
import { discountsService } from "@/app/shared/services/discounts/discountsService";
import { getDateFormat } from "@/app/shared/utils/datetime";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useCost = () => {
  const [isOpenModalCreateCost, setIsOpenModalCreateCost] = useState(false);
  const [isOpenModalUpdateCost, setIsOpenModalUpdateCost] = useState("");
  const [deleteCostLoading, setDeleteCostLoading] = useState(false);
  const [deleteCostError, setDeleteCostError] = useState<any>(null);
  const [createCostLoading, setCreateCostLoading] = useState(false);
  const [createCostError, setCreateCostError] = useState<any>(null);
  const { data: costData, isLoading: isLoadingCost } = useQuery({
    queryKey: [
      "cost",
        deleteCostLoading,
        createCostLoading,
      ],
      queryFn: () =>
        costService.getList({}),
      placeholderData: keepPreviousData,
    });
  const { notificationApi } = useNotification();
  const handleOpenModalCreateCost = () => {
    setIsOpenModalCreateCost(true);
  };
  const handleCloseModalCreateCost = () => {
    setIsOpenModalCreateCost(false);
  };
  const handleOpenModalUpdateCost = (id: string) => {
    setIsOpenModalUpdateCost(id);
  };
  const handleCloseModalUpdateCost = () => {
    setIsOpenModalUpdateCost("");
  };
  const handleSubmitCreateCost = async (data: any) => {
    try {
      setCreateCostLoading(true);
      const response = await costService.createCost(data);
      if (response) {
        notificationApi.success({
          message: "Create cost successfully",
          description: "Create cost successfully",
        });
      }
    } catch (error) {
      setCreateCostError(error);
      notificationApi.error({
        message: "Create cost failed",
        description: "Create cost failed",
      });
    } finally {
      setCreateCostLoading(false);
      handleCloseModalCreateCost();
    }
  };
  const handleDeleteCost = async (id: string) => {
    try {
      setDeleteCostLoading(true);
      await costService.deleteCost(id);
      notificationApi.success({
        message: "Delete cost successfully",
        description: "Delete cost successfully",
      });
    } catch (error) {
      setDeleteCostError(error);
      notificationApi.error({
        message: "Delete cost failed",
        description: "Delete cost failed",
      });
    } finally {
      setDeleteCostLoading(false);
    }
  };
  return {
    costData,
    isLoadingCost,
    handleOpenModalCreateCost,
    handleCloseModalCreateCost,
    handleSubmitCreateCost,
    isOpenModalCreateCost,
    handleOpenModalUpdateCost,
    handleCloseModalUpdateCost,
    isOpenModalUpdateCost,
    handleDeleteCost,
    deleteCostLoading,
    deleteCostError,
    createCostLoading,
    createCostError,
  };

}