"use client";
import { useInventorySetting } from "@/app/(dashboard)/admin/inventory/hooks/useInventorySetting";
import { STOCK_STATUS } from "@/app/constants/stock-status";
import InputAdmin from "@/app/shared/components/InputAdmin";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { productService } from "@/app/shared/services/products/productService";
import { formatCurrency } from "@/app/shared/utils/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Divider,
  Image,
  InputNumber,
  Pagination,
  Tag,
  Tooltip,
} from "antd";
import { Divide, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {};
const SettingsPage = (props: Props) => {
  const [page, setPage] = useState(1);
  const [limitPerPage, setLimitPerPage] = useState(10);
  const { handleUpdateLowStockThreshold, updateThresholdLoading } =
    useInventorySetting();
  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery({
    queryKey: [
      "inventory-low-stock-threshold",
      page,
      limitPerPage,
      updateThresholdLoading,
    ],
    queryFn: () =>
      productService.getProducts({
        page,
        limit: limitPerPage,
        includeCategory: true,
        includeImage: true,
      }),
  });
  const { meta, data: products } = productData || {};
  const { limit, total_count, current_page } = meta || {};

  const { control, handleSubmit, reset } = useForm();
  useEffect(() => {
    if (products) {
      const inventory = products.map((item) => item.inventory);
      const inventoryDataObject: Record<string, number> = {};
      inventory.forEach((item) => {
        inventoryDataObject[`low_stock_threshold${item?.id}`] =
          item?.low_stock_threshold || 0;
      });
      reset(inventoryDataObject);
    }
  }, [productData]);

  const _onUpdateLowStockThreshold = (id: string, threshold: number) => {
    handleUpdateLowStockThreshold(id, threshold);
    reset();
  };
  const _onPageChange = (page: number, limitPerPage: number) => {
    setPage(page);
    setLimitPerPage(limitPerPage);
  };
  const loading = isProductLoading || updateThresholdLoading;
  return (
    <div className="relative mb-4 rounded-lg bg-white px-4 py-2">
      <h2 className="text-lg font-medium">
        Inventory low stock threshold settings
      </h2>
      <div className="max-h-[700px] min-h-[500px] overflow-y-auto">
        {products &&
          products.map((item) => {
            const { id, category, inventory, name, image, price, description } =
              item;
            const { quantity, stock_status, id: inventoryId } = inventory || {};
            const stockStatus =
              STOCK_STATUS[stock_status as keyof typeof STOCK_STATUS] ||
              "OUT_OF_STOCK";
            const imageUrl = image?.[0]?.url || defaultImage;
            const categoryNames = category?.map((item) => item.name) || [];
            return (
              <React.Fragment key={id}>
                <Divider />
                <div
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex flex-1 gap-2">
                    <Image
                      src={imageUrl}
                      alt="default"
                      width={100}
                      height={100}
                      className="object-contain"
                    />
                    <div className="flex flex-1 flex-col gap-1">
                      <Tooltip title={description}>
                        <h3 className="text-lg font-medium">{name}</h3>
                      </Tooltip>
                      <p>
                        Price:{" "}
                        <span className="font-bold">
                          {formatCurrency(price || 0)}
                        </span>
                      </p>
                      <p>
                        Quantity:{" "}
                        <span className="font-bold">{quantity || 0}</span>
                      </p>
                      <p>
                        Category:{" "}
                        <span className="font-bold">
                          {categoryNames.map((item) => (
                            <Tag color="blue" key={item}>
                              {item}
                            </Tag>
                          ))}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end gap-1">
                    <Controller
                      control={control}
                      name={`low_stock_threshold${inventoryId}`}
                      render={({ field, formState: { errors } }) => (
                        <InputAdmin
                          {...field}
                          error={
                            errors[`low_stock_threshold${inventoryId}`]
                              ?.message as string
                          }
                          label={() => {
                            return (
                              <p className="flex items-center gap-1">
                                Stock Status:{" "}
                                <span className="font-bold">{stockStatus}</span>
                              </p>
                            );
                          }}
                          customComponent={(props, ref: any) => {
                            return (
                              <InputNumber
                                min={0}
                                className="h-full w-full"
                                {...props}
                                ref={ref}
                                disabled={loading}
                              />
                            );
                          }}
                        />
                      )}
                    />

                    <Button
                      type="primary"
                      disabled={loading}
                      onClick={handleSubmit((data) =>
                        _onUpdateLowStockThreshold(
                          inventoryId || "",
                          data[`low_stock_threshold${inventoryId}`] || 0,
                        ),
                      )}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Update
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>
      <div className="mt-4">
        <Pagination
          className="justify-end"
          total={total_count || 0}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          pageSize={limit || 10}
          current={current_page || 1}
          onChange={_onPageChange}
          showSizeChanger={true}
          pageSizeOptions={[10, 20, 30, 40, 50, Number(total_count)]}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
