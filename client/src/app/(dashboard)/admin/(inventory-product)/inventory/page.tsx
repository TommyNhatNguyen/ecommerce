"use client";
import InventoryOverall from "@/app/(dashboard)/admin/(inventory-product)/inventory/(components)/InventoryOverall";
import InventoryTable from "@/app/(dashboard)/admin/(inventory-product)/inventory/(components)/InventoryTable";
import { useInventory } from "@/app/(dashboard)/admin/(inventory-product)/inventory/hooks/useInventory";
import React, { useState } from "react";

type Props = {};

export default function InventoryPage() {
  const { inventoryOverallProps, inventoryTableProps } = useInventory();
  return (
    <main className="inventory-page">
      <InventoryOverall {...inventoryOverallProps} />
      <InventoryTable {...inventoryTableProps} />
    </main>
  );
}
