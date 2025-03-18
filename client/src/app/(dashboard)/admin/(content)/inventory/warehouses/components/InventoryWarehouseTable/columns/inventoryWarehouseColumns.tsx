import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";
import { formatCurrency } from "@/app/shared/utils/utils";
import { formatNumber } from "@/app/shared/utils/utils";
import { TableProps, Tag } from "antd";
import { IntlShape } from "react-intl";

export const warehouseColumns: (
  intl: IntlShape,
) => TableProps<WarehouseModel>["columns"] = (intl: IntlShape) => [
  {
    key: "name",
    title: intl.formatMessage({ id: "name" }),
    dataIndex: "name",
  },
  {
    key: "address",
    title: intl.formatMessage({ id: "address" }),
    dataIndex: "address",
  },
  {
    key: "total_quantity",
    title: intl.formatMessage({ id: "total_quantity_in_warehouse" }),
    dataIndex: "total_quantity",
    render: (_, { total_quantity }) => {
      return <span>{formatNumber(total_quantity)}</span>;
    },
  },
  {
    key: "total_cost",
    title: intl.formatMessage({ id: "total_cost_in_warehouse" }),
    dataIndex: "total_cost",
    render: (_, { total_cost }) => {
      return <span>{formatCurrency(total_cost)}</span>;
    },
  },
  {
    key: "description",
    title: intl.formatMessage({ id: "description" }),
    dataIndex: "description",
  },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
    render: (_, { status }) => {
      return (
        <div>
          {status === "ACTIVE" ? (
            <Tag color="green">{intl.formatMessage({ id: status })}</Tag>
          ) : (
            <Tag color="red">{intl.formatMessage({ id: status })}</Tag>
          )}
        </div>
      );
    },
  },
  {
    key: "created_at",
    title: intl.formatMessage({ id: "created_at" }),
    dataIndex: "created_at",
  },
  {
    key: "updated_at",
    title: intl.formatMessage({ id: "updated_at" }),
    dataIndex: "updated_at",
  },
];
