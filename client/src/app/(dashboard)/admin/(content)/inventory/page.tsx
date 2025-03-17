"use client";
import { TabsProps } from "antd";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { Tabs } from "antd";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import InventoryFilter from "@/app/(dashboard)/admin/(content)/inventory/components/InventoryFilter";
import InventoryTable from "@/app/(dashboard)/admin/(content)/inventory/components/InventoryTable";
type InventoryPagePropsType = {
  children: React.ReactNode;
};

const InventoryPage = ({ children }: InventoryPagePropsType) => {
  return (
    <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
      <div className="col-span-2">
        <InventoryFilter />
      </div>
      <div className="col-span-10">
        <InventoryTable />
      </div>
    </div>
  );
};

export default InventoryPage;
