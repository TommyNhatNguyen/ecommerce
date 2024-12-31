"use client";
import InventoryOverall from "@/app/(dashboard)/admin/(inventory-product)/inventory/(components)/InventoryOverall";
import InventoryTable from "@/app/(dashboard)/admin/(inventory-product)/inventory/(components)/InventoryTable";
import React, { useState } from "react";

type Props = {};

export default function InventoryPage() {
  return (
    <main className="inventory-page">
      <InventoryOverall />
      <InventoryTable />
    </main>
  );
}
