import { InvoicesModel } from "@/app/shared/models/invoices/invoices.model";
import { formatNumber } from "@/app/shared/utils/utils";
import { formatCurrency } from "@/app/shared/utils/utils";
import { TableProps, Tag } from "antd";
import { IntlShape } from "react-intl";

export const invoicesColumns: (
  intl: IntlShape,
) => TableProps<InvoicesModel>["columns"] = (intl: IntlShape) => [
  {
    key: "code",
    title: intl.formatMessage({ id: "invoice_code" }),
    dataIndex: "code",
  },
  {
    key: "type",
    title: intl.formatMessage({ id: "invoice_type" }),
    dataIndex: "type",
    render: (_, { type }) => {
      return intl.formatMessage({ id: type.toLowerCase() });
    },
  },
  {
    key: "quantity",
    title: intl.formatMessage({ id: "quantity" }),
    dataIndex: "quantity",
    render: (_, { quantity }) => {
      return formatNumber(quantity);
    },
  },
  {
    key: "cost",
    title: intl.formatMessage({ id: "cost" }),
    dataIndex: "cost",
    render: (_, { cost }) => {
      return formatCurrency(cost);
    },
  },
  {
    key: "total_amount",
    title: intl.formatMessage({ id: "total_amount" }),
    dataIndex: "total_amount",
    render: (_, { amount }) => {
      return formatCurrency(amount);
    },
  },
  {
    key: "note",
    title: intl.formatMessage({ id: "note" }),
    dataIndex: "note",
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
    title: () => intl.formatMessage({ id: "created_at" }),
    dataIndex: "created_at",
  },
  {
    key: "updated_at",
    title: () => intl.formatMessage({ id: "updated_at" }),
    dataIndex: "updated_at",
  },
];
