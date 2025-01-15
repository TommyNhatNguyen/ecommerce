"use client";
import OrderStatistics from "@/app/(dashboard)/admin/orders/components/OrderStatistics";
import OrderTable from "@/app/(dashboard)/admin/orders/components/OrderTable";
import useOrder from "@/app/(dashboard)/admin/orders/hooks/useOrder";
import React from "react";

type Props = {};

export default function OrdersPage() {
  const { orderTableProps, orderStatisticsProps } = useOrder();
  return (
    <main className="orders-page">
      <OrderStatistics {...orderStatisticsProps} />
      <OrderTable {...orderTableProps} />
    </main>
  );
}
