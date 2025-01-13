"use client";
import {
  PRODUCT_STATS_GROUP_BY,
  PRODUCT_STATS_GROUP_BY_MAP_LABEL,
  PRODUCT_STATS_SORT_BY,
  PRODUCT_STATS_SORT_BY_MAP_LABEL,
} from "@/app/constants/product-stats";
import Dropdown from "@/app/shared/components/Dropdown";
import { useCreateProductModal } from "@/app/shared/components/GeneralModal/hooks/useCreateProductModal";
import {
  ProductStatsSortBy,
  ProductStatsType,
} from "@/app/shared/interfaces/products/product.dto";
import { productService } from "@/app/shared/services/products/productService";
import { useDebounce } from "@/app/shared/hooks/useDebounce";
import { formatCurrency, formatNumber } from "@/app/shared/utils/utils";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Divider, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";

type Props = {};

const InventoryOverall = (props: Props) => {
  const [groupBy, setGroupBy] = useState<string>(
    PRODUCT_STATS_GROUP_BY.CATEGORY,
  );
  const [sortBy, setSortBy] = useState<string>(
    PRODUCT_STATS_SORT_BY.INVENTORY_QUANTITY,
  );
  const [topBotLimit, setTopBotLimit] = useState<number>(10);
  const debouncedTopBotLimit = useDebounce(topBotLimit, 300);
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
  const { data: top10Products } = useQuery({
    queryKey: ["top-10-products", sortBy, debouncedTopBotLimit],
    queryFn: () =>
      productService.getProducts({
        limit: debouncedTopBotLimit,
        sortBy: sortBy as ProductStatsSortBy,
        order: "DESC",
      }),
  });
  const { data: bottm10Products } = useQuery({
    queryKey: ["bottm-10-products", sortBy, debouncedTopBotLimit],
    queryFn: () =>
      productService.getProducts({
        limit: debouncedTopBotLimit,
        sortBy: sortBy as ProductStatsSortBy,
        order: "ASC",
      }),
  });
  const { totalInventoryQuantity } = data?.data || {};
  const { totalInventoryQuantity: totalInventoryQuantityByCategory } =
    inventoryByCategory?.data || {};
  const _onGroupByChange = (value: string) => {
    setGroupBy(value);
  };
  const _onSortByChange = (value: string) => {
    setSortBy(value);
  };
  const _onTopBotLimitChange = (value: number) => {
    setTopBotLimit(value);
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
          <div>
            <h4 className="text-sm font-semibold">
              Top/Bottom {topBotLimit} products inventory by{" "}
              {PRODUCT_STATS_SORT_BY_MAP_LABEL[sortBy]}
            </h4>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-medium">Sort By:</h5>
                <Select
                  title="Sort By"
                  options={Object.values(PRODUCT_STATS_SORT_BY).map(
                    (value) => ({
                      label: PRODUCT_STATS_SORT_BY_MAP_LABEL[value],
                      value: value,
                    }),
                  )}
                  value={sortBy}
                  onChange={_onSortByChange}
                />
              </div>
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-medium">Num show:</h5>
                <InputNumber
                  title="Top/Bottom"
                  value={topBotLimit}
                  onChange={(value) => _onTopBotLimitChange(Number(value))}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <h5 className="text-sm font-medium">Top {topBotLimit}</h5>
              <div className="grid max-h-[100px] min-h-[100px] grid-cols-2 gap-4 overflow-y-auto">
                {top10Products?.data?.map((item) => {
                  return (
                    <InventoryItem
                      title={item?.name || ""}
                      value={item?.inventory?.quantity || 0}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h5 className="text-sm font-medium">Bottom {topBotLimit}</h5>
              <div className="grid max-h-[100px] min-h-[100px] grid-cols-2 gap-4 overflow-y-auto">
                {bottm10Products?.data?.map((item) => {
                  return (
                    <InventoryItem
                      title={item?.name || ""}
                      value={item?.inventory?.quantity || 0}
                    />
                  );
                })}
              </div>
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
  titleColor?: string;
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
