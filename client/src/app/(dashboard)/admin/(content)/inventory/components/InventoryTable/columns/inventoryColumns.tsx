import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { TableProps } from "antd";
import { IntlShape } from "react-intl";

export const inventoryColumns: (
  intl: IntlShape,
) => TableProps<InventoryModel>["columns"] = (intl: IntlShape) => [
  {
    key: "sku",
  }
]