import Button from "@/app/shared/components/Button";
import OrderTable from "@/app/shared/components/OrderTable";
import { ChevronRight } from "lucide-react";
import React from "react";

type Props = {};
const orderData = [
  {
    orderId: 2133,
    orders: [
      {
        id: 21331,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
      {
        id: 21332,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
      {
        id: 21333,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
    ],
  },
  {
    orderId: 2134,
    orders: [
      {
        id: 21341,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
      {
        id: 21342,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
      {
        id: 21343,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
    ],
  },
  {
    orderId: 2135,
    orders: [
      {
        id: 21351,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
      {
        id: 21352,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
      {
        id: 21353,
        name: "Wax Candle",
        imgUrl:
          "https://fastly.picsum.photos/id/248/200/300.jpg?hmac=ashGQzMqYgcfv2uzjvrvXAk4cofM5A3No7_JhP1i9ks",
        status: "In Progress",
        trackingId: "1234567890",
        estimatedDelivery: "2024-01-01",
        quantity: 2,
        price: 100,
        subtotal: 200,
        discount: 10,
        total: 190,
      },
    ],
  },
];

const columns = [
  "Order Id",
  "Item",
  "Status",
  "Tracking Id",
  "Delivery Date",
  "Quantity",
  "Price",
  "Subtotal",
  "Discount",
  "Total",
];
const OrderUpcoming = (props: Props) => {
  return (
    <section
      id="orderupcoming"
      className="orderupcoming mt-[24px] overflow-y-auto"
    >
      <div className="orderupcoming__tracking">
        <Button
          variant="vanilla"
          classes="ml-auto text-body-big group underline"
        >
          <span>Tracking</span>
          <ChevronRight
            width={18}
            height={18}
            className="transition-all duration-300 group-hover:translate-x-1"
          />
        </Button>
      </div>
      <div className="orderupcoming__table max-h-[100vh] min-h-[500px] overflow-y-auto rounded-[16px] bg-gradient-to-br from-white/70 via-bg-secondary via-50% to-white/70 px-[16px] py-[12px]">
        <div className="orderupcoming__table-filters">filter</div>
        <div className="orderupcoming__table-orders">
          <OrderTable
            orderData={orderData}
            columns={columns}
            classes="shadow-sm"
          />
        </div>
      </div>
    </section>
  );
};

export default OrderUpcoming;
