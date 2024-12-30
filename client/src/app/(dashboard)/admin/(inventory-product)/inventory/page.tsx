"use client";
import InventoryOverall from "@/app/(dashboard)/admin/(inventory-product)/inventory/(components)/InventoryOverall";
import InventoryTable from "@/app/(dashboard)/admin/(inventory-product)/inventory/(components)/InventoryTable";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { cn } from "@/lib/utils";
import { Tabs, TabsProps } from "antd";
import { LucideBoxes, Package } from "lucide-react";
import { useRouter } from "next/navigation";
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
