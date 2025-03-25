import { IntlShape } from "react-intl";
import { TableProps } from "antd";

export const inventoryCheckColumns: (
  intl: IntlShape,
) => TableProps<any>["columns"] = (intl: IntlShape) => [
  {
    key: "index",
    title: intl.formatMessage({ id: "index" }),
    dataIndex: "index",
    render: (_, { index }) => {
      return index + 1;
    },
  },
  {
    key: "sku",
    title: intl.formatMessage({ id: "sku" }),
    dataIndex: "sku",
  },
  {
    key: "product_name",
    title: intl.formatMessage({ id: "product_name" }),
    dataIndex: "product_name",
  },
  {
    key: "system_quantity",
    title: intl.formatMessage({ id: "system_quantity" }),
    dataIndex: "system_quantity",
  },
  {
    key: "actual_quantity",
    title: intl.formatMessage({ id: "actual_quantity" }),
    dataIndex: "actual_quantity",
  },
  {
    key: "difference_quantity",
    title: intl.formatMessage({ id: "difference_quantity" }),
    dataIndex: "difference_quantity",
  },
  {
    key: "difference_amount",
    title: intl.formatMessage({ id: "difference_amount" }),
    dataIndex: "difference_amount",
  },
];
