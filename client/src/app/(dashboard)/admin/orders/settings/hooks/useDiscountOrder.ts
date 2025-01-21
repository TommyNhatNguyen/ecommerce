import { CreateDiscountDTO } from "@/app/shared/interfaces/discounts/discounts.dto";
import { discountsService } from "@/app/shared/services/discounts/discountsService";

import { useNotification } from "@/app/contexts/NotificationContext";
import { CreatePaymentMethodDTO } from "@/app/shared/interfaces/payment/payment.dto";
import { CreateShippingDTO } from "@/app/shared/interfaces/shipping/shipping.dto";
import { paymentService } from "@/app/shared/services/payment/paymentServcie";
import { shippingService } from "@/app/shared/services/shipping/shippingService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DISCOUNT_SCOPE } from "@/app/constants/enum";
import { getDateFormat } from "@/app/shared/utils/datetime";

export const useDiscountOrder = () => {
  const [isOpenModalCreateDiscountOrder, setIsOpenModalCreateDiscountOrder] =
    useState(false);
  const [isOpenModalUpdateDiscountOrder, setIsOpenModalUpdateDiscountOrder] =
    useState("");
  const [deleteDiscountOrderLoading, setDeleteDiscountOrderLoading] =
    useState(false);
  const [deleteDiscountOrderError, setDeleteDiscountOrderError] =
    useState<any>(null);
  const [createDiscountOrderLoading, setCreateDiscountOrderLoading] =
    useState(false);
  const [createDiscountOrderError, setCreateDiscountOrderError] =
    useState<any>(null);
  const { data: discountOrderData, isLoading: isLoadingDiscountOrder } =
    useQuery({
      queryKey: [
        "discount-order",
        deleteDiscountOrderLoading,
        createDiscountOrderLoading,
      ],
      queryFn: () =>
        discountsService.getDiscounts({
          scope: DISCOUNT_SCOPE.ORDER,
        }),
      placeholderData: keepPreviousData,
    });
  const { notificationApi } = useNotification();
  const handleOpenModalCreateDiscountOrder = () => {
    setIsOpenModalCreateDiscountOrder(true);
  };
  const handleCloseModalCreateDiscountOrder = () => {
    setIsOpenModalCreateDiscountOrder(false);
  };
  const handleOpenModalUpdateDiscountOrder = (id: string) => {
    setIsOpenModalUpdateDiscountOrder(id);
  };
  const handleCloseModalUpdateDiscountOrder = () => {
    setIsOpenModalUpdateDiscountOrder("");
  };
  const handleSubmitCreateDiscountOrder = async (data: any) => {
    const payload: CreateDiscountDTO = {
      name: data.name,
      description: data.description,
      amount: Number(data.amount),
      type: data.type,
      scope: data.scope,
      start_date: data.startDate.format(getDateFormat()),
      end_date: data.endDate.format(getDateFormat()),
    };
    try {
      setCreateDiscountOrderLoading(true);
      const response = await discountsService.createDiscount(payload);
      if (response) {
        notificationApi.success({
          message: "Create discount order successfully",
          description: "Create discount order successfully",
        });
      }
    } catch (error) {
      setCreateDiscountOrderError(error);
      notificationApi.error({
        message: "Create discount order failed",
        description: "Create discount order failed",
      });
    } finally {
      setCreateDiscountOrderLoading(false);
      handleCloseModalCreateDiscountOrder();
    }
  };
  const handleDeleteDiscountOrder = async (id: string) => {
    try {
      setDeleteDiscountOrderLoading(true);
      await discountsService.deleteDiscount(id);
      notificationApi.success({
        message: "Delete discount order successfully",
        description: "Delete payment method successfully",
      });
    } catch (error) {
      setDeleteDiscountOrderError(error);
      notificationApi.error({
        message: "Delete discount order failed",
        description: "Delete discount order failed",
      });
    } finally {
      setDeleteDiscountOrderLoading(false);
    }
  };
  return {
    discountOrderData,
    isLoadingDiscountOrder,
    handleOpenModalCreateDiscountOrder,
    handleCloseModalCreateDiscountOrder,
    handleSubmitCreateDiscountOrder,
    isOpenModalCreateDiscountOrder,
    handleOpenModalUpdateDiscountOrder,
    handleCloseModalUpdateDiscountOrder,
    isOpenModalUpdateDiscountOrder,
    handleDeleteDiscountOrder,
    deleteDiscountOrderLoading,
    deleteDiscountOrderError,
    createDiscountOrderLoading,
    createDiscountOrderError,
  };
};
