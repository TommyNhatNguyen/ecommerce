"use client";
import {
  LucideCheckCircle,
  LucideFileCheck,
  LucideFileText,
  LucideSettings,
  LucideTruck,
  LucideX,
} from "lucide-react";
import { LucideTrash } from "lucide-react";
import { Package } from "lucide-react";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { cn } from "@/app/shared/utils/utils";
import { Tabs, TabsProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type OrdersLayoutPropsType = {
  children: React.ReactNode;
};

const OrdersLayout = ({ children }: OrdersLayoutPropsType) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(
    pathname || ADMIN_ROUTES.orders.index,
  );
  const router = useRouter();
  const _onChangeTab = (key: string) => {
    setActiveTab(key);
    router.push(key);
  };
  const tabs: TabsProps["items"] = [
    {
      label: "Orders",
      key: ADMIN_ROUTES.orders.index,
      icon: <Package className="h-4 w-4" />,
    },
    {
      label: "Pending",
      key: ADMIN_ROUTES.orders.pending,
      icon: <LucideFileText className="h-4 w-4" />,
    },
    {
      label: "Confirmed",
      key: ADMIN_ROUTES.orders.confirmed,
      icon: <LucideFileCheck className="h-4 w-4" />,
    },
    {
      label: "Shipped",
      key: ADMIN_ROUTES.orders.shipped,
      icon: <LucideTruck className="h-4 w-4" />,
    },
    {
      label: "Delivered",
      key: ADMIN_ROUTES.orders.delivered,
      icon: <LucideCheckCircle className="h-4 w-4" />,
    },
    {
      label: "Failed",
      key: ADMIN_ROUTES.orders.failed,
      icon: <LucideX className="h-4 w-4" />,
    },
    {
      label: "Deleted",
      key: ADMIN_ROUTES.orders.deleted,
      icon: <LucideTrash className="h-4 w-4" />,
    },
    {
      label: "Settings",
      key: ADMIN_ROUTES.orders.settings,
      icon: <LucideSettings className="h-4 w-4" />,
    },
  ];

  return (
    <>
      <div className="mb-4 rounded-lg bg-white px-4 py-2">
        <Tabs items={tabs} onChange={_onChangeTab} activeKey={activeTab} />
      </div>
      {children}
    </>
  );
};

export default OrdersLayout;
