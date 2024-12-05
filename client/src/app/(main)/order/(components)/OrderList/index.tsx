"use client";

import { ROUTES } from "@/app/constants/routes";
import OrderTable from "@/app/shared/components/OrderTable";
import Table from "@/app/shared/components/Table";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
const OrderList = (props: Props) => {
  return (
    <section id="orderlist" className="orderlist mt-[16px]">
      <OrderTable orderData={orderData} columns={columns} />
    </section>
  );
};

export default OrderList;
