"use client";
import useOrder from "@/app/(dashboard)/admin/orders/hooks/useOrder";
import { ORDER_STATE } from "@/app/constants/order-state";
import React from "react";
import OrderTable from "../components/OrderTable";
import { OrderState } from "@/app/shared/models/orders/orders.model";

type Props = {};

const ConfirmPage = (props: Props) => {
  const { orderTableProps } = useOrder(ORDER_STATE.CONFIRMED as OrderState);
  return (
    <main className="confirmed-page">
      <OrderTable {...orderTableProps} />
    </main>
  );
};

export default ConfirmPage;
