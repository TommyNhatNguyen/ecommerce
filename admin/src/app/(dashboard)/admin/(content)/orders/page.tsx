"use client";
import OrderTable from "@/app/(dashboard)/admin/(content)/orders/components/OrderTable";
import useOrder from "@/app/(dashboard)/admin/(content)/orders/hooks/useOrder";
import React from "react";


export default function OrdersPage() {
  const { orderTableProps } = useOrder(null);
  return (
    <main className="orders-page">
      <OrderTable {...orderTableProps} />
    </main>
  );
}
