import { ProductModel } from "@/app/shared/models/products/products.model";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { IntlShape } from "react-intl";

export type inventorySettingColumnsProps = (
  intl: IntlShape,
) => ColumnDef<ProductModel>[];

export const inventorySettingColumns: inventorySettingColumnsProps = (
  intl: IntlShape,
) => [
  {
    accessorKey: "expand",
    header: "",
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button variant={"ghost"} size={"icon"}>
          {row.getIsExpanded() ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Button>
      ) : null;
    },
  },
  {
    accessorKey: "sku",
    header: intl.formatMessage({ id: "sku" }),
  },
  {
    accessorKey: "name",
    header: intl.formatMessage({ id: "name" }),
  },
  {
    accessorKey: "number_of_variants",
    header: intl.formatMessage({ id: "number_of_variants" }),
    accessorFn: (row) => row?.variant?.length || 0,
  },
  {
    accessorKey: "status",
    header: intl.formatMessage({ id: "status" }),
  },
];
