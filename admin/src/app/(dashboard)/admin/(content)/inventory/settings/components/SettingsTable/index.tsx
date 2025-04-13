import { useInventorySetting } from "@/app/(dashboard)/admin/(content)/inventory/hooks/useInventorySetting";
import { productService } from "@/app/shared/services/products/productService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button, Table } from "antd";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { settingsColumns } from "./columns/settingsColumns";
import { useIntl } from "react-intl";
import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { RefreshCcw } from "lucide-react";

type Props = {
  limit?: number;
};

const SettingsTable = ({ limit = 10 }: Props) => {
  const intl = useIntl();
  const { control, setValue } = useForm<{
    id: string;
    threshold: number;
  }[]>();

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
        limit,
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

  const { handleUpdateLowStockThreshold } = useInventorySetting();

  const _onUpdateLowStockThreshold = async (id: string, threshold: number) => {
    await handleUpdateLowStockThreshold(id, threshold);
    refetch();
  };

  const { productColumns, variantColumns } = settingsColumns({
    intl,
    control,
    setValue,
    onUpdateThreshold: _onUpdateLowStockThreshold,
  });

  const products = useMemo(() => {
    return productsData?.pages.flatMap((page) => page.data) || [];
  }, [productsData]);

  const variantExpandedRowRender = (data: VariantProductModel[]) => {
    return (
      <Table<VariantProductModel>
        columns={variantColumns}
        dataSource={data}
        pagination={false}
        rowKey={(record) => record.id}
        tableLayout="auto"
      />
    );
  };

  return (
    <div className="h-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="left">
          {intl.formatMessage(
            { id: "showing" },
            {
              num_rows: products.length,
              num_total_rows: productsData?.pages?.[0]?.meta?.total_count || 0,
            },
          )}
        </div>
        <div className="right flex items-center gap-2">
          <Button
            type="primary"
            icon={<RefreshCcw width={16} height={16} />}
            onClick={() => refetch()}
          >
            {intl.formatMessage({ id: "refresh" })}
          </Button>
        </div>
      </div>
      <div>
        <Table<ProductModel>
          tableLayout="auto"
          columns={productColumns}
          dataSource={products}
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
            className="mx-auto mt-4"
            onClick={() => fetchNextPage()}
          >
            {intl.formatMessage({ id: "load_more" })}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SettingsTable;
