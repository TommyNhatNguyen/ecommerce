import OrderStatistics from "@/app/(dashboard)/admin/orders/components/OrderStatistics";
import OrderTable from "@/app/(dashboard)/admin/orders/components/OrderTable";
import React from "react";

type Props = {};

export default function OrdersPage() {
  return (
    <main className="orders-page">
      <OrderStatistics />
      <OrderTable />
    </main>
  );
}
