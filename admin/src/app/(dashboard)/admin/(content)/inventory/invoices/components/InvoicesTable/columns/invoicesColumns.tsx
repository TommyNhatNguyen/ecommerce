import { ButtonDeleteWithPopover } from "@/app/shared/components/Button";
import { InvoicesModel } from "@/app/shared/models/invoices/invoices.model";
import { formatNumber } from "@/app/shared/utils/utils";
import { formatCurrency } from "@/app/shared/utils/utils";
import { Button, TableProps, Tag } from "antd";
import { Edit2Icon } from "lucide-react";
import { IntlShape } from "react-intl";

export const invoicesColumns: (
  intl: IntlShape,
  // onOpenModalUpdateInvoices: (id: string) => void,
  onDeleteInvoices: (id: string) => void,
) => TableProps<InvoicesModel>["columns"] = (
  intl,
  // onOpenModalUpdateInvoices,
  onDeleteInvoices,
) => [
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
    key: "product_name",
    title: intl.formatMessage({ id: "product_name" }),
    dataIndex: "product_name",
    render: (_, { inventory }) => {
      const productName = inventory?.product_sellable?.variant?.name || "";
      return productName;
    },
  },
  {
    key: "warehouse_name",
    title: intl.formatMessage({ id: "warehouse_name" }),
    dataIndex: "warehouse_name",
    render: (_, { warehouse }) => {
      return warehouse?.name || "";
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
    render: (_, { note }) => {
      return <div dangerouslySetInnerHTML={{ __html: note }}></div>;
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
  {
    key: "actions",
    title: () => intl.formatMessage({ id: "actions" }),
    dataIndex: "actions",
    render: (_, { id }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <Button
            type="link"
            variant="link"
            color="yellow"
            icon={<Edit2Icon width={16} height={16} />}
            onClick={() => onOpenModalUpdateInvoices(id)}
          /> */}
          <ButtonDeleteWithPopover
            trigger={"click"}
            handleDelete={() => onDeleteInvoices(id)}
            isWithDeleteConfirmPopover={false}
          />
        </div>
      );
    },
  },
];
