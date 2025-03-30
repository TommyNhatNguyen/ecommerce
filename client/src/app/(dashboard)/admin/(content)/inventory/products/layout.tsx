"use client";
import { TabsProps } from "antd";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import { Tabs } from "antd";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useIntl } from "react-intl";

type InventoryProductLayoutPropsType = {
  children: React.ReactNode;
};

const InventoryProductLayout = ({
  children,
}: InventoryProductLayoutPropsType) => {
  const pathname = usePathname();
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState<string>(
    pathname || ADMIN_ROUTES.inventory.products.index,
  );
  const router = useRouter();
  const _onChangeTab = (key: string) => {
    setActiveTab(key);
    router.push(key);
  };
  const tabs: TabsProps["items"] = [
    {
      label: intl.formatMessage({ id: "products_list" }),
      key: ADMIN_ROUTES.inventory.products.index,
    },
    {
      label: intl.formatMessage({ id: "categories" }),
      key: ADMIN_ROUTES.inventory.products.categories,
    },
    {
      label: intl.formatMessage({ id: "brands" }),
      key: ADMIN_ROUTES.inventory.products.brands,
    },
    {
      label: intl.formatMessage({ id: "attributes" }),
      key: ADMIN_ROUTES.inventory.products.attributes,
    },
  ];
  return (
    <div className="h-full">
      <Tabs
        items={tabs}
        onChange={_onChangeTab}
        activeKey={activeTab}
        type="card"
      />
      <div className="h-full bg-custom-white p-2">{children}</div>
    </div>
  );
};

export default InventoryProductLayout;
