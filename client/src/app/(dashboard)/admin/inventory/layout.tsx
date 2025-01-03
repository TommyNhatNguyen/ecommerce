"use client";
import { TabsProps } from "antd";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { LucideSettings, LucideTrash, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs } from "antd";
import React, { useState } from "react";
import { LucideBoxes } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type InventoryProductLayoutPropsType = {
  children: React.ReactNode;
};

const InventoryProductLayout = ({
  children,
}: InventoryProductLayoutPropsType) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(
    pathname || ADMIN_ROUTES.inventory.index,
  );
  const router = useRouter();
  const _onChangeTab = (key: string) => {
    setActiveTab(key);
    router.push(key);
  };
  const tabs: TabsProps["items"] = [
    {
      label: "Inventory",
      key: ADMIN_ROUTES.inventory.index,
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: "Products",
      key: ADMIN_ROUTES.inventory.products,
      icon: <LucideBoxes className="h-4 w-4" />,
    },
    {
      label: "Deleted Products",
      key: ADMIN_ROUTES.inventory.deleted,
      icon: <LucideTrash className="h-4 w-4" />,
    },
    {
      label: "Inventory Settings",
      key: ADMIN_ROUTES.inventory.settings,
      icon: <LucideSettings className="h-4 w-4" />,
    },
  ];
  return (
    <>
      <div className="mb-4 rounded-lg bg-white px-4 py-2">
        <h2 className={cn("text-lg font-semibold")}>Tab Navigation</h2>
        <Tabs items={tabs} onChange={_onChangeTab} activeKey={activeTab} />
      </div>
      {children}
    </>
  );
};

export default InventoryProductLayout;
