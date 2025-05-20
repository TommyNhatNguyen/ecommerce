import { Table } from "@/components/ui/table";
import useSWR from "swr";
import React, { useMemo } from "react";
import {
  productFetcherService,
  productService,
} from "@/app/shared/services/products/productService";

type Props = {
  limit?: number;
  page?: number;
};

const SettingsTable = ({ limit = 10, page = 1 }: Props) => {
  const { data, error, isLoading } = useSWR<
    Awaited<ReturnType<typeof productFetcherService.getProducts>>,
    Error,
    Parameters<typeof productFetcherService.getProducts>
  >(
    [
      `/products`,
      {
        limit,
        page,
        includeVariant: true,
        includeVariantInventory: true,
        includeVariantInfo: true,
      },
    ],
    ([url, query]) => productFetcherService.getProducts(url, query),
  );
  const { data: products, meta } = data || {};
  return (
    <div>
      <Table>
        <div>
          {/* Hiển thị số lượng bản ghi */}
          {/* Hiển thị refresh */}
          {/* Hiển thị dropdown chọn cột hiển thị */}
        </div>
        <div>
          {/* Hiển thị Nested Table gồm: Tên sản phẩm, số lượng SKU */}
          {/* Bên trong nested Table gồm: Tên sản phẩm, số lượng trong kho, trạng thái, input cập nhật ngưỡng tồn kho tối thiểu, input cập nhật ngưỡng tồn kho tối đa */}
        </div>
      </Table>
    </div>
  );
};

export default SettingsTable;
