import { useNotification } from "@/app/contexts/NotificationContext";
import { CreatePaymentMethodDTO } from "@/app/shared/interfaces/payment/payment.dto";
import { CreateShippingDTO } from "@/app/shared/interfaces/shipping/shipping.dto";
import { paymentService } from "@/app/shared/services/payment/paymentServcie";
import { shippingService } from "@/app/shared/services/shipping/shippingService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const usePaymentMethod = () => {
  const [isOpenModalCreatePaymentMethod, setIsOpenModalCreatePaymentMethod] =
    useState(false);
  const [isOpenModalUpdatePaymentMethod, setIsOpenModalUpdatePaymentMethod] =
    useState("");
  const [deletePaymentMethodLoading, setDeletePaymentMethodLoading] =
    useState(false);
  const [deletePaymentMethodError, setDeletePaymentMethodError] =
    useState<any>(null);
  const [createPaymentMethodLoading, setCreatePaymentMethodLoading] =
    useState(false);
  const [createPaymentMethodError, setCreatePaymentMethodError] =
    useState<any>(null);
  const { data: paymentMethodData, isLoading: isLoadingPaymentMethod } =
    useQuery({
      queryKey: [
        "payment-method",
        deletePaymentMethodLoading,
        createPaymentMethodLoading,
      ],
    queryFn: () => paymentService.getListPaymentMethod({}),
    placeholderData: keepPreviousData,
  });
  const { notificationApi } = useNotification();
  const handleOpenModalCreatePaymentMethod = () => {
    setIsOpenModalCreatePaymentMethod(true);
  };
  const handleCloseModalCreatePaymentMethod = () => {
    setIsOpenModalCreatePaymentMethod(false);
  };
  const handleOpenModalUpdatePaymentMethod = (id: string) => {
    setIsOpenModalUpdatePaymentMethod(id);
  };
  const handleCloseModalUpdatePaymentMethod = () => {
    setIsOpenModalUpdatePaymentMethod("");
  };
  const handleSubmitCreatePaymentMethod = async (data: CreatePaymentMethodDTO) => {
    try {
      setCreatePaymentMethodLoading(true);
      const response = await paymentService.createPaymentMethod(data);
      if (response) {
        notificationApi.success({
          message: "Create payment method successfully",
          description: "Create payment method successfully",
        });
      }
    } catch (error) {
      setCreatePaymentMethodError(error);
      notificationApi.error({
        message: "Create payment method failed",
        description: "Create payment method failed",
      });
    } finally {
      setCreatePaymentMethodLoading(false);
    }
  };
  const handleDeletePaymentMethod = async (id: string) => {
    try {
      setDeletePaymentMethodLoading(true);
      await paymentService.deletePaymentMethod(id);
      notificationApi.success({
        message: "Delete payment method successfully",
        description: "Delete payment method successfully",
      });
    } catch (error) {
      setDeletePaymentMethodError(error);
      notificationApi.error({
        message: "Delete payment method failed",
        description: "Delete payment method failed",
      });
    } finally {
      setDeletePaymentMethodLoading(false);
    }
  };
  return {
    paymentMethodData,
    isLoadingPaymentMethod,
    handleOpenModalCreatePaymentMethod,
    handleCloseModalCreatePaymentMethod,
    handleSubmitCreatePaymentMethod,
    isOpenModalCreatePaymentMethod,
    handleOpenModalUpdatePaymentMethod,
    handleCloseModalUpdatePaymentMethod,
    isOpenModalUpdatePaymentMethod,
    handleDeletePaymentMethod,
    deletePaymentMethodLoading,
    deletePaymentMethodError,
    createPaymentMethodLoading,
    createPaymentMethodError,
  };
};
