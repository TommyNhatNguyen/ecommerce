"use client";
import useOrder from "@/app/(dashboard)/admin/(content)/orders/hooks/useOrder";
import { ORDER_STATE } from "@/app/constants/order-state";
import React from "react";
import OrderTable from "../components/OrderTable";
import { OrderState } from "@/app/shared/models/orders/orders.model";

type Props = {};

const FailedPage = (props: Props) => {
  const { orderTableProps } = useOrder(ORDER_STATE.FAILED as OrderState);
  return (
    <main className="failed-page">
      <OrderTable {...orderTableProps} />
    </main>
  );
};

export default FailedPage;
