import { OrderModel } from "@/app/shared/models/orders/orders.model";
import { TableProps, Tooltip, Image, Carousel, Select, Button } from "antd";
import { IntlShape } from "react-intl";
import {
  formatCurrency,
  formatNumber,
  formatDiscountPercentage,
} from "@/app/shared/utils/utils";
import { defaultImage } from "@/app/shared/resources/images/default-image";
import { formatDate } from "date-fns";

export const orderColumns: (
  intl: IntlShape,
) => TableProps<OrderModel>["columns"] = (intl) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (_, { id }) => (
      <Tooltip title={id}>
        <Button
          type="link"
          className="overflow-hidden text-ellipsis break-all"
          // onClick={() => handleOpenModalDetail(id)}
        >
          {id.substring(0, 10)}
        </Button>
      </Tooltip>
    ),
    ellipsis: true,
  },
  {
    title: "Customer Name",
    dataIndex: "customer_name",
    key: "customer_name",
    render: (_, { order_detail }) => {
      const {
        customer_address,
        customer_email,
        customer_phone,
        customer_firstName,
        customer_lastName,
      } = order_detail || {};
      const customer_name = `${customer_firstName} ${customer_lastName}`;
      return (
        <Tooltip
          title={
            <div className="flex flex-col gap-1">
              <span>Address: {customer_address}</span>
              <span>Email: {customer_email}</span>
              <span>Phone: {customer_phone}</span>
            </div>
          }
          className="text-ellipsis"
        >
          {customer_name}
        </Tooltip>
      );
    },
  },
  {
    title: "Shipping Address",
    dataIndex: "shipping_address",
    key: "shipping_address",
    render: (_, { order_detail }) => {
      const { customer_address } = order_detail || {};
      return (
        <Tooltip title={customer_address}>
          <p className="overflow-hidden text-ellipsis">{customer_address}</p>
        </Tooltip>
      );
    },
  },
  {
    title: "Shipping Phone",
    dataIndex: "shipping_phone",
    key: "shipping_phone",
    render: (_, { order_detail }) => {
      const { customer_phone } = order_detail || {};
      return (
        <Tooltip title={customer_phone}>
          <p className="overflow-hidden text-ellipsis">{customer_phone}</p>
        </Tooltip>
      );
    },
  },
  {
    title: "Subtotal",
    dataIndex: "subtotal",
    key: "subtotal",
    render: (_, { order_detail }) => {
      const { subtotal } = order_detail || {};
      return <span>{formatCurrency(subtotal)}</span>;
    },
  },
  {
    title: "Total Discount",
    dataIndex: "total_discount",
    key: "total_discount",
    render: (_, { order_detail }) => {
      const { total_discount } = order_detail || {};
      return <span>{formatCurrency(total_discount)}</span>;
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (_, { order_detail }) => {
      const { total } = order_detail || {};
      return (
        <Tooltip title={formatCurrency(total)}>
          <span>{formatCurrency(total)}</span>
        </Tooltip>
      );
    },
  },
  {
    title: "Paid Amount",
    dataIndex: "paid_amount",
    key: "paid_amount",
    render: (_, { order_detail }) => {
      const { payment } = order_detail || {};
      return (
        <Tooltip title={formatCurrency(payment?.paid_amount || 0)}>
          <span>{formatCurrency(payment?.paid_amount || 0)}</span>
        </Tooltip>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    fixed: "right",
    render: (_, { created_at }) => (
      <Tooltip title={created_at}>
        <span>{formatDate(created_at, "dd/MM/yyyy HH:mm")}</span>
      </Tooltip>
    ),
  },
];
