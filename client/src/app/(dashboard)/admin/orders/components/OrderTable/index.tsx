"use client";
import { DiscountModel } from "@/app/shared/models/discounts/discounts.model";
import { ImageModel } from "@/app/shared/models/images/images.model";
import { orderService } from "@/app/shared/services/orders/orderService";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Table, TableColumnType, TableProps } from "antd";
import React, { useState } from "react";

type Props = {};
type OrderTableDataType = {
  key: string;
  id: string;
  order_state: string;
  customer_name: string;
  shipping_address: string;
  shipping_phone: string;
  shipping_method: string;
  payment_method: string;
  total_price: number;
  total_discount: number;
  total_shipping_fee: number;
  total_payment_fee: number;
  total: number;
  created_at: string;
  status: string;
};
type ProductTableDataType = {
  key: string;
  id: string;
  images: ImageModel[];
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  discount: DiscountModel[];
  total: number;
};
type OnChange = NonNullable<TableProps<OrderTableDataType>["onChange"]>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;
const OrderTable = (props: Props) => {
  const [orderPage, setOrderPage] = useState(1);
  const [orderLimit, setOrderLimit] = useState(10);
  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});
  const { data: ordersDataResponse, isLoading } = useQuery({
    queryKey: ["orders", orderPage, orderLimit],
    queryFn: () =>
      orderService.getList({
        page: orderPage,
        limit: orderLimit,
      }),
  });
  const { meta, data: ordersData } = ordersDataResponse || {};
  const { total_count } = meta || {};
  const orderDataSource = ordersData?.map((order) => ({
    key: order.id,
    id: order.id,
    order_state: order.order_state,
    customer_name: order.customer_name,
    shipping_address: order.shipping_address,
    shipping_phone: order.shipping_phone,
    shipping_method: order.shipping.type,
    payment_method: order.payment.type,
    total_price: order.total_price,
    total_discount: order.product.reduce(
      (acc, product) =>
        acc +
        ((product.discount?.reduce(
          (discountAcc, discount) =>
            discountAcc + (discount.discount_percentage || 0),
          0,
        ) || 0) /
          100) *
          product.order_detail.subtotal,
      0,
    ),
    total_shipping_fee: order.shipping.cost,
    total_payment_fee: order.payment.fee,
    total:
      order.total_price -
      order.product.reduce(
        (acc, product) =>
          acc +
          ((product.discount?.reduce(
            (discountAcc, discount) =>
              discountAcc + (discount.discount_percentage || 0),
            0,
          ) || 0) /
            100) *
            product.order_detail.subtotal,
        0,
      ) -
      order.shipping.cost -
      order.payment.fee,
    created_at: order.created_at,
    status: order.status,
  }));
  const orderColumns: TableColumnType<OrderTableDataType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
    },
    {
      title: "Order State",
      dataIndex: "order_state",
      key: "order_state",
    },
    {
      title: "Shipping Address",
      dataIndex: "shipping_address",
      key: "shipping_address",
    },
    {
      title: "Shipping Phone",
      dataIndex: "shipping_phone",
      key: "shipping_phone",
    },
    {
      title: "Shipping Method",
      dataIndex: "shipping_method",
      key: "shipping_method",
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
    {
      title: "Total Discount",
      dataIndex: "total_discount",
      key: "total_discount",
    },
    {
      title: "Total Shipping Fee",
      dataIndex: "total_shipping_fee",
      key: "total_shipping_fee",
    },
    {
      title: "Total Payment Fee",
      dataIndex: "total_payment_fee",
      key: "total_payment_fee",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      fixed: "right",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      fixed: "right",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
    },
  ];
  const productColumns: TableColumnType<ProductTableDataType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];
  const _onChangeTable: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };
  const _onSelectRow = (
    record: OrderTableDataType,
    selected: boolean,
    selectedRows: OrderTableDataType[],
  ) => {
    // handleSelectRow(record, selected, selectedRows);
  };
  const _onSelectAllRow = (
    selected: boolean,
    selectedRows: OrderTableDataType[],
    changeRows: OrderTableDataType[],
  ) => {
    // handleSelectAllRow(selected, selectedRows, changeRows);
  };
  const orderExpandedRowRender = () => {
    return (
      <Table<ProductTableDataType>
        columns={productColumns}
        // dataSource={productDataSource}
        pagination={false}
        size="small"
      />
    );
  };
  return (
    <div className="order-table rounded-lg bg-white p-4">
      <h2 className={cn("order-table__title", "text-lg font-semibold")}>
        Orders
      </h2>
      <div>
        <Table
          columns={orderColumns}
          dataSource={orderDataSource}
          expandable={{
            expandedRowRender: orderExpandedRowRender,
            expandRowByClick: true,
          }}
          onChange={_onChangeTable}
          scroll={{ x: "100vw" }}
          rowKey={(record) => record.id}
          rowSelection={{
            onSelect: (record, selected, selectedRows, nativeEvent) =>
              _onSelectRow(record, selected, selectedRows),
            onSelectAll: (selected, selectedRows, changeRows) =>
              _onSelectAllRow(selected, selectedRows, changeRows),
          }}
          pagination={{
            current: orderPage,
            pageSize: orderLimit,
            total: total_count,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 40, 50, Number(total_count)],
            onChange: (page, pageSize) => {
              setOrderPage(page);
              setOrderLimit(pageSize);
            },
          }}
        />
      </div>
    </div>
  );
};

export default OrderTable;
