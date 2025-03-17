import { InventoryModel } from "@/app/shared/models/inventories/inventories.model";
import { StockStatus } from "@/app/shared/models/inventories/stock-status";
import { VariantProductModel } from "@/app/shared/models/variant/variant.model";
import {
  formatCurrency,
  formatDiscountPercentage,
  formatNumber,
} from "@/app/shared/utils/utils";
import { Image, TableProps, Tag, Tooltip } from "antd";
import { IntlShape } from "react-intl";

export const inventoryColumns: (
  intl: IntlShape,
) => TableProps<VariantProductModel>["columns"] = (intl: IntlShape) => [
  {
    key: "image",
    title: () => intl.formatMessage({ id: "thumbnail" }),
    render: (_, { product_sellable }) => {
      const image = product_sellable?.image?.[0];
      return <Image src={image?.url} width={50} height={50} />;
    },
  },
  {
    key: "sku",
    title: () => intl.formatMessage({ id: "sku" }),
    dataIndex: "sku",
  },
  {
    key: "name",
    title: () => intl.formatMessage({ id: "name" }),
    dataIndex: "name",
  },
  {
    key: "price",
    title: () => intl.formatMessage({ id: "price" }),
    dataIndex: "price",
    render: (_, { product_sellable }) => {
      const price = product_sellable?.price;
      return price ? formatCurrency(price) : "-";
    },
  },
  {
    key: "avg_cost",
    title: () => intl.formatMessage({ id: "avg_cost" }),
    dataIndex: "avg_cost",
    render: (_, { product_sellable }) => {
      const avg_cost = product_sellable?.inventory?.avg_cost;
      return avg_cost ? formatCurrency(avg_cost) : "-";
    },
  },
  {
    key: "profit_per_product",
    title: () => intl.formatMessage({ id: "profit_per_product" }),
    dataIndex: "profit_per_product",
    render: (_, { product_sellable }) => {
      const price = product_sellable?.price || 0;
      const avg_cost = product_sellable?.inventory?.avg_cost || 0;
      const profit = price - avg_cost;
      const margin = (profit * 100) / price;
      return (
        <Tooltip
          title={`${intl.formatMessage({ id: "profit_margin" })}: ${formatDiscountPercentage(margin)}`}
        >
          {formatCurrency(profit)}
        </Tooltip>
      );
    },
  },
  {
    key: "total_stock_quantity",
    title: () => intl.formatMessage({ id: "total_stock_quantity" }),
    dataIndex: "total_stock_quantity",
    render: (_, { product_sellable }) => {
      const total_quantity = product_sellable?.inventory?.total_quantity;
      return total_quantity ? formatNumber(total_quantity) : "-";
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
    key: "note",
    title: () => intl.formatMessage({ id: "note" }),
    dataIndex: "note",
  },
  {
    key: "warehouse",
    title: () => intl.formatMessage({ id: "warehouse" }),
    dataIndex: "warehouse",
    render: (_, { product_sellable }) => {
      const warehouse_names_list = product_sellable?.inventory?.warehouse?.map(
        (warehouse) => warehouse.name,
      );
      return warehouse_names_list?.map((name) => <Tag key={name}>{name}</Tag>);
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
    title: () => intl.formatMessage({ id: "created_at" }),
    dataIndex: "created_at",
  },
  {
    key: "updated_at",
    title: () => intl.formatMessage({ id: "updated_at" }),
    dataIndex: "updated_at",
  },
];
