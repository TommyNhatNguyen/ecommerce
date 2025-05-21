import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { useInventorySetting } from "../../../hooks/useInventorySetting";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { mutate } from "swr";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updatedCell?: string;
    setUpdatedCell?: (id: string) => void;
  }
}

export type inventoryVariantColumnsProps = (
  intl: IntlShape,
) => ColumnDef<VariantProductModel>[];

export const inventoryVariantColumns: inventoryVariantColumnsProps = (intl) => [
  {
    accessorKey: "sku",
    header: intl.formatMessage({ id: "sku" }),
  },
  {
    accessorKey: "name",
    header: intl.formatMessage({ id: "name" }),
  },
  {
    accessorKey: "product_sellable.inventory.total_quantity",
    header: intl.formatMessage({ id: "total_stock_quantity" }),
  },
  {
    accessorKey: "product_sellable.inventory.low_stock_threshold",
    header: intl.formatMessage({ id: "low_stock_threshold" }),
    cell: ({ row, table, cell }) => {
      const [lowStockThreshold, setLowStockThreshold] = useState(
        row.original?.product_sellable?.inventory?.low_stock_threshold || 0,
      );
      const { handleUpdateLowStockThreshold } = useInventorySetting();
      const { updatedCell, setUpdatedCell } = table.options.meta || {};
      const inventoryId = row.original?.product_sellable?.inventory?.id || "";
      const isEditMode = updatedCell === `${cell.id}-${inventoryId}`;
      const _onUpdateThreshold = async () => {
        await handleUpdateLowStockThreshold(inventoryId, lowStockThreshold);
        setUpdatedCell?.("");
        await mutate([
          `/products`,
          {
            limit: 10,
            page: 1,
            includeVariant: true,
            includeVariantInventory: true,
            includeVariantInfo: true,
          },
        ]);
      };
      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && updatedCell) {
          _onUpdateThreshold();
        }
      };
      const handleBlur = () => {
        _onUpdateThreshold();
      };
      return isEditMode ? (
        <Input
          type="number"
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(Number(e.target.value))}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <div
          className="text-center"
          onClick={() => setUpdatedCell?.(`${cell.id}-${inventoryId}`)}
        >
          {lowStockThreshold}
        </div>
      );
    },
  },
  {
    accessorKey: "product_sellable.inventory.high_stock_threshold",
    header: intl.formatMessage({ id: "high_stock_threshold" }),
    cell: ({ row, table, cell }) => {
      const [highStockThreshold, setHighStockThreshold] = useState(
        row.original?.product_sellable?.inventory?.high_stock_threshold || 0,
      );
      const { handleUpdateHighStockThreshold } = useInventorySetting();
      const { updatedCell, setUpdatedCell } = table.options.meta || {};
      const inventoryId = row.original?.product_sellable?.inventory?.id || "";
      const isEditMode = updatedCell === `${cell.id}-${inventoryId}`;
      const _onUpdateThreshold = async () => {
        await handleUpdateHighStockThreshold(inventoryId, highStockThreshold);
        setUpdatedCell?.("");
        await mutate([
          `/products`,
          {
            limit: 10,
            page: 1,
            includeVariant: true,
            includeVariantInventory: true,
            includeVariantInfo: true,
          },
        ]);
      };
      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && updatedCell) {
          _onUpdateThreshold();
        }
      };
      const handleBlur = () => {
        _onUpdateThreshold();
      };
      return isEditMode ? (
        <Input
          type="number"
          value={highStockThreshold}
          onChange={(e) => setHighStockThreshold(Number(e.target.value))}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <div
          className="text-center"
          onClick={() => setUpdatedCell?.(`${cell.id}-${inventoryId}`)}
        >
          {highStockThreshold}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: intl.formatMessage({ id: "status" }),
  },
];
