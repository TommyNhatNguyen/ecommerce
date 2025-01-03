import { formatCurrency } from "@/app/shared/utils/utils";
import { cn } from "@/lib/utils";
import { Divider } from "antd";
import React from "react";

type Props = {};

type InventoryItemProps = {
  title: string;
  value: string | number;
  last7Days: string;
  titleColor: string;
};

const InventoryItem = ({
  title,
  value,
  last7Days,
  titleColor,
}: InventoryItemProps) => (
  <div className={cn("inventory-page__overall-content-item")}>
    <h3
      className={cn(
        "inventory-page__overall-content-item-title",
        "text-sm font-semibold",
        titleColor,
      )}
    >
      {title}
    </h3>
    <p className={cn("inventory-page__overall-content-item-value", "text-sm")}>
      {value}
    </p>
    <span
      className={cn(
        "inventory-page__overall-content-item-last-7-days",
        "text-sm text-zinc-400",
      )}
    >
      {last7Days}
    </span>
  </div>
);

const InventoryOverall = (props: Props) => {
  const inventoryData = [
    {
      title: "Categories",
      value: formatCurrency(100),
      last7Days: "Last 7 days",
      titleColor: "text-blue-700",
    },
    {
      title: "Products",
      value: formatCurrency(100),
      last7Days: "Last 7 days",
      titleColor: "text-green-700",
    },
    {
      title: "Revenue",
      value: formatCurrency(25000),
      last7Days: "Revenue",
      titleColor: "text-red-700",
    },
    {
      title: "Top Selling",
      value: formatCurrency(5),
      last7Days: "Last 7 days",
      titleColor: "text-yellow-700",
    },
    {
      title: "Cost",
      value: formatCurrency(25000),
      last7Days: "Cost",
      titleColor: "text-purple-700",
    },
    {
      title: "Low Stock",
      value: formatCurrency(5),
      last7Days: "Ordered",
      titleColor: "text-orange-700",
    },
    {
      title: "Not in stock",
      value: formatCurrency(2),
      last7Days: "Not in stock",
      titleColor: "text-pink-700",
    },
  ];

  return (
    <div className={cn("inventory-page__overall", "rounded-lg bg-white p-4")}>
      <h2
        className={cn("inventory-page__overall-title", "text-lg font-semibold")}
      >
        Overall Inventory
      </h2>
      <div
        className={cn(
          "inventory-page__overall-content",
          "mt-2 flex justify-between",
        )}
      >
        {inventoryData.map((item, index) => (
          <React.Fragment key={index || item.title}>
            <InventoryItem
              title={item.title}
              value={item.value}
              last7Days={item.last7Days}
              titleColor={item.titleColor}
            />
            {index !== inventoryData.length - 1 && (
              <Divider type="vertical" className="h-[initial]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InventoryOverall;
