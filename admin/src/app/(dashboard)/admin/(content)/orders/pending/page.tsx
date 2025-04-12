"use client";
import useOrder from "@/app/(dashboard)/admin/(content)/orders/hooks/useOrder";
import { ORDER_STATE } from "@/app/constants/order-state";
import React from "react";
import OrderTable from "../components/OrderTable";
import { OrderState } from "@/app/shared/models/orders/orders.model";

type Props = {};

const PendingPage = (props: Props) => {
  const { orderTableProps } = useOrder(ORDER_STATE.PENDING as OrderState);
  return (
    <main className="pending-page">
      <OrderTable {...orderTableProps} />
    </main>
  );
};

export default PendingPage;
