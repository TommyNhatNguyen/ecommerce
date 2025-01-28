"use client";
import OrderStatistics from "@/app/(dashboard)/admin/(content)/orders/components/OrderStatistics";
import OrderTable from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable";
import useOrder from "@/app/(dashboard)/admin/(content)/orders/hooks/useOrder";
import React from "react";

type Props = {};

export default function OrdersPage() {
  const { orderTableProps, orderStatisticsProps } = useOrder(null);
  return (
    <main className="orders-page">
      <OrderStatistics {...orderStatisticsProps} />
      <OrderTable {...orderTableProps} />
    </main>
  );
}
