import { Table } from "@/components/ui/table";
import useSWR from "swr";
import React, { useMemo } from "react";
import {
  productFetcherService,
  productService,
} from "@/app/shared/services/products/productService";
import InventorySettingTable from "./data-table";
import { useIntl } from "react-intl";
import { inventorySettingColumns } from "./columns";

type Props = {
  limit?: number;
  page?: number;
};

const SettingsTable = ({ limit = 10, page = 1 }: Props) => {
  const intl = useIntl();
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
    {
      keepPreviousData: true,
    },
  );
  const { data: products, meta } = data || {};
  return (
    <div>
      <InventorySettingTable
        columns={inventorySettingColumns(intl)}
        data={products}
      />
    </div>
  );
};

export default SettingsTable;
