import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { WarehouseModel } from "@/app/shared/models/warehouse/warehouse.model";
import { formatCurrency } from "@/app/shared/utils/utils";
import { formatNumber } from "@/app/shared/utils/utils";
import { TableProps, Tag, Tooltip } from "antd";
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

export const inventoryWarehouseColumns: (
  intl: IntlShape,
) => TableProps<InventoryModel>["columns"] = (intl: IntlShape) => [
  {
    key: "sku",
    title: intl.formatMessage({ id: "sku" }),
    dataIndex: "sku",
    render: (_, { product_sellable }) => {
      const { sku } = product_sellable.variant || {};
      return <span>{sku}</span>;
    },
  },
  {
    key: "name",
    title: intl.formatMessage({ id: "name" }),
    dataIndex: "name",
    render: (_, { product_sellable }) => {
      const { name } = product_sellable.variant || {};
      return <span>{name}</span>;
    },
  },
  {
    key: "quantity",
    title: intl.formatMessage({ id: "quantity" }),
    dataIndex: "quantity",
    render: (_, { inventory_warehouse, total_quantity }) => {
      const { quantity } = inventory_warehouse;
      const percentage = (quantity / total_quantity) * 100;
      return (
        <Tooltip
          title={intl.formatMessage(
            { id: "account_for_percentage_of_total_quantity_all_warehouse" },
            { percentage: percentage.toFixed(1) },
          )}
        >
          {formatNumber(quantity)}
        </Tooltip>
      );
    },
  },
  {
    key: "cost",
    title: intl.formatMessage({ id: "cost" }),
    dataIndex: "cost",
    render: (_, { inventory_warehouse, total_cost }) => {
      const { cost } = inventory_warehouse;
      const percentage = (cost / total_cost) * 100;
      return (
        <Tooltip
          title={intl.formatMessage(
            { id: "account_for_percentage_of_total_cost_all_warehouse" },
            { percentage: percentage.toFixed(1) },
          )}
        >
          {formatCurrency(cost)}
        </Tooltip>
      );
    },
  },
  {
    key: "stock_status",
    title: () => intl.formatMessage({ id: "stock_status" }),
    dataIndex: "stock_status",
    render: (_, { product_sellable }) => {
      const high_stock_threshold =
        product_sellable?.inventory?.high_stock_threshold || 0;
      const low_stock_threshold =
        product_sellable?.inventory?.low_stock_threshold || 0;
      const stock_status =
        product_sellable?.inventory?.stock_status || "OUT_OF_STOCK";
      const stock_status_color: Record<StockStatus, string> = {
        LOW_STOCK: "orange",
        OVER_STOCK: "blue",
        IN_STOCK: "green",
        OUT_OF_STOCK: "red",
      };
      const stock_status_text: Record<StockStatus, string> = {
        LOW_STOCK: intl.formatMessage({ id: "low_stock" }),
        OVER_STOCK: intl.formatMessage({ id: "over_stock" }),
        IN_STOCK: intl.formatMessage({ id: "in_stock" }),
        OUT_OF_STOCK: intl.formatMessage({ id: "out_of_stock" }),
      };
      return (
        <Tooltip
          title={
            <div>
              <p>
                {intl.formatMessage({ id: "high_stock_threshold" })}:{" "}
                {formatNumber(high_stock_threshold)}
              </p>
              <p>
                {intl.formatMessage({ id: "low_stock_threshold" })}:{" "}
                {formatNumber(low_stock_threshold)}
              </p>
            </div>
          }
        >
          <Tag color={stock_status_color[stock_status]}>
            {stock_status_text[stock_status]}
          </Tag>
        </Tooltip>
      );
    },
  },
  {
    key: "status",
    title: () => intl.formatMessage({ id: "status" }),
    dataIndex: "status",
    render: (_, { status }) => {
      return (
        <div>
          {status === "ACTIVE" ? (
            <Tag color="green">{intl.formatMessage({ id: "is_selling" })}</Tag>
          ) : (
            <Tag color="red">
              {intl.formatMessage({ id: "is_discountinued" })}
            </Tag>
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
