"use client";
import { useInventorySetting } from "@/app/(dashboard)/admin/(content)/inventory/hooks/useInventorySetting";
import { STOCK_STATUS } from "@/app/constants/stock-status";
import InputAdmin from "@/app/shared/components/InputAdmin";
import LoadingComponent from "@/app/shared/components/LoadingComponent";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { productService } from "@/app/shared/services/products/productService";
import { formatCurrency } from "@/app/shared/utils/utils";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  Button,
  Carousel,
  Divider,
  Image,
  InputNumber,
  Pagination,
  Table,
  TableProps,
  Tag,
  Tooltip,
} from "antd";
import { Divide, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {};
const SettingsPage = (props: Props) => {
  const { control, setValue } = useForm<
    {
      id: string;
      threshold: number;
    }[]
  >();
  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["inventory-low-stock-threshold"],
    queryFn: (p) =>
      productService.getProducts({
        page: p.pageParam,
        limit: 3,
        includeVariant: true,
        includeVariantInfo: true,
        includeVariantInventory: true,
        includeCategory: true,
        includeImage: true,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.current_page === lastPage.meta.total_page) {
        return undefined;
      }
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
  });
  const { handleUpdateLowStockThreshold, updateThresholdLoading } =
    useInventorySetting();
  const _onUpdateLowStockThreshold = (id: string, threshold: number) => {
    handleUpdateLowStockThreshold(id, threshold);
    refetch();
  };
  const productColumns: TableProps<ProductModel>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (_, { category }) => {
        return (
          <div className="flex flex-wrap gap-2">
            {category?.map((item) => <Tag key={item.id}>{item.name}</Tag>)}
          </div>
        );
      },
    },
    {
      title: "Total Variant",
      dataIndex: "total_variant",
      key: "total_variant",
      render: (_, { variant }) => {
        return variant?.length || 0;
      },
    },
  ];
  const variantColumns: TableProps<VariantProductModel>["columns"] = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      className: "max-w-[100px]",
      minWidth: 100,
      render: (_, { product_sellable }) => {
        const images = product_sellable?.image || [];
        return (
          <Image.PreviewGroup
            items={images.map((item) => item.url)}
            preview={{
              movable: false,
            }}
          >
            <Carousel autoplay dotPosition="bottom">
              {images.map((item) => (
                <Image
                  className="object-contain object-center"
                  src={item.url}
                  alt={item.url}
                  key={item.id}
                />
              ))}
            </Carousel>
          </Image.PreviewGroup>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Inventory",
      dataIndex: "inventory",
      key: "inventory",
      render: (_, { product_sellable }) => {
        return product_sellable?.inventory?.quantity || 0;
      },
    },
    {
      title: "Stock status",
      dataIndex: "stock_status",
      key: "stock_status",
      render: (_, { product_sellable }) => {
        return product_sellable?.inventory?.stock_status || "";
      },
    },
    {
      title: "Update low stock threshold",
      dataIndex: "update_low_stock_threshold",
      key: "update_low_stock_threshold",
      render: (_, { product_sellable }, index) => {
        const id = product_sellable?.inventory?.id || "";
        const threshold = product_sellable?.inventory?.low_stock_threshold || 0;
        setValue(`${index}.id`, id);
        setValue(`${index}.threshold`, threshold);
        return (
          <Controller
            control={control}
            name={`${index}.threshold`}
            render={({ field }) => {
              return (
                <InputAdmin
                  placeholder="Enter low stock threshold"
                  {...field}
                  customComponent={(props, ref: any) => {
                    return (
                      <div className="flex w-full items-center gap-1">
                        <InputNumber
                          {...props}
                          ref={ref}
                          className="w-full"
                          min={0}
                        />
                        <Button
                          type="primary"
                          onClick={() =>
                            _onUpdateLowStockThreshold(id, props.value)
                          }
                        >
                          Update
                        </Button>
                      </div>
                    );
                  }}
                />
              );
            }}
          />
        );
      },
    },
  ];
  const variantExpandedRowRender = (data: VariantProductModel[]) => {
    return (
      <Table
        columns={variantColumns}
        dataSource={data}
        pagination={false}
        rowKey={(record) => record.id}
        tableLayout="auto"
      />
    );
  };
  return (
    <div className="relative mb-4 rounded-lg bg-white px-4 py-2">
      <h2 className="text-lg font-medium">
        Inventory low stock threshold settings
      </h2>
      <div className="relative mt-4 h-full">
        <Table
          tableLayout="auto"
          columns={productColumns}
          dataSource={productsData?.pages.flatMap((page) => page.data)}
          pagination={false}
          rowKey={(record) => record.id}
          expandable={{
            expandRowByClick: true,
            expandedRowRender: (record) => {
              const variantData =
                (productsData &&
                  productsData.pages.flatMap((page) =>
                    page.data.flatMap((item) => item.variant || []),
                  )) ||
                [];
              const data = variantData.filter(
                (item) => item?.product_id === record.id,
              );
              return variantExpandedRowRender(data);
            },
          }}
        />

        {hasNextPage && (
          <Button
            className="mx-auto self-center mt-4"
            variant="outlined"
            onClick={() => fetchNextPage()}
          >
            Load more
          </Button>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
