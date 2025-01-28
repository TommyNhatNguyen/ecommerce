"use client";
import useOrder from "@/app/(dashboard)/admin/(content)/orders/hooks/useOrder";
import { ORDER_STATE } from "@/app/constants/order-state";
import React from "react";
import OrderTable from "../components/OrderTable";
import { OrderState } from "@/app/shared/models/orders/orders.model";
import { orderService } from "@/app/shared/services/orders/orderService";

type Props = {};

const DeletedPage = (props: Props) => {
  const { orderTableProps } = useOrder(ORDER_STATE.CANCELLED as OrderState);
  const customQuery = {
    queryKey: ["orders", ORDER_STATE.CANCELLED],
    queryFn: () =>
      orderService.getList({
        includeOrderDetail: true,
        includeDiscount: true,
        includeCost: true,
        includeProducts: true,
        includeShipping: true,
        includePayment: true,
        status: "DELETED",
      }),
  };
  return (
    <main className="deleted-page">
      <OrderTable
        {...orderTableProps}
        customQuery={customQuery}
        isPermanentDelete={true}
      />
    </main>
  );
};

export default DeletedPage;
