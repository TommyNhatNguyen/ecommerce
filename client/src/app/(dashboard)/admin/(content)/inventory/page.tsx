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
  const pathname = usePathname();
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
  return (
    <div className="h-full">
      <Tabs
        items={tabs}
        onChange={_onChangeTab}
        activeKey={activeTab}
        type="card"
      />
      <div className="h-full bg-custom-white p-2">
        <div className="relative grid h-full grid-cols-12 gap-2 overflow-y-auto px-4">
          <div className="col-span-2">
            <InventoryFilter />
          </div>
          <div className="col-span-10">
            <InventoryTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
