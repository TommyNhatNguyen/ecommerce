"use client";
import { ROUTES } from "@/app/constants/routes";
import Table from "@/app/shared/components/Table";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

type OrderTablePropsType = {
  orderData: any[];
  columns: string[];
  classes?: string;
};

const OrderTable = ({ orderData, columns, classes }: OrderTablePropsType) => {
  const [hiddenOrder, setHiddenOrder] = useState<number[]>([]);
  const _onHideOrder = (orderId: number) => {
    if (hiddenOrder.includes(orderId)) {
      setHiddenOrder(hiddenOrder.filter((id) => id !== orderId));
    } else {
      setHiddenOrder([...hiddenOrder, orderId]);
    }
  };
  return (
    <>
      {orderData.map((order: any) => {
        const { orderId, orders } = order;
        return (
          <Table
            key={orderId}
            classes={twMerge(`mb-[16px] last:mb-0`, classes)}
          >
            <Table.Head>
              <Table.Row type="header">
                {columns.map((column) => {
                  return <Table.Cell key={column}>{column}</Table.Cell>;
                })}
                <Table.Cell
                  classes="bg-white hover:bg-green-100 duration-300 cursor-pointer border border-solid border-gray-100 aspect-square w-[78px]"
                  onClick={() => _onHideOrder(orderId)}
                >
                  <ChevronDown
                    className={clsx(
                      "m-auto duration-300",
                      hiddenOrder.includes(orderId) ? "rotate-180" : "rotate-0",
                    )}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body classes={hiddenOrder.includes(orderId) ? "hidden" : ""}>
              {orders.map((order: any) => {
                const {
                  id,
                  name,
                  imgUrl,
                  status,
                  trackingId,
                  estimatedDelivery,
                  quantity,
                  price,
                  subtotal,
                  discount,
                  total,
                } = order;
                return (
                  <Table.Row key={id} type="data">
                    <Table.Cell data={`${id}`} />
                    <Table.Cell>
                      <Link
                        href={`${ROUTES.PRODUCTS}/${id}`}
                        className="flex items-center gap-[8px]"
                      >
                        <div className="max-h-[76px] max-w-[76px] overflow-hidden">
                          <img
                            src={imgUrl}
                            alt={name}
                            className="h-full w-full object-fill object-center"
                          />
                        </div>
                        <p>{name}</p>
                      </Link>
                    </Table.Cell>
                    <Table.Cell data={status} />
                    <Table.Cell data={trackingId} />
                    <Table.Cell data={estimatedDelivery} />
                    <Table.Cell data={quantity} />
                    <Table.Cell data={price} />
                    <Table.Cell data={subtotal} />
                    <Table.Cell data={discount} />
                    <Table.Cell data={total} />
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        );
      })}
    </>
  );
};

export default OrderTable;
