"use client";
import {
  PRODUCT_STATS_GROUP_BY,
  PRODUCT_STATS_GROUP_BY_MAP_LABEL,
} from "@/app/constants/product-stats";
import Dropdown from "@/app/shared/components/Dropdown";
import { useCreateProductModal } from "@/app/shared/components/GeneralModal/hooks/useCreateProductModal";
import { ProductStatsType } from "@/app/shared/interfaces/products/product.dto";
import { productService } from "@/app/shared/services/products/productService";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Divider, Select } from "antd";
import React, { useState } from "react";

type Props = {};

const InventoryOverall = (props: Props) => {
  const [groupBy, setGroupBy] = useState<string>(
    PRODUCT_STATS_GROUP_BY.CATEGORY,
  );
  const { data } = useQuery({
    queryKey: ["product-stats"],
    queryFn: () => productService.getProductStatistics(),
  });
  const { data: inventoryByCategory } = useQuery({
    queryKey: ["inventory-by-category", groupBy],
    queryFn: () =>
      productService.getProductStatistics({
        groupBy: groupBy as ProductStatsType,
      }),
  });
  const { totalInventoryQuantity } = data?.data || {};
  const { totalInventoryQuantity: totalInventoryQuantityByCategory } =
    inventoryByCategory?.data || {};
  const _onGroupByChange = (value: string) => {
    setGroupBy(value);
  };
  return (
    <div className={cn("inventory-page__overall", "rounded-lg bg-white p-4")}>
      <h2
        className={cn("inventory-page__overall-title", "text-lg font-semibold")}
      >
        Overall Inventory
      </h2>
      <div className="stats-wrapper flex items-center justify-between gap-6">
        <div className="inventory-page__overall-stats">
          <div className="mt-4 flex items-center gap-2">
            <h4 className={cn("text-sm font-semibold")}>Group by: </h4>
            <Select
              title="Group By"
              options={Object.values(PRODUCT_STATS_GROUP_BY).map((value) => ({
                label: PRODUCT_STATS_GROUP_BY_MAP_LABEL[value],
                value: value,
              }))}
              value={groupBy}
              onChange={_onGroupByChange}
            />
          </div>
          <div className="relative mt-4 flex items-start gap-6">
            <div className={cn("flex flex-col gap-2")}>
              <h4 className="text-sm font-semibold">Total Statistics</h4>
              <div className="grid grid-cols-2 gap-6">
                {totalInventoryQuantity?.map((item, index) => (
                  <React.Fragment key={index}>
                    <InventoryItem
                      title={"Total Inventory"}
                      value={item?.total || 0}
                      titleColor={"text-green-700"}
                    />
                    <InventoryItem
                      title={"Total SKUs"}
                      value={item.product_count || 0}
                      titleColor={"text-blue-700"}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className={cn("flex flex-col gap-2")}>
              <h5 className="px-4 text-sm font-medium">
                Total Inventory by {PRODUCT_STATS_GROUP_BY_MAP_LABEL[groupBy]}
              </h5>
              <div className="grid max-h-[100px] min-h-[100px] grid-cols-2 gap-6 overflow-y-auto px-4">
                {totalInventoryQuantityByCategory?.map((item, index) => {
                  return (
                    <InventoryItem
                      key={index}
                      title={item?.name || ""}
                      value={item?.total || 0}
                      titleColor="text-blue-700"
                    />
                  );
                })}
              </div>
            </div>
            <div className={cn("flex flex-col gap-2")}>
              <h5 className="px-4 text-sm font-medium">
                Total SKUs by {PRODUCT_STATS_GROUP_BY_MAP_LABEL[groupBy]}
              </h5>
              <div className="grid max-h-[100px] min-h-[100px] grid-cols-2 gap-6 overflow-y-auto px-4">
                {totalInventoryQuantityByCategory?.map((item, index) => {
                  return (
                    <InventoryItem
                      key={index}
                      title={item?.name || ""}
                      value={item?.product_count || 0}
                      titleColor="text-blue-700"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="inventory-page__overall-sort flex flex-1 flex-col gap-2 self-start">
          <h4 className="text-sm font-semibold">Top 10 products</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5>Top 10 products by quantity</h5>
            </div>
            <div>
              <h5>Bottom 10 products by SKUs</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOverall;

type InventoryItemProps = {
  title: string;
  value: string | number;
  lastUpdated?: string;
  titleColor: string;
};

const InventoryItem = ({
  title,
  value,
  lastUpdated,
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
      {title || "Others"}
    </h3>
    <p className={cn("inventory-page__overall-content-item-value", "text-sm")}>
      {formatNumber(Number(value) ?? 0)}
    </p>
    {lastUpdated && (
      <span
        className={cn(
          "inventory-page__overall-content-item-last-7-days",
          "text-sm text-zinc-400",
        )}
      >
        {lastUpdated}
      </span>
    )}
  </div>
);
