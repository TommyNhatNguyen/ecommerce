"use client";
import { TabsProps } from "antd";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { Tabs } from "antd";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIntl } from "react-intl";

const EXCLUDE_ROUTES = [
  ADMIN_ROUTES.inventory.products.categories,
  ADMIN_ROUTES.inventory.products.brands,
  ADMIN_ROUTES.inventory.products.attributes,
  ADMIN_ROUTES.inventory.settings,
];

type InventoryLayoutPropsType = {
  children: React.ReactNode;
};

const InventoryLayout = ({ children }: InventoryLayoutPropsType) => {
  const pathname = usePathname();
  console.log("🚀 ~ pathname:", pathname);
  const intl = useIntl();
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
      label: intl.formatMessage({ id: "stock" }),
      key: ADMIN_ROUTES.inventory.index,
    },
    {
      label: intl.formatMessage({ id: "warehouses_list" }),
      key: ADMIN_ROUTES.inventory.warehouses,
    },
    {
      label: intl.formatMessage({ id: "invoices_in_out" }),
      key: ADMIN_ROUTES.inventory.invoices,
    },
    {
      label: intl.formatMessage({ id: "check_inventory" }),
      key: ADMIN_ROUTES.inventory.checked,
    },
  ];
  return !EXCLUDE_ROUTES.includes(pathname) ? (
    <div className="h-full">
      <Tabs
        items={tabs}
        onChange={_onChangeTab}
        activeKey={activeTab}
        type="card"
      />
      <div className="h-full bg-custom-white p-2">{children}</div>
    </div>
  ) : (
    children 
  );
};

export default InventoryLayout;
