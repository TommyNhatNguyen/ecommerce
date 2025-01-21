import { useNotification } from "@/app/contexts/NotificationContext";
import { CreateShippingDTO } from "@/app/shared/interfaces/shipping/shipping.dto";
import { shippingService } from "@/app/shared/services/shipping/shippingService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useShipping = () => {
  const [isOpenModalCreateShipping, setIsOpenModalCreateShipping] =
    useState(false);
  const [isOpenModalUpdateShipping, setIsOpenModalUpdateShipping] =
    useState("");
  const [deleteShippingLoading, setDeleteShippingLoading] = useState(false);
  const [deleteShippingError, setDeleteShippingError] = useState<any>(null);
  const [createShippingLoading, setCreateShippingLoading] = useState(false);
  const [createShippingError, setCreateShippingError] = useState<any>(null);
  const { data: shippingData, isLoading: isLoadingShipping } = useQuery({
    queryKey: ["shipping", deleteShippingLoading, createShippingLoading],
    queryFn: () => shippingService.getList({}),
    placeholderData: keepPreviousData,
  });
  const { notificationApi } = useNotification();
  const handleOpenModalCreateShipping = () => {
    setIsOpenModalCreateShipping(true);
  };
  const handleCloseModalCreateShipping = () => {
    setIsOpenModalCreateShipping(false);
  };
  const handleOpenModalUpdateShipping = (id: string) => {
    setIsOpenModalUpdateShipping(id);
  };
  const handleCloseModalUpdateShipping = () => {
    setIsOpenModalUpdateShipping("");
  };
  const handleSubmitCreateShipping = async (data: CreateShippingDTO) => {
    try {
      setCreateShippingLoading(true);
      const response = await shippingService.createShipping(data);
      if (response) {
        notificationApi.success({
          message: "Create shipping successfully",
          description: "Create shipping successfully",
        });
      }
    } catch (error) {
      setCreateShippingError(error);
      notificationApi.error({
        message: "Create shipping failed",
        description: "Create shipping failed",
      });
    } finally {
      setCreateShippingLoading(false);
    }
  };
  const handleDeleteShipping = async (id: string) => {
    try {
      setDeleteShippingLoading(true);
      await shippingService.deleteShipping(id);
      notificationApi.success({
        message: "Delete shipping successfully",
        description: "Delete shipping successfully",
      });
    } catch (error) {
      setDeleteShippingError(error);
      notificationApi.error({
        message: "Delete shipping failed",
        description: "Delete shipping failed",
      });
    } finally {
      setDeleteShippingLoading(false);
    }
  };
  return {
    shippingData,
    isLoadingShipping,
    handleOpenModalCreateShipping,
    handleCloseModalCreateShipping,
    handleSubmitCreateShipping,
    isOpenModalCreateShipping,
    handleOpenModalUpdateShipping,
    handleCloseModalUpdateShipping,
    isOpenModalUpdateShipping,
    handleDeleteShipping,
    deleteShippingLoading,
    deleteShippingError,
    createShippingLoading,
    createShippingError,
  };
};
