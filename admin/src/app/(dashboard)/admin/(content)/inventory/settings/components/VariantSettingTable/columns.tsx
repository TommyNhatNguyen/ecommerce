import { ProductModel } from "@/app/shared/models/products/products.model";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";

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
  },
  {
    accessorKey: "product_sellable.inventory.high_stock_threshold",
    header: intl.formatMessage({ id: "high_stock_threshold" }),
  },
  {
    accessorKey: "status",
    header: intl.formatMessage({ id: "status" }),
  },
];
