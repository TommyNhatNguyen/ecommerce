import { formatCurrency } from "@/app/shared/utils/utils";
import { ADMIN_ROUTES } from "@/app/constants/routes";
import Link from "next/link";
import React from "react";
import { OrderModel } from "@/app/shared/models/orders/orders.model";
import { formatDate } from "date-fns";

type Props = {
  orderCreated: OrderModel;
  href?: string;
} & React.ComponentProps<typeof Link>;

const OrderNotification = ({
  orderCreated,
  href = ADMIN_ROUTES.orders.index,
  ...props
}: Props) => {
  return (
    <Link href={href} {...props}>
      {/* Customer name */}
      <p className="mb-2 font-roboto-medium">
        <span className="font-roboto-bold">
          {orderCreated.order_detail?.customer_firstName}{" "}
          {orderCreated.order_detail?.customer_lastName} has created an order
          at{" "}
        </span>
        {formatDate(orderCreated.created_at, "dd/MM/yyyy")}
      </p>
      {/* Order detail */}
      <p className="mb-2 font-roboto-medium">
        <span className="font-roboto-bold">Order total:</span>{" "}
        {formatCurrency(orderCreated.order_detail?.total)}
      </p>
    </Link>
  );
};

type TitleProps = {
  title?: string;
  href?: string;
} & React.ComponentProps<typeof Link>;

OrderNotification.Title = ({
  title = "New Order",
  href = ADMIN_ROUTES.orders.index,
  ...props
}: TitleProps) => {
  return (
    <Link href={href} {...props}>
      {title}
    </Link>
  );
};

export default OrderNotification;
