import { IntlShape } from "react-intl";
import { TableProps } from "antd";
import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";
import { formatCurrency } from "@/app/shared/utils/utils";
import { formatNumber } from "@/app/shared/utils/utils";

export const productInventoryColumns: (
  intl: IntlShape,
) => TableProps<WarehouseModel>["columns"] = (intl: IntlShape) => [
  {
    key: "warehouse_name",
    title: intl.formatMessage({ id: "warehouse_name" }),
    dataIndex: "warehouse_name",
    render: (_, { name }) => {
      return name;
    },
  },
  {
    key: "quantity",
    title: intl.formatMessage({ id: "quantity" }),
    dataIndex: "quantity",
    render: (_, { inventory_warehouse }) => {
      const { quantity } = inventory_warehouse;
      return formatNumber(quantity);
    },
  },
  {
    key: "cost",
    title: intl.formatMessage({ id: "cost" }),
    dataIndex: "cost",
    render: (_, { inventory_warehouse }) => {
      const { cost } = inventory_warehouse;
      return formatCurrency(cost);
    },
  },
  {
    key: "total_cost",
    title: intl.formatMessage({ id: "total_cost" }),
    dataIndex: "total_cost",
    render: (_, { inventory_warehouse }) => {
      const { total_cost } = inventory_warehouse;
      return formatCurrency(total_cost);
    },
  },
];